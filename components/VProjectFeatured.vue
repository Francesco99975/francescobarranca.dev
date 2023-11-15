<template>
  <div
    class="flex flex-col justify-between bg-accent shadow-md text-std rounded-lg m-2 md:w-[45%] w-full"
  >
    <section class="flex justify-between items-center p-5 w-full">
      <NuxtLink
        :to="`/projects/${props.project.id}`"
        class="flex flex-col p-2 truncate"
      >
        <span
          :title="props.project.title"
          class="text-lg md:text-xl font-bold hover:underline truncate"
          >{{ props.project.title }}</span
        >
      </NuxtLink>
    </section>

    <section class="flex w-full justify-evenly mb-2">
      <a
        :href="props.project.sourceCodeUrl"
        target="_blank"
        class="p-2 rounded bg-std text-primary text-center block min-w-[6rem]"
        >Source</a
      >
      <a
        :href="props.project.downloadUrl"
        target="_blank"
        class="p-2 rounded bg-std text-primary text-center block min-w-[6rem]"
        >{{
          !project.skills
            ? "Try It"
            : project.skills.map((x) => x.subplatform).includes("Frontend")
            ? "View"
            : "Download"
        }}</a
      >
    </section>
  </div>
</template>

<script setup lang="ts">
import type Project from "~/interfaces/project";

const props = defineProps<{ project: Project }>();
</script>

<style scoped></style>
