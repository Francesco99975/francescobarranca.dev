<template>
  <main class="flex flex-col justify-center items-start w-full">
    <h1 class="text-primary text-center text-3xl md:text-6xl">
      Admin Dashboard - Online: {{ online }}
    </h1>
    <h2 class="text-primary text-center text-2xl md:text-5xl">
      Visitors - {{ visitors.length }}
    </h2>
  </main>
</template>

<script setup lang="ts">
import Visit from "interfaces/visit";

definePageMeta({
  layout: "admin",
  // middleware: ["admin-only"],
});

// const state = reactive<{ visitors: Visit[]; online: number }>({
//   visitors: [],
//   online: 0,
// });

const online = ref<number>(0);
let visitors = reactive<Visit[]>([]);

const { $io } = useNuxtApp();

onMounted(() => {
  $io.emit("join");
  $io.on("init", (message: { visitors: Visit[]; current: number }) => {
    visitors = message.visitors;
    online.value = message.current;
  });
  $io.on("collect", (message: { visitor: Visit; current: number }) => {
    online.value = message.current;
    visitors.push(message.visitor);
  });
  $io.on("visitors", (message: { current: number }) => {
    online.value = message.current;
  });
});
</script>

<style scoped></style>
