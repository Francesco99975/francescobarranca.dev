import io from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;

  const socket = io(`${config.url}`, {
    autoConnect: false,
    secure: process.env.NODE_ENV === "production",
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
