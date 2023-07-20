import Skill from "../../../interfaces/skill";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  const data = await readBody<Skill>(event);
  try {
    const skills = await prisma.skill.create({
      data: {
        name: data.name,
        platform: {
          create: data.platform,
        },
        projects: {
          createMany: {
            data: data.projects!.map((p) => {
              return { projectId: p.id! };
            }),
          },
        },
      },
    });
    return { skills };
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
