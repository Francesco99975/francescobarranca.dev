import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const projects = await prisma.project.findMany({
      include: { skills: true },
    });
    return { projects };
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
