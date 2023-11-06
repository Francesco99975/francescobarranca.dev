import axios from "axios";
import Project from "../../../interfaces/project";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<Project>(event);
    const project = await prisma.project.delete({
      where: { id: data.id },
      include: { imageUrls: true },
    });

    const BASE_MEDIA_URL =
      process.env.NODE_ENV === "production"
        ? "http://francescobarranca.dev/media"
        : "http://localhost:8888";

    for (const img of project.imageUrls) {
      await axios.delete(
        `${BASE_MEDIA_URL}/delete/${img.url.substring(
          img.url.lastIndexOf("/") + 1,
          img.url.indexOf(".")
        )}`
      );
    }

    return { project };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Error while deleting project",
      cause: error,
    });
  } finally {
    prisma.$disconnect();
  }
});
