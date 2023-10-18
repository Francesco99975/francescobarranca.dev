import { Status } from "@prisma/client";
import { prisma } from "../../db.server";
import { ServerClient } from "postmark";
import {
  ACCEPT_INSTRUCTIONS,
  COMM_PRG,
  COMM_RES,
  COMPLETED_INSTRUCTIONS,
  INVOICING_INSTRUCTIONS,
  WEBSITE_EMAIL,
  WEBSITE_NAME,
  WEBSITE_URL,
  WORK_IN_PROGRESS_NOTIF,
} from "../../constants.server";
import Commission from "../../../interfaces/commission";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<{
      id: string;
      price?: number;
      subscription?: number;
      status?: Status;
    }>(event);
    let commission;
    if (data.price) {
      commission = await prisma.commission.update({
        where: { id: data.id },
        include: { customer: { select: { email: true } } },
        data: {
          price: data.price,
          subscription: data.subscription,
          status: Status.PENDING,
        },
      });
    } else {
      commission = await prisma.commission.update({
        where: { id: data.id },
        include: { customer: { select: { email: true } } },
        data: {
          status: data.status,
        },
      });
    }

    const client = new ServerClient(process.env.POSTMARK_API_KEY!);

    switch (commission.status) {
      case Status.PENDING:
        client.sendEmailWithTemplate({
          From: WEBSITE_EMAIL,
          To: commission.customer.email,
          TemplateAlias: COMM_RES,
          TemplateModel: {
            product_url: WEBSITE_URL,
            product_name: WEBSITE_NAME,
            commission_title: commission.subject,
            event_detail: "Accepted",
            instructions: ACCEPT_INSTRUCTIONS,
          },
        });
        break;
      case Status.ACCEPTED:
        client.sendEmailWithTemplate({
          From: WEBSITE_EMAIL,
          To: commission.customer.email,
          TemplateAlias: COMM_PRG,
          TemplateModel: {
            product_url: WEBSITE_URL,
            product_name: WEBSITE_NAME,
            commission_title: commission.subject,
            event_detail: "in the works!",
            instructions: WORK_IN_PROGRESS_NOTIF,
          },
        });
        break;
      case Status.INVOICING:
        client.sendEmailWithTemplate({
          From: WEBSITE_EMAIL,
          To: commission.customer.email,
          TemplateAlias: COMM_PRG,
          TemplateModel: {
            product_url: WEBSITE_URL,
            product_name: WEBSITE_NAME,
            commission_title: commission.subject,
            event_detail: "awaiting a payment",
            instructions: INVOICING_INSTRUCTIONS,
          },
        });
        break;
      case Status.COMPLETED:
        client.sendEmailWithTemplate({
          From: WEBSITE_EMAIL,
          To: commission.customer.email,
          TemplateAlias: COMM_PRG,
          TemplateModel: {
            product_url: WEBSITE_URL,
            product_name: WEBSITE_NAME,
            commission_title: commission.subject,
            event_detail: "completed and finalized!",
            instructions: COMPLETED_INSTRUCTIONS,
          },
        });
        break;
    }

    const comm: Commission = {
      id: commission.id,
      description: commission.description,
      environ: commission.environment,
      pages: commission.pages,
      pwa: commission.pwa,
      subject: commission.subject,
      theme: commission.theme,
      createdAt: commission.createdAt,
      price: commission.price,
      status: commission.status,
      subscription: commission.subscription,
      updatedAt: commission.updatedAt,
    };
    return { commission: comm, customerEmail: commission.customer.email };
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
