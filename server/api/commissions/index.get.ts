import Commission from "../../../interfaces/commission";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const db_comms = await prisma.commission.findMany({
      include: { customer: { select: { email: true } } },
    });

    const data: { commission: Commission; customerEmail: string }[] =
      db_comms.map((comm) => {
        const commission = {
          id: comm.id,
          subject: comm.subject,
          description: comm.description,
          theme: comm.description,
          environ: comm.environment,
          pwa: comm.pwa,
          status: comm.status,
          createdAt: comm.createdAt,
          updatedAt: comm.updatedAt,
          price: comm.price,
          subscription: comm.subscription,
        };

        const customerEmail = comm.customer.email;

        return { commission, customerEmail };
      });

    return data;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error while fetching commissions",
      cause: error,
    });
  } finally {
    prisma.$disconnect();
  }
});
