import { prisma } from "../db.server";

export default defineEventHandler(async (event) => {
  try {
    const skills = await prisma.skill.findMany();
    return skills;
  } catch (error) {}
});
