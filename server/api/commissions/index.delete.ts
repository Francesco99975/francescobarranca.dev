import Commission from "../../../interfaces/commission";
import {
  COMM_RES,
  REJECT_INSTRUCTIONS,
  WEBSITE_EMAIL,
  WEBSITE_NAME,
  WEBSITE_URL,
} from "../../constants.server";
import { prisma } from "../../db.server";
import { ServerClient } from "postmark";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<Commission>(event);
    const commission = await prisma.commission.delete({
      where: { id: data.id },
      include: { customer: { select: { email: true } } },
    });

    const client = new ServerClient(process.env.POSTMARK_API_KEY!);

    client.sendEmailWithTemplate({
      From: WEBSITE_EMAIL,
      To: commission.customer.email,
      TemplateAlias: COMM_RES,
      TemplateModel: {
        product_url: WEBSITE_URL,
        product_name: WEBSITE_NAME,
        commission_title: commission.subject,
        event_detail: "Rejected",
        instructions: REJECT_INSTRUCTIONS,
      },
    });

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
