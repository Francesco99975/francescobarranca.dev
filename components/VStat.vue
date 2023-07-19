<template>
  <div class="flex flex-col text-2xl md:text-3xl w-35">
    <span
      :class="active ? 'text-accent' : 'text-primary'"
      class="cursor-pointer border-b-2 border-transparent border-solid hover:border-accent"
      >{{ props.desc }}</span
    >
    <span class="text-accent mt-2">{{ props.value }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["desc", "value", "active"]);
</script>

<style scoped></style>
