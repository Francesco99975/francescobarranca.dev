import { Status } from "@prisma/client";
import { prisma } from "../../db.server";
import { ServerClient } from "postmark";
import {
  ACCEPT_INSTRUCTIONS,
  COMM_CTR,
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
import PDFMerger from "pdf-merger-js";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const data = await readBody<{
      id: string;
      price?: number;
      subscription?: number;
      status?: Status;
    }>(event);

    let commission;
    const client = new ServerClient(config.POSTMARK_API_KEY!);

    if (data.price) {
      commission = await prisma.commission.update({
        where: { id: data.id },
        include: { customer: true },
        data: {
          price: data.price * 100,
          subscription: data.subscription ? data.subscription * 100 : 0,
          status: Status.PENDING,
        },
      });

      const fullName =
        commission.customer.firstname +
        " " +
        (commission.customer.middlename !== null &&
        commission.customer.middlename &&
        commission.customer.middlename.length > 0
          ? commission.customer.middlename + " " + commission.customer.lastname
          : commission.customer.lastname);

      const contract_path: string = await generateContract(
        commission.id,
        fullName,
        commission.customer.address,
        commission.price / 100,
        commission.subscription / 100,
        commission.subject,
        commission.description,
        commission.theme,
        commission.pwa,
        commission.environment,
        config.DEV_NAME,
        config.DEV_ADDRESS
      );

      client
        .sendEmailWithTemplate({
          From: WEBSITE_EMAIL,
          To: WEBSITE_EMAIL,
          TemplateAlias: COMM_CTR,
          TemplateModel: {
            product_url: WEBSITE_URL,
            product_name: WEBSITE_NAME,
            comm_id: commission.id,
            comm_name: commission.subject,
          },
          Attachments: [
            {
              Name: contract_path,
              Content: (await fs.readFile(contract_path)).toString("base64"),
              ContentType: "application/pdf",
              ContentID: commission.id,
            },
          ],
        })
        .finally(() => fs.unlink(contract_path));
    } else {
      commission = await prisma.commission.update({
        where: { id: data.id },
        include: { customer: { select: { email: true } } },
        data: {
          status: data.status,
        },
      });
    }

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
    throw createError({
      statusCode: 500,
      message: "Error while updating commission",
      cause: error,
    });
  } finally {
    prisma.$disconnect();
  }
});

async function generateContract(
  comm_id: string,
  clientFullName: string,
  clientAddress: string,
  price: number,
  subscription: number,
  comm_name: string,
  comm_desc: string,
  comm_theme: string,
  comm_pwa: boolean,
  comm_type: string,
  devName: string,
  devAddress: string
): Promise<string> {
  try {
    const BASE_PATH = "server/templates_pdf";

    let contractDir = "";
    let contractTitle = "";

    if (comm_type.toLowerCase().includes("web")) {
      contractDir = "web";
      contractTitle = "PURCHASE AGREEMENT FOR WEBSITE DESIGN & DEVELOPMENT";
    } else if (comm_type.toLowerCase().includes("mobile")) {
      contractDir = "mobile";
      contractTitle =
        "PURCHASE AGREEMENT FOR MOBILE APPICATION DESIGN & DEVELOPMENT";
    } else if (comm_type.toLowerCase().includes("desktop")) {
      contractDir = "desktop";
      contractTitle =
        "PURCHASE AGREEMENT FOR DESKTOP APPICATION DESIGN & DEVELOPMENT";
    } else if (comm_type.toLowerCase().includes("cli")) {
      contractDir = "cli";
      contractTitle = "CLI APPLICATION PURCHASE AGREEMENT";
    } else return "";

    const contract_source_1 = await fs.readFile(
      path.resolve(`${BASE_PATH}/${contractDir}/contract_1.hbs`),
      "utf-8"
    );
    const contract_source_2 = await fs.readFile(
      path.resolve(`${BASE_PATH}/${contractDir}/contract_2.hbs`),
      "utf-8"
    );
    const contract_source_3 = await fs.readFile(
      path.resolve(`${BASE_PATH}/${contractDir}/contract_3.hbs`),
      "utf-8"
    );
    const sign_source = await fs.readFile(
      path.resolve(`${BASE_PATH}/sign.hbs`),
      "utf-8"
    );
    const contract_end_source = await fs.readFile(
      path.resolve(`${BASE_PATH}/contract_end.hbs`),
      "utf-8"
    );
    const exhibit_a_source = await fs.readFile(
      path.resolve(`${BASE_PATH}/exhibit_a.hbs`),
      "utf-8"
    );

    const contract_template_1 = handlebars.compile(contract_source_1);
    const contract_template_2 = handlebars.compile(contract_source_2);
    const contract_template_3 = handlebars.compile(contract_source_3);
    const sign_template = handlebars.compile(sign_source);
    const contract_end_template = handlebars.compile(contract_end_source);
    const exhibit_a_template = handlebars.compile(exhibit_a_source);
    const numberFormatter = new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    });
    const contract_1 = contract_template_1({
      dev_name: devName || "DEV",
      dev_address: devAddress || "DEV ADRRS",
      client_name: clientFullName,
      client_address: clientAddress,
      purchase_price: numberFormatter.format(price),
      subscription_price: numberFormatter.format(subscription),
      project_name: comm_name,
      title: contractTitle,
    });
    const contract_2 = contract_template_2({
      project_name: comm_name,
      title: contractTitle,
    });
    const contract_3 = contract_template_3({
      project_name: comm_name,
      title: contractTitle,
    });
    const sign = sign_template({
      project_name: comm_name,
      client_name: clientFullName,
      client_address: clientAddress,
      title: contractTitle,
    });
    const contract_end = contract_end_template({ project_name: comm_name });
    const exhibit_a = exhibit_a_template({
      project_name: comm_name,
      features_description: comm_desc,
      theme_description: comm_theme,
      pwa: comm_pwa,
      project_type: comm_type,
    });

    const html_files = [
      contract_1,
      contract_2,
      contract_3,
      sign,
      contract_end,
      exhibit_a,
    ];
    const merger = new PDFMerger();
    const browser = await puppeteer.launch({ headless: "new" });
    for (let index = 0; index < html_files.length; index++) {
      const pathTmp = `web_tmp_${index + 1}_${comm_id}.pdf`;
      const page = await browser.newPage();
      await page.setContent(html_files[index]);
      await page.pdf({
        path: pathTmp,
        format: "LEGAL",
      });
      await merger.add(pathTmp);
    }
    await browser.close();
    const contract_path = `web_contract_${comm_id}.pdf`;
    await merger.save(contract_path);
    for (let index = 0; index < html_files.length; index++) {
      const pathTmp = `web_tmp_${index + 1}_${comm_id}.pdf`;
      fs.unlink(pathTmp);
    }

    return contract_path;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error while creating contract",
      cause: error,
    });
  }
}
