import Project from "../../../interfaces/project";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<Project>(event);
    const project = await prisma.project.delete({ where: { id: data.id } });
    return { project };
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
