import Project from "../../../interfaces/project";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<Project>(event);
    const project = await prisma.project.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        commission: data.commission,
        featured: data.featured,
        downloadUrl: data.downloadUrl,
        sourceCodeUrl: data.sourceCodeUrl,
        imageUrls: {
          createMany: {
            data: data.imageUrls.map((img) => {
              return {
                url: img,
              };
            }),
          },
        },
        skills: {
          connect: data.skills!.map((skill) => {
            return { id: skill.id };
          }),
        },
      },
    });
    return { project };
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
