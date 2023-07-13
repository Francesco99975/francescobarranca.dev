<template>
  <main class="flex flex-col justify-center items-start w-full">
    <h1 class="text-primary text-center text-3xl md:text-6xl">
      Admin Dashboard - Online: {{ state.online }}
    </h1>
  </main>
</template>

<script setup lang="ts">
import { Visit } from "@prisma/client";

definePageMeta({
  layout: "admin",
  // middleware: ["admin-only"],
});

const state = reactive<{ visitors: Visit[]; online: number }>({
  visitors: [],
  online: 0,
});

const { $io } = useNuxtApp();

onMounted(() => {
  $io.emit("join");
  $io.on("init", (message: { visitors: Visit[]; current: number }) => {
    state.visitors = message.visitors;
    state.online = message.current;
  });
  $io.on("collect", (message: { visitor: Visit }) => {
    state.visitors.push(message.visitor);
  });
  $io.on("visitors", (message: { current: number }) => {
    state.online = message.current;
  });
});
</script>

<style scoped></style>
