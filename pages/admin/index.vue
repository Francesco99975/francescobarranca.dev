<template>
  <main class="flex flex-col justify-center items-start w-full">
    <h1 class="text-primary text-center text-3xl md:text-6xl">
      Admin Dashboard
    </h1>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin-only"],
});
</script>

<style scoped></style>
