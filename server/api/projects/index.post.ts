import { IncomingMessage } from "http";
import Project from "../../../interfaces/project";
import { prisma } from "../../db.server";
import { FileJSON, formidable } from "formidable";
import axios from "axios";
import * as fsl from "fs";
import FormData from "form-data";

const easypixServerUrl =
  process.env.NODE_ENV === "production"
    ? "http://devmedia"
    : "http://localhost:8888";

const uploadEndpoint = `${easypixServerUrl}/upload`;

const uploadFileToEasypix = async (fileData: FileJSON): Promise<string> => {
  try {
    const formData = new FormData();

    const fileStream = fsl.createReadStream(fileData.filepath);
    formData.append("file", fileStream);
    // Make a POST request to the EasyPix upload endpoint
    const response = await axios.post<{ url: string }>(
      uploadEndpoint,
      formData
    );

    // Handle the EasyPix response
    const loc = response.data.url;
    const url: string =
      (uploadEndpoint.includes("dev")
        ? "http://francescobarranca.dev/media"
        : "http://localhost:8888") + loc;

    return url;
  } catch (error) {
    console.error("Error uploading file to EasyPix", error);
    throw createError("Error uploading file to EasyPix");
  }
};

function handleMultiPartFormData(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ ...fields, ...files });
    });
  });
}
export default defineEventHandler(async (event) => {
  try {
    const body: any[] = Object.values(
      await handleMultiPartFormData(event.node.req)
    );

    const data: Project = JSON.parse(body.shift()[0]);

    const files: FileJSON[] = [];

    while (body.length > 0) {
      files.push(body.shift()[0] as FileJSON);
    }

    const imageUrls: string[] = [];

    for (const file of files) {
      imageUrls.push(await uploadFileToEasypix(file));
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        commission: data.commission,
        featured: data.featured,
        downloadUrl: data.downloadUrl,
        sourceCodeUrl: data.sourceCodeUrl,
        imageUrls: {
          createMany: {
            data: imageUrls.map((img) => {
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
    throw createError({
      statusCode: 500,
      message: "Error while creating project",
      cause: error,
    });
  } finally {
    prisma.$disconnect();
  }
});
