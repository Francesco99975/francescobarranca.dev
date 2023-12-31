import Commission from "../../../interfaces/commission";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const comm = await prisma.commission.findFirst({
      where: { id },
      include: { customer: { select: { email: true } } },
    });

    if (!comm) {
      return;
    }

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

    const data: { commission: Commission; customerEmail: string } = {
      commission,
      customerEmail,
    };

    return data;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error while fetching commission",
      cause: error,
    });
  } finally {
    prisma.$disconnect();
  }
});
