import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<{
      id: string;
      price?: number;
      subscription?: number;
      accepted?: boolean;
      completed?: boolean;
    }>(event);
    let commission;
    if (data.price) {
      commission = await prisma.commission.update({
        where: { id: data.id },
        data: {
          price: data.price,
          subscription: data.subscription,
        },
      });
    } else {
      commission = await prisma.commission.update({
        where: { id: data.id },
        data: {
          accepted: data.accepted,
          completed: data.completed,
        },
      });
    }
    return commission;
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
