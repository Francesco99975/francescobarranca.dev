import Skill from "../../../interfaces/skill";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  const data = await readBody<Skill>(event);
  try {
    const skill = await prisma.skill.delete({ where: { id: data.id } });
    return { skill };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error while deleting skill",
      cause: error,
    });
  } finally {
    prisma.$disconnect();
  }
});
