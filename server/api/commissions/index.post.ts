import Commission from "../../../interfaces/commission";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<{
      commission: Commission;
      customerEmail: string;
    }>(event);

    const existingCustomer = await prisma.customer.findFirst({
      where: { email: data.customerEmail },
      include: { commissions: true },
    });

    if (!existingCustomer) {
      await prisma.customer.create({
        data: {
          email: data.customerEmail,
          commissions: {
            createMany: {
              data: [
                {
                  subject: data.commission.subject,
                  description: data.commission.description,
                  theme: data.commission.theme,
                  pages: data.commission.pages,
                  pwa: data.commission.pwa,
                  static: data.commission.static,
                  environment: data.commission.environ,
                },
              ],
            },
          },
        },
      });
    } else {
      await prisma.customer.update({
        where: { email: data.customerEmail },
        data: {
          commissions: {
            createMany: {
              data: [
                ...existingCustomer.commissions,
                {
                  subject: data.commission.subject,
                  description: data.commission.description,
                  theme: data.commission.theme,
                  pages: data.commission.pages,
                  pwa: data.commission.pwa,
                  static: data.commission.static,
                  environment: data.commission.environ,
                },
              ],
            },
          },
        },
      });
    }

    return "success";
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
