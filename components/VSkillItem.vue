<template>
  <div
    class="flex justify-between items-center p-5 w-full h-32 bg-accent shadow-md text-std"
  >
    <div class="flex flex-col p-2">
      <span class="text-lg md:text-xl font-bold">{{ props.skill.name }}</span>
      <span class="text-base md:text-lg italic">{{
        props.skill.subplatform
          ? props.skill.platform + " / " + skill.subplatform
          : props.skill.platform
      }}</span>
    </div>

    <button class="delic" @click="handleDeletion">
      <Icon
        name="material-symbols:delete-sharp"
        class="text-std"
        size="1.5rem"
      />
    </button>

    <!-- <span class="text-xl md:text-2xl">U: {{ skill.projects.length }}</span> -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["skill"]);

const emits = defineEmits(["delete"]);

const handleDeletion = () => {
  emits("delete", props.skill.id);
};
</script>

<style scoped></style>
