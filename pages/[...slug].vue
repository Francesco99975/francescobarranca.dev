<template>
  <main class="flex flex-col w-full h-[80vh] items-center justify-center">
    <h1
      class="text-white font-bold bg-error text-center p-2 text-2xl rounded-sm tracking-widest italic my-5"
    >
      {{ $route.params.slug.toString().split(",").join("/") }} not found
    </h1>

    <NuxtLink to="/" class="btn">Return to homepage</NuxtLink>
  </main>
</template>

<script setup lang="ts"></script>

<style scoped></style>
