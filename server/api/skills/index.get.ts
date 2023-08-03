import Skill from "../../../interfaces/skill";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const db_skills = await prisma.skill.findMany({
      include: { projects: { include: { imageUrls: true } } },
    });

    const skills: Skill[] = db_skills.map((sk) => {
      return {
        id: sk.id,
        name: sk.name,
        platform: sk.platform,
        subplatform: sk.subplatform,
        projects: sk.projects.map((prj) => {
          return {
            id: prj.id,
            title: prj.title,
            description: prj.description,
            commission: prj.commission,
            featured: prj.featured,
            imageUrls: prj.imageUrls.map((img) => img.url),
            sourceCodeUrl: prj.sourceCodeUrl,
            downloadUrl: prj.downloadUrl,
          };
        }),
      };
    });

    return skills;
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
