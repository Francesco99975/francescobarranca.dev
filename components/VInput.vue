<template>
  <div class="form-control">
    <label :for="name" class="label text-primary">{{ label }}</label>
    <input
      :type="type"
      :name="name"
      :id="name"
      :step="type === 'number' ? '.01' : ''"
      :min="type === 'number' && min"
      :max="type === 'number' && max"
      v-model="value"
      class="input text-accent border-accent pb-1"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["name", "label", "type", "min", "max", "value"]);

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
