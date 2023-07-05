<template>
  <div class="card text-center">
    <img
      :src="product.image"
      alt="product thumb"
      class="thumb"
      height="250"
      width="250"
    />
    <p class="font-bold text-gray-500 m-4 truncate">{{ product.title }}</p>
    <NuxtLink :to="`/projects/${product.id}`">
      <p class="btn my-4">View Details</p>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { product } = defineProps(["product"]);
</script>

<style scoped></style>
