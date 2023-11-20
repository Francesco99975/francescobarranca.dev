import Commission from "../../../interfaces/commission";
import { Customer } from "../../../interfaces/customer";
import { prisma } from "../../db.server";

const addressRegex =
  /^(?=.*\b\d)(?=.*\b\w)(?=.*\b\w+\s+\w+)(?=.*\b\w+)(?=.*\b\w+\s*\d+)(?=.*(\b\d{5}\b|\b[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}\b))(?=.*\b\w+\s*\d+\s*\w*\s*\d*\s*\d*)[\s\S]{3,}$/;

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<{
      commission: Commission;
      customer: Customer;
      privacyPolicyAgreed: boolean;
    }>(event);

    if (!data.privacyPolicyAgreed)
      throw createError({
        statusCode: 401,
        message: "Agree to the privacy policy to submit commission",
      });

    if (
      Object.values({ ...data.commission, ...data.customer })
        .filter((x) => typeof x === "string")
        .some((x) => x.toString().trim().length <= 0)
    ) {
      throw createError({
        statusCode: 401,
        message: "Invalid data",
      });
    }

    if (
      !data.customer.email.match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      )
    ) {
      throw createError({
        statusCode: 401,
        message: "Invalid Email",
      });
    }

    if (!data.customer.address.match(addressRegex)) {
      throw createError({
        statusCode: 401,
        message: "Invalid Address",
      });
    }

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
