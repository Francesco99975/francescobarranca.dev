import Commission from "../../../interfaces/commission";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody<Commission>(event);
    const commission = await prisma.commission.create({
      data: {
        subject: data.subject,
        description: data.description,
        theme: data.theme,
        pages: data.pages,
        pwa: data.pwa,
        static: data.static,
        environments: {
          createMany: {
            data: data.environs.map((environ) => {
              return {
                name: environ,
              };
            }),
          },
        },
      },
    });
    return commission;
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
