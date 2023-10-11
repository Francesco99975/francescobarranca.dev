<template>
  <div class="w-full m-2 flex justify-between bg-std shadow-xl">
    <div class="p-2 flex items-center justify-center">
      <a :href="'mailto:' + email">
        <ClientOnly>
          <Icon
            name="material-symbols:mail-sharp"
            class="text-accent text-center"
            size="1.2rem"
          ></Icon
        ></ClientOnly>
      </a>
      <div class="flex flex-col">
        <h3 class="text-primary text-lg">{{ subject }}</h3>
        <span class="p-2 border-2 border-accent rounded text-accent">{{
          environ
        }}</span>
      </div>
    </div>

    <div class="flex flex-col md:flex-row m-2">
      <button
        type="button"
        class="bg-std border-2 border-success rounded-xl text-success hover:bg-success hover:text-white tracking-widest font-bold shadow-lg"
      >
        ACCEPT
      </button>
      <button
        type="button"
        class="bg-std border-2 border-error rounded-xl text-error hover:bg-error hover:text-white tracking-widest font-bold shadow-lg"
      >
        REJECT
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string;
  subject: string;
  email: string;
  environ: string;
}>();

const emit = defineEmits<{
  (event: "accept", id: string): void;
  (event: "reject", id: string): void;
}>();

const handleAccept = () => {
  emit("accept", props.id);
};

const handleReject = () => {
  emit("reject", props.id);
};
</script>

<style scoped></style>
