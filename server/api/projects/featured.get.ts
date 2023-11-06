import Project from "../../../interfaces/project";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const db_projects = await prisma.project.findMany({
      include: { skills: true, imageUrls: true },
      where: { featured: true },
    });

    const projects: Project[] = db_projects.map((prj) => {
      return {
        id: prj.id,
        title: prj.title,
        description: prj.description,
        commission: prj.commission,
        featured: prj.featured,
        imageUrls: prj.imageUrls.map((img) => img.url),
        sourceCodeUrl: prj.sourceCodeUrl,
        downloadUrl: prj.downloadUrl,
        skills: prj.skills.map((sk) => {
          return {
            id: sk.id,
            name: sk.name,
            platform: sk.platform,
            subplatform: sk.subplatform,
          };
        }),
      };
    });

    return projects;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error while fetching featured projects",
      cause: error,
    });
  } finally {
    prisma.$disconnect();
  }
});
