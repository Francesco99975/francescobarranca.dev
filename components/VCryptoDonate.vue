<template>
  <div
    @click="handleCopy"
    class="flex flex-col justify-evenly items-center w-64 my-6 md:my-0"
  >
    <h3
      class="text-center text-primary text-lg md:text-2xl font-bold italic cursor-pointer"
    >
      {{ title }}
    </h3>

    <img
      :src="qrCodeUrl"
      :alt="title"
      height="200"
      width="200"
      class="p-2 cursor-pointer"
    />

    <span
      class="font-bold tracking-widest text-accent text-center max-w-[250px] truncate p-1 border-2 border-accent rounded cursor-pointer"
      >{{ address }}</span
    >
  </div>
</template>

<script setup lang="ts">
const { title, qrCodeUrl, address } = defineProps<{
  title: string;
  qrCodeUrl: string;
  address: string;
}>();

const handleCopy = () => {
  navigator.clipboard.writeText(address);
};
</script>

<style scoped></style>
