<template>
  <div
    :class="props.project.commission && 'border-2 border-blue-700'"
    class="flex flex-col bg-accent shadow-md text-std rounded-lg pb-2 cursor-pointer"
  >
    <section class="px-6 py-4">
      <h1 class="text-lg md:text-xl font-bold">{{ props.project.title }}</h1>
    </section>

    <section class="carousel m-2">
      <div class="carousel-inner" ref="inner">
        <div
          v-for="(url, index) in props.project.imageUrls"
          class="carousel-item"
          :key="index"
        >
          <NuxtImg :src="BASE_IMG_URL + url" :alt="'PImg' + index" />
        </div>
      </div>
    </section>

    <section class="flex w-full justify-around">
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
        >Try it</a
      >
    </section>

    <section class="flex justify-start py-3 space-x-2 p-2 w-full mt-6">
      <span
        v-for="skill in props.project.skills"
        class="px-2 py-1 text-sm bg-std rounded-full text-primary italic font-bold"
        >{{ skill.name }}</span
      >
    </section>
  </div>
</template>

<script setup lang="ts">
import Project from "../interfaces/project";

const BASE_IMG_URL = "http://localhost:8888";
const slideDuration = 3000;

const props = defineProps<{ project: Project }>();
console.log(props.project);

const currentIndex = ref<number>(0);
const inner = ref<HTMLElement | null>(null);
const autoSlideInterval = ref();

onMounted(() => {
  startAutoSlide();
});

// Function to navigate to the next slide
const nextSlide = () => {
  currentIndex.value =
    (currentIndex.value + 1) % props.project.imageUrls.length;
  updateCarousel();
};

// Function to navigate to the previous slide
const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.project.imageUrls.length) %
    props.project.imageUrls.length;
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
