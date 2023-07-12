import io from "socket.io-client";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public;

  const socket = io(`${config.url}:${config.socketPort}"`, {
    autoConnect: false,
  });

  console.log(socket.active);

  return {
    provide: {
      io: socket,
    },
  };
});
