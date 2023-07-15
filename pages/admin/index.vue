<template>
  <main class="flex flex-col w-full">
    <section
      class="text-primary text-center text-xl my-6 md:text-2xl flex flex-col md:flex-row w-full items-center"
    >
      <span>Admin Dashboard</span>
      <span class="flex items-center md:ml-6"
        ><div
          class="mr-2 h-3 w-3 rounded-full"
          :class="online > 0 ? 'bg-success' : 'bg-gray-600'"
        ></div>
        {{ online }} current visitors</span
      >
    </section>

    <section
      class="flex w-full mx-2 my-6 border-2 border-accent p-6 !overflow-x-scroll truncate"
    >
      <VStat desc="Unique Visitors" :value="uniqueVisitors.length" />
      <VertSep />
      <VStat desc="Total Visits" :value="visitors.length" />
      <VertSep />
      <VStat desc="Total Pageviews" :value="pageviews" />
      <VertSep />
      <VStat desc="Views Per Visit" :value="avgViewVisit" />
      <VertSep />
      <VStat desc="Bounce Rate" :value="bounceRate" />
      <VertSep />
      <VStat desc="Visit Duration" :value="avgDuration" />
    </section>
  </main>
</template>

<script setup lang="ts">
import Visit from "interfaces/visit";

definePageMeta({
  layout: "admin",
  middleware: ["admin-only"],
});

const online = ref<number>(0);
let visitors = ref<Visit[]>([]);

const uniqueVisitors = computed(() => [
  ...new Set(visitors.value.map((x) => x.ip)),
]);

const pageviews = computed(() =>
  visitors.value.reduce((prev, cur) => prev + cur.views, 0)
);

const avgViewVisit = computed(() =>
  (pageviews.value / visitors.value.length).toFixed(2)
);

const bounceRate = computed(
  () =>
    `${Math.trunc(
      visitors.value.length /
        visitors.value.filter((visit) => visit.views === 0).length
    )}%`
);

const avgDuration = computed(
  () =>
    `${Math.trunc(
      visitors.value.reduce((prev, cur) => prev + cur.duration, 0) /
        visitors.value.length /
        1000
    )} sec.`
);

const { $io } = useNuxtApp();

onMounted(() => {
  $io.emit("join");
  $io.on("init", (message: { visitors: Visit[]; current: number }) => {
    visitors.value = message.visitors;
    online.value = message.current;
  });
  $io.on("collect", (message: { visitor: Visit; current: number }) => {
    online.value = message.current;
    visitors.value.push(message.visitor);
  });
  $io.on("visitors", (message: { current: number }) => {
    online.value = message.current;
  });
});
</script>

<style scoped></style>
