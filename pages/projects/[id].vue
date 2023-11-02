<template>
  <main class="container mx-auto px-4 py-8 relative">
    <span
      v-if="project?.commission"
      class="absolute z-10 -top-7 md:top-5 right-5 border-accent border-2 md:border-4 p-2 md:p-4 rounded text-accent text-sm md:text-base font-bold italic rotate-12 tracking-widest"
      >COMMISSIONED</span
    >
    <section class="flex flex-col items-center">
      <h1
        class="text-3xl text-center text-primary font-bold mb-5 underline underline-offset-2"
      >
        {{ project?.title }}
      </h1>

      <div class="flex justify-center items-center">
        <span
          v-for="skill in project?.skills"
          class="px-2 py-1 text-sm rounded-full text-accent italic font-bold"
          >{{ skill.name }}</span
        >
      </div>

      <p
        class="text-lg text-primary w-full md:w-3/4 text-center max-h-60 overflow-scroll"
      >
        {{ project?.description }}
      </p>

      <div
        class="flex flex-col md:flex-row w-full md:justify-around items-center font-bold tracking-widest"
      >
        <a
          :href="project?.sourceCodeUrl"
          target="_blank"
          class="w-1/3 p-2 rounded bg-accent text-std text-center block m-2 min-w-fit max-w-sm"
          >Source</a
        >
        <a
          :href="project?.downloadUrl"
          target="_blank"
          class="w-1/3 p-2 rounded bg-accent text-std text-center block m-2 min-w-fit max-w-sm"
          >{{
            !project?.skills
              ? "Try It"
              : project.skills.map((x) => x.platform).includes("Mobile") ||
                project.skills.map((x) => x.platform).includes("Desktop")
              ? "Download"
              : "View"
          }}</a
        >
      </div>

      <div class="carousel flex justify-center items-center m-2">
        <div class="carousel-inner" ref="inner">
          <div
            v-for="(url, index) in project?.imageUrls"
            class="carousel-item"
            :key="index"
          >
            <!--   sizes="xs:300px md:350px xl:250px xxl:200px 1500px" -->
            <NuxtImg
              :src="BASE_IMG_URL + url"
              :alt="'PImg' + index"
              format="webp"
              fit="outside"
              quality="80"
              class="inline-block"
            />
          </div>
        </div>
      </div>
    </section>

    <VLoadingScreen v-if="pending" />
  </main>
</template>

<script setup lang="ts">
import type Project from "~/interfaces/project";

const route = useRoute();
const { pending, data: project } = await useFetch<Project>(
  `/api/projects/${route.params.id}`,
  {
    lazy: true,
  }
);

const BASE_IMG_URL = "http://localhost:8888";
const slideDuration = 5000;

const currentIndex = ref<number>(0);
const inner = ref<HTMLElement | null>(null);
const autoSlideInterval = ref();

onMounted(() => {
  startAutoSlide();
});

onUnmounted(() => {
  stopAutoSlide();
});

// Function to navigate to the next slide
const nextSlide = () => {
  currentIndex.value =
    (currentIndex.value + 1) % project.value!.imageUrls!.length;
  updateCarousel();
};

// Function to navigate to the previous slide
const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + project.value!.imageUrls.length) %
    project.value!.imageUrls.length;
  updateCarousel();
};

// Function to update the carousel's position
const updateCarousel = () => {
  const offset = -currentIndex.value * 100;
  inner.value!.style.transform = `translateX(${offset}%)`;
};

// Function to start automatic sliding
const startAutoSlide = () => {
  autoSlideInterval.value = setInterval(() => {
    nextSlide();
  }, slideDuration);
};

// Function to stop automatic sliding
const stopAutoSlide = () => {
  clearInterval(autoSlideInterval.value);
};
</script>

<style scoped>
.carousel {
  overflow: hidden;
}

.carousel-inner {
  white-space: nowrap;
  transition: transform 0.3s ease;
}

.carousel-item {
  display: inline-block;
  width: 100%;
  text-align: center;
}

/* Define responsive breakpoints */
</style>
