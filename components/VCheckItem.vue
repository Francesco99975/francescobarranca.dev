<template>
  <div
    class="border-2 border-solid border-primary text-primary flex justify-between items-center p-5 w-full h-32"
  >
    <span class="text-lg md:text-xl">{{ props.option.label }}</span>
    <div
      :class="status ? 'border-accent' : 'border-primary'"
      class="m-5 h-16 w-16 rounded-lg border-4 border-solid cursor-pointer"
      @click="toggleStatus"
    >
      <ClientOnly>
        <Icon
          v-if="status"
          name="ic:baseline-check"
          class="text-accent"
          size="1.5rem"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["option", "index"]);
const status = ref<boolean>(false);

const emits = defineEmits(["selection"]);

const toggleStatus = () => {
  status.value = !status.value;
};

watch(status, () => {
  emits("selection", { index: props.index, status });
});
</script>

<style scoped></style>
