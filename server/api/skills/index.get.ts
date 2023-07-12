import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const skills = await prisma.skill.findMany({ include: { projects: true } });
    return { skills };
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
