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
    socket.on("join", async () => {
      socket.join("admin");
      const all = await prisma.visit.findMany();
      socketServer
        .to("admin")
        .emit("init", { current: visitors.length, visitors: all });
      console.log(`Current Visitors: ${visitors.length}`);
    });

    socket.on("visit", (message: { agent: string; sauce: string }) => {
      const visit: Visit = {
        id: socket.id,
        ip: socket.handshake.address,
        date: new Date(),
        duration: 0,
        views: 0,
        agent: message.agent,
        sauce: message.sauce == "" ? "direct" : message.sauce,
      };

      visitors.push(visit);

      console.log(`New Visitors: ${visitors.length}`);

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

      console.log(
        `Views updated for ${visitors[index].ip}. Views: ${visitors[index].views}`
      );
    });

    socket.on("disconnect", async () => {
      const disconnectDate = new Date();

      const index = visitors.findIndex((visit) => visit.id === socket.id);

      if (index < 0) return;

      console.log(`${visitors[index].ip}:${visitors[index].id} Disconnected`);

      const visitor = visitors[index];
      visitors.splice(index, 1);

      visitor.duration = disconnectDate.getTime() - visitor.date.getTime();

      await prisma.visit.create({ data: visitor });

      socketServer
        .to("admin")
        .emit("collect", { current: visitors.length, visitor: visitor });
    });
  });
});
