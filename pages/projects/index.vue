<template>
  <main class="container mx-auto px-4 py-8">
    <h1
      class="text-3xl text-primary font-bold -ml-7 mb-5 underline underline-offset-2"
    >
      Projects
    </h1>
    <section
      v-if="projects && !pending"
      class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
    >
      <VProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </section>

    <section
      v-if="(!projects || projects.length <= 0) && !pending"
      class="flex items-center justify-center w-full h-[60vh]"
    >
      <h1 class="text-center text-accent italic">
        No Projects <span class="underline">git gud</span>
      </h1>
    </section>

    <VLoadingScreen v-if="pending" />
  </main>
</template>

<script setup lang="ts">
import type Project from "~/interfaces/project";

useHead({
  link: [{ rel: "canonical", href: "https://francescobarranca.dev/projects" }],
});

useSeoMeta({
  title: "Projects | FMB.DEV",
  description:
    "Dive into a world of creativity with a glimpse into my portfolio of diverse projects. Explore the variety of work I've crafted, each a testament to innovation and functionality. Get inspired and imagine what we can achieve together for your online and beyond.",

  ogTitle: "Projects | FMB.DEV",
  ogDescription:
    "Dive into a world of creativity with a glimpse into my portfolio of diverse projects. Explore the variety of work I've crafted, each a testament to innovation and functionality. Get inspired and imagine what we can achieve together for your online and beyond.",

  twitterTitle: "Projects | FMB.DEV",
  twitterDescription:
    "Dive into a world of creativity with a glimpse into my portfolio of diverse projects. Explore the variety of work I've crafted, each a testament to innovation and functionality. Get inspired and imagine what we can achieve together for your online and beyond.",
});

const { pending, data: projects } = await useFetch<Project[]>("/api/projects", {
  lazy: true,
});
</script>

<style scoped></style>
