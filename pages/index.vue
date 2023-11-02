<template>
  <div>
    <VLoadingScreen v-if="pending" />
    <main
      v-if="!pending"
      class="flex flex-col justify-center items-center md:items-start w-full px-6 md:h-[80vh]"
    >
      <div
        class="flex flex-col justify-center items-center md:items-start w-full"
      >
        <h1 class="text-primary text-center text-3xl md:text-4xl lg:text-6xl">
          Francesco M. Barranca
        </h1>
        <h3
          class="text-accent text-center my-2 p-2 text-xl rounded md:text-3xl"
        >
          Software Developer
        </h3>

        <ul class="flex flex-row justify-center">
          <li>
            <a href="https://github.com/Francesco99975">
              <ClientOnly>
                <Icon name="uil:github" class="text-primary" size="3rem" />
              </ClientOnly>
            </a>
          </li>
          <!-- <li>
          <a href=""></a>
        </li> -->
        </ul>
      </div>

      <p
        class="m-6 mb-10 text-md md:text-lg text-center text-primary italic border-y-2 p-2 rounded border-accent md:w-1/3 self-end"
      >
        Unleash the potential of technology with a driven and innovative
        software developer committed to crafting cutting-edge solutions while
        constantly pushing the boundaries of knowledge and expertise.
      </p>

      <section
        v-if="projects && projects.length > 0"
        class="flex flex-col w-full"
      >
        <h2 class="text-accent italic font-bold text-lg md:text-2xl mb-5">
          Featured Projects
        </h2>
        <div
          class="flex flex-col md:flex-row w-full items-center lg:w-1/2 rounded border-y-2 border-primary py-3 overflow-x-scroll"
        >
          <VProjectFeatured
            v-for="project in projects"
            :key="project.id"
            :project="project"
          />
        </div>
        <span class="text-primary tracking-wide italic mt-2"
          ><NuxtLink
            class="underline-offset-4 hover:underline hover:text-accent"
            to="/privacy"
            >Privacy Policy</NuxtLink
          >
          <div class="rounded-full bg-primary w-2 h-2 inline-block mx-2"></div>
          <NuxtLink
            class="underline-offset-4 hover:underline hover:text-accent"
            to="/terms"
            >Terms and Conditions</NuxtLink
          ></span
        >
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import type Project from "~/interfaces/project";

useSeoMeta({
  title: "FMB.DEV",
  description:
    "Explore a world of creativity and innovation on my portfolio website. Discover my diverse skill set, browse through my impressive project showcase, and unlock the potential to bring your dream website to life. I'm here to turn your vision into reality through custom website development commissions. Let's collaborate and make your online presence unforgettable.",

  ogTitle: "FMB.DEV",
  ogDescription:
    "Explore a world of creativity and innovation on my portfolio website. Discover my diverse skill set, browse through my impressive project showcase, and unlock the potential to bring your dream website to life. I'm here to turn your vision into reality through custom website development commissions. Let's collaborate and make your online presence unforgettable.",

  twitterTitle: "FMB.DEV",
  twitterDescription:
    "Explore a world of creativity and innovation on my portfolio website. Discover my diverse skill set, browse through my impressive project showcase, and unlock the potential to bring your dream website to life. I'm here to turn your vision into reality through custom website development commissions. Let's collaborate and make your online presence unforgettable.",
});

const { pending, data: projects } = await useFetch<Project[]>(
  `/api/projects/featured`,
  {
    lazy: true,
  }
);
</script>

<style scoped></style>
