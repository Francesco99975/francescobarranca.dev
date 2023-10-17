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
        event_detail: "Rejected",
        instructions: REJECT_INSTRUCTIONS,
      },
    });

    return commission;
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
