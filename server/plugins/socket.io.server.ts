import { Server } from "socket.io";
import Visit from "../../interfaces/visit";
import { prisma } from "../db.server";

const visitors: Visit[] = [];

export default defineNitroPlugin((nitroApp) => {
  const socketServer = new Server(useRuntimeConfig().public.socketPort, {
    serveClient: false,
    cors: {
      origin: "*",
    },
  });

  socketServer.on("connection", (socket) => {
    socket.on("join", () => {
      socket.join("admin");
    });

    socket.on("visit", (message: { agent: string; sauce: string }) => {
      const visit: Visit = {
        ip: socket.handshake.address,
        date: new Date(),
        duration: 0,
        views: 1,
        agent: message.agent,
        sauce: message.sauce,
      };

      visitors.push(visit);

      socketServer.to("admin").emit("visitors", { current: visitors.length });
    });

    socket.on("view", () => {
      const index = visitors.findIndex(
        (visit) => visit.ip === socket.handshake.address
      );

      if (index < 0) return;
      const visitor = visitors[index];

      visitor.views = visitor.views + 1;

      visitors[index] = visitor;
    });

    socket.on("disconnect", async () => {
      const disconnectDate = new Date();

      const index = visitors.findIndex(
        (visit) => visit.ip === socket.handshake.address
      );

      if (index < 0) return;

      const visitor = visitors[index];
      visitors.splice(index, 1);

      visitor.duration = disconnectDate.getTime() - visitor.date.getTime();

      await prisma.visit.create({ data: visitor });

      socketServer.to("admin").emit("collect", { visitor });
    });
  });
});
