import Commission from "../../../interfaces/commission";
import { Customer } from "../../../interfaces/customer";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<{
      commission: Commission;
      customer: Customer;
      privacyPolicyAgreed: boolean;
    }>(event);

    if (!data.privacyPolicyAgreed)
      return "Agree to the privacy policy to submit commission";

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
          lastname: data.customer.lastname,
          middlename: data.customer.middlename || undefined,
          commissions: {
            create: {
              subject: data.commission.subject,
              description: data.commission.description,
              theme: data.commission.theme,
              pwa: data.commission.pwa,
              environment: data.commission.environ,
            },
          },
        },
      });
    } else {
      await prisma.customer.update({
        where: { email: data.customer.email },
        data: {
          commissions: {
            create: {
              subject: data.commission.subject,
              description: data.commission.description,
              theme: data.commission.theme,
              pwa: data.commission.pwa,
              environment: data.commission.environ,
            },
          },
        },
      });
    }

    return "success";
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error while adding commission",
      cause: error,
    });
  } finally {
    prisma.$disconnect();
  }
});
