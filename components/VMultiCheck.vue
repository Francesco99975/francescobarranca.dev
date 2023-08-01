<template>
  <ul class="p-3 flex flex-col h-64 w-full">
    <li v-for="(option, index) in props.options">
      <VCheckItem :option="option" :index="index" @selection="handleSelected" />
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps(["options"]);
const emits = defineEmits(["choice"]);

const handleSelected = (status: boolean) => {
  selected.value.status = status;
};

const selected = ref<{ index: number; status: boolean }>({
  index: 0,
  status: false,
});

watch(selected, () => {
  emits("choice", selected.value);
});
</script>

<style scoped></style>
