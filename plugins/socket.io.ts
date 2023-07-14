import io from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;

  const socket = io(`${config.url}:${config.socketPort}`, {
    autoConnect: false,
    secure: false,
  });

  nuxtApp.hook("app:beforeMount", () => {
    socket.connect();
  });

  nuxtApp.hook("app:mounted", () => {
    if (process.client && !location.pathname.includes("admin")) {
      socket.emit("visit", {
        agent: navigator.userAgent,
        sauce: document.referrer,
      });
      console.log(socket.connected);
      console.log("emitted");
    }
  });

  nuxtApp.hook("page:start", () => {
    socket.emit("view");
  });

  return {
    provide: {
      io: socket,
    },
  };
});
