<template>
  <div class="form-control">
    <label :for="name" class="label text-primary">{{ label }}</label>
    <input
      :type="type"
      :name="name"
      :id="name"
      v-model="value"
      class="input text-accent border-accent pb-1"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["name", "label", "type", "value"]);

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
