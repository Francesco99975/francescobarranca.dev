<template>
  <div
    class="flex flex-col justify-between items-center p-2 my-2 w-full bg-std shadow-md text-primary rounded"
  >
    <div class="flex flex-col p-2">
      <span class="text-lg font-bold">{{ props.name }}</span>
    </div>

    <!-- Add a link to filtered projects using this skill -->
    <div class="md:text-lg italic">
      Used in {{ props.uses }} Project{{ props.uses !== 1 ? "s" : "" }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string; uses: number }>();
</script>

<style scoped></style>
