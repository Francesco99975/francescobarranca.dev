import Project from "../../../interfaces/project";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    const prj = await prisma.project.findFirst({
      include: { skills: true, imageUrls: true },
      where: { id },
    });

    if (!prj) return;

    const project: Project = {
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

    return project;
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
