<template>
  <div class="flex flex-col text-2xl md:text-3xl w-35">
    <span class="text-primary">{{ props.desc }}</span>
    <span class="text-accent">{{ props.value }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["desc", "value"]);
</script>

<style scoped></style>
