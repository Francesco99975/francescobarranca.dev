import { IncomingMessage } from "http";
import Project from "../../../interfaces/project";
import { prisma } from "../../db.server";
import { FileJSON, formidable } from "formidable";
import axios from "axios";
import * as fs from "fs/promises";

// Thumbor server URL
const thumborServerUrl = "http://localhost:8888";

// Endpoint for uploading images to Thumbor
const uploadEndpoint = `${thumborServerUrl}/image`;

// Function to upload a file to Thumbor
const uploadFileToThumbor = async (fileData: FileJSON) => {
  try {
    const fileBuffer = await fs.readFile(fileData.filepath);
    // Make a POST request to the Thumbor upload endpoint
    const response = await axios.post(uploadEndpoint, fileBuffer, {
      headers: {
        "Content-Type": fileData.mimetype, // Change content type as needed
      },
    });

    // Handle the Thumbor response (e.g., you can console.log(response.data))
    console.log("Thumbor Response:", response.headers.location);
    return response.headers.location;
  } catch (error) {
    console.error("Error uploading file to Thumbor:", error);
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
      imageUrls.push(await uploadFileToThumbor(file));
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
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
