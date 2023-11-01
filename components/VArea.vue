<template>
  <div class="form-control">
    <label :for="name" class="label text-primary">{{ label }}</label>

    <textarea
      :name="name"
      :id="name"
      cols="30"
      rows="10"
      v-model="value"
      class="border-2 bg-transparent outline-none rounded-lg p-2 text-primary border-accent pb-1"
      >{{ value }}</textarea
    >
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ name: string; label: string; value: string }>();

const emit = defineEmits(["update:value"]);

const value = computed({
  get() {
    return props.value;
  },
  set(value: String) {
    emit("update:value", value);
  },
});
</script>

<style scoped></style>
