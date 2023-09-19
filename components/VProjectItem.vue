<template>
  <div
    class="flex flex-col min-w-full min-h-[5rem] bg-accent shadow-md text-std rounded-lg pb-2"
  >
    <section class="flex justify-between items-center p-5 w-full">
      <div class="flex flex-col p-2">
        <span class="text-lg md:text-xl font-bold">{{
          props.project.title
        }}</span>
      </div>

      <div class="flex justify-evenly w-1/3">
        <button class="delic" @click="handleDeletion" :disabled="loading">
          <ClientOnly>
            <Icon
              name="material-symbols:delete-sharp"
              class="text-std"
              size="1.5rem"
            />
          </ClientOnly>
        </button>

        <button
          :class="props.project.featured ? 'bg-std' : 'bg-accent'"
          class="p-1 text-center cursor-pointer rounded-md"
          @click="handleFetatured"
          :disabled="loading"
        >
          <ClientOnly>
            <Icon
              name="streamline:computer-desktop-favorite-star-computer-desktop-device-display-like-favorite-star"
              :class="props.project.featured ? 'text-success' : 'text-std'"
              size="1.5rem"
            />
          </ClientOnly>
        </button>
      </div>
    </section>

    <section class="flex w-full justify-evenly">
      <a
        :href="props.project.sourceCodeUrl"
        target="_blank"
        class="w-1/3 p-2 rounded bg-std text-primary text-center block"
        >Source</a
      >
      <a
        :href="props.project.downloadUrl"
        target="_blank"
        class="w-1/3 p-2 rounded bg-std text-primary text-center block"
        >Download</a
      >
    </section>
  </div>
</template>

<script setup lang="ts">
import Project from "../interfaces/project";

const props = defineProps<{ project: Project; loading: boolean }>();

const emit = defineEmits<{
  (event: "delete", id: string): void;
  (event: "feature", id: string, value: boolean): void;
}>();

const handleDeletion = () => {
  emit("delete", props.project.id!);
};

const handleFetatured = () => {
  emit("feature", props.project.id!, !props.project.featured);
};
</script>

<style scoped></style>
