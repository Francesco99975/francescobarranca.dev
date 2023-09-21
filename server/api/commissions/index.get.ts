import Commission from "../../../interfaces/commission";
import { prisma } from "../../db.server";

export default defineEventHandler(async (event) => {
  try {
    const db_comms = await prisma.commission.findMany({
      include: { environments: true },
    });

    const commissions: Commission[] = db_comms.map((comm) => {
      return {
        id: comm.id,
        subject: comm.subject,
        description: comm.description,
        theme: comm.description,
        pages: comm.pages,
        environs: comm.environments.map((envirion) => envirion.name),
        pwa: comm.pwa,
        static: comm.static,
        accepted: comm.accepted,
        completed: comm.completed,
      };
    });

    return commissions;
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
});
