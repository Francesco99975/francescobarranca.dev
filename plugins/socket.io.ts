import io from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public;

  const socket = io(`${config.url}:${config.socketPort}`, {
    autoConnect: false,
    secure: false,
  });

  nuxtApp.hook("app:beforeMount", () => {
    socket.connect();
    console.log(socket.connected);
  });

  return {
    provide: {
      io: socket,
    },
  };
});
