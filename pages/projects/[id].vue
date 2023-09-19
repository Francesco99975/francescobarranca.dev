<template>
  <main class="container mx-auto px-4 py-8">
    <section class="relative flex flex-col items-center">
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

      <p class="text-lg text-primary w-3/4 text-center">
        {{ project?.description }}
      </p>

      <div class="carousel m-2 relative">
        <span
          v-if="project?.commission"
          class="absolute z-10 top-5 right-5 border-accent border-4 p-4 rounded text-accent font-bold italic rotate-12 tracking-widest"
          >COMMISSIONED</span
        >
        <div class="carousel-inner" ref="inner">
          <div
            v-for="(url, index) in project?.imageUrls"
            class="carousel-item"
            :key="index"
          >
            <NuxtImg :src="BASE_IMG_URL + url" :alt="'PImg' + index" />
          </div>
        </div>
      </div>
    </section>

    <VLoadingScreen v-if="pending" />
  </main>
</template>

<script setup lang="ts">
import Project from "interfaces/project";
const route = useRoute();
const { pending, data: project } = await useFetch<Project>(
  `/api/projects/${route.params.id}`,
  {
    lazy: true,
  }
);

const BASE_IMG_URL = "http://localhost:8888";
const slideDuration = 3000;

const currentIndex = ref<number>(0);
const inner = ref<HTMLElement | null>(null);
const autoSlideInterval = ref();

onMounted(() => {
  startAutoSlide();
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
  min-height: 500px; /* Set a minimum height for your images */
  text-align: center;
}

/* Define responsive breakpoints */
@media (min-width: 640px) {
  .carousel-item {
    min-height: 300px; /* Adjust the height for larger screens */
  }
}
</style>
