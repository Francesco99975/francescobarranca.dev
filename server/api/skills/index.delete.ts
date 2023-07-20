import Skill from "../../../interfaces/skill";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  const data = await readBody<Skill>(event);
  try {
    const skill = await prisma.skill.delete({ where: { id: data.id } });
    return { skill };
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
