import Commission from "../../../interfaces/commission";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const comm = await prisma.commission.findFirst({
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
      pages: comm.pages,
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
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
