import Skill from "../../../interfaces/skill";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  const data = await readBody<Skill>(event);
  try {
    const skill = await prisma.skill.update({
      where: { id: data.id },
      data: {
        name: data.name,
        platform: data.platform,
        subplatform: data.subplatform,
        projects: {
          connect: !data.projects
            ? []
            : data.projects.map((prj) => {
                return { id: prj.id };
              }),
        },
      },
    });
    return { skill };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error while updating skill",
      cause: error,
    });
  } finally {
    prisma.$disconnect();
  }
});
