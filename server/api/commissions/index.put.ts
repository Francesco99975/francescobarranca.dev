import Commission from "../../../interfaces/commission";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<Commission>(event);
    const commission = await prisma.commission.update({
      where: { id: data.id },
      data: {
        accepted: data.accepted,
        completed: data.completed,
      },
    });
    return commission;
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
