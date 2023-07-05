<template>
  <div>
    <div v-if="products" class="grid grid-cols-4 gap-5">
      <div v-for="p in products">
        <ProductCard :product="p" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Product from "../../interfaces/product";
definePageMeta({
  layout: "products",
});

const { data: products } = await useFetch<[Product]>(
  "https://fakestoreapi.com/products"
);
</script>

<style scoped></style>
