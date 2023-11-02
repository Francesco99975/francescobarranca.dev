<template>
  <div
    class="flex justify-between items-center p-5 rounded-lg w-full min-w-full min-h-[5rem] bg-accent shadow-md text-std"
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
      <ClientOnly>
        <Icon
          name="material-symbols:delete-sharp"
          class="text-std"
          size="1.5rem"
        />
      </ClientOnly>
    </button>

    <!-- <span class="text-xl md:text-2xl">U: {{ skill.projects.length }}</span> -->
  </div>
</template>

<script setup lang="ts">
import type Skill from "~/interfaces/skill";

const props = defineProps<{ skill: Skill }>();

const emit = defineEmits<{
  (event: "delete", id: string): void;
}>();

const handleDeletion = () => {
  emit("delete", props.skill.id!);
};
</script>

<style scoped></style>
