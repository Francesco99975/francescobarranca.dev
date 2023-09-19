<template>
  <div
    :class="props.project.commission && 'border-2 border-blue-700'"
    class="flex flex-col max-h-96 bg-accent shadow-md text-std rounded-lg pb-2"
  >
    <section class="flex p-5 w-full">
      <div class="flex flex-col p-2">
        <span class="text-lg md:text-xl font-bold">{{
          props.project.title
        }}</span>
      </div>
    </section>

    <section class="flex p-5 w-full">
      <div class="flex flex-col p-2">
        <p class="text-lg md:text-xl font-bold overflow-scroll">
          {{ props.project.description }}
        </p>
      </div>
    </section>

    <section class="flex w-full justify-evenly">
      <a
        :href="props.project.sourceCodeUrl"
        target="_blank"
        class="w-1/3 p-2 rounded bg-std text-primary text-center block"
        >Source</a
      >
      <a
        :href="props.project.downloadUrl"
        target="_blank"
        class="w-1/3 p-2 rounded bg-std text-primary text-center block"
        >Download / View</a
      >
    </section>
  </div>
</template>

<script setup lang="ts">
import Project from "../interfaces/project";

const props = defineProps<{ project: Project }>();
</script>

<style scoped></style>
