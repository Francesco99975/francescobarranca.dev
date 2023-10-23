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
import * as fs from "fs/promises";
import handlebars from "handlebars";
import puppeteer from "puppeteer";
import path from "path";

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
        include: { customer: true },
        data: {
          price: data.price,
          subscription: data.subscription,
          status: Status.PENDING,
        },
      });

      const fullName =
        commission.customer.firstname + commission.customer.middlename !==
          null &&
        commission.customer.middlename &&
        commission.customer.middlename.length > 0
          ? commission.customer.middlename + " " + commission.customer.lastname
          : commission.customer.lastname;

      generateContract(
        commission.id,
        fullName,
        commission.customer.address,
        commission.price / 100,
        commission.subscription / 100
      );
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

async function generateContract(
  comm_id: string,
  clientFullName: string,
  clientAddress: string,
  price: number,
  subscription: number
) {
  try {
    const web_contract_source = await fs.readFile(
      path.resolve("server/templates_pdf/web_contract.hbs"),
      "utf-8"
    );

    const web_contract_template = handlebars.compile(web_contract_source);

    const web_contract = web_contract_template({
      dev_name: process.env.DEV_NAME || "DEV",
      dev_address: process.env.DEV_ADDRESS || "DEV ADRRS",
      client_name: clientFullName,
      client_address: clientAddress,
      purchase_price: price.toFixed(2),
      subscription_price: subscription.toFixed(2),
    });

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(web_contract);
    await page.pdf({ path: `web_contract_${comm_id}.pdf`, format: "LEGAL" });
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}
