import Commission from "../../../interfaces/commission";
import { Customer } from "../../../interfaces/customer";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<{
      commission: Commission;
      customer: Customer;
    }>(event);

    const existingCustomer = await prisma.customer.findFirst({
      where: { email: data.customer.email },
      include: { commissions: true },
    });

    if (!existingCustomer) {
      await prisma.customer.create({
        data: {
          email: data.customer.email,
          address: data.customer.address,
          firstname: data.customer.firstname,
          lastname: data.customer.address,
          middlename: data.customer.middlename || undefined,
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
        where: { email: data.customer.email },
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
