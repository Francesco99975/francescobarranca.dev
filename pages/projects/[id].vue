<template>
  <div v-if="product">
    <p>{{ product.title }}</p>
    <p>{{ product.price }}</p>
    <p>{{ product.id }}</p>
  </div>
</template>

<script setup lang="ts">
import Product from "../../interfaces/product";

const { id } = useRoute().params;

definePageMeta({
  layout: "products",
});

const uri = `https://fakestoreapi.com/products/${id}`;

const { data: product } = await useFetch<Product>(uri, { key: id.toString() });
</script>

<style scoped></style>
