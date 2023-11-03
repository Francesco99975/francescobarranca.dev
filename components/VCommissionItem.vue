<template>
  <div
    class="w-full m-2 p-2 flex flex-col md:flex-row justify-between bg-std border-accent border-4 rounded shadow-xl"
  >
    <div class="p-2 flex items-center justify-start md:justify-center">
      <a :href="'mailto:' + email" class="mr-2">
        <ClientOnly>
          <Icon
            name="material-symbols:mail-sharp"
            class="text-accent text-center"
            size="2.5rem"
          ></Icon
        ></ClientOnly>
      </a>
      <NuxtLink
        :to="`/admin/commissions/${id}`"
        class="flex flex-col cursor-pointer"
      >
        <h3 class="text-primary text-lg hover:underline underline-offset-2">
          {{ subject }}
        </h3>
        <span
          class="p-2 border-2 border-accent rounded text-accent text-center w-fit m-1 font-bold"
          >{{ environ }}</span
        >
      </NuxtLink>
    </div>

    <div class="flex md:m-2 py-2 w-full md:w-1/3 md:justify-center">
      <button
        v-if="status === 'SUBMITTED'"
        @click="() => handleChange('PENDING')"
        type="button"
        class="w-full mx-2 bg-std border-2 border-success rounded-xl text-success hover:bg-success hover:text-white tracking-widest font-bold shadow-lg"
      >
        ACCEPT
      </button>
      <button
        v-if="status === 'PENDING'"
        @click="() => handleChange('ACCEPTED')"
        type="button"
        class="w-full mx-2 bg-std border-2 border-primary rounded-xl text-primary hover:border-accent hover:text-accent tracking-widest font-bold shadow-lg"
      >
        START PROJECT
      </button>
      <button
        v-if="status === 'SUBMITTED' || status === 'PENDING'"
        @click="handleReject"
        type="button"
        class="w-full mx-2 bg-std border-2 border-error rounded-xl text-error hover:bg-error hover:text-white tracking-widest font-bold shadow-lg"
      >
        REJECT
      </button>

      <button
        v-if="status === 'ACCEPTED'"
        @click="() => handleChange('INVOICING')"
        type="button"
        class="w-full mx-2 bg-std border-2 border-primary rounded-xl text-primary hover:border-accent hover:text-accent tracking-widest font-bold shadow-lg"
      >
        SEND INVOICE
      </button>

      <button
        v-if="status === 'INVOICING'"
        @click="() => handleChange('COMPLETED')"
        type="button"
        class="w-full mx-2 bg-std border-2 border-success rounded-xl text-success hover:bg-success hover:text-white tracking-widest font-bold shadow-lg"
      >
        FINALIZE
      </button>

      <div
        v-if="status === 'COMPLETED'"
        class="w-full flex justify-center items-center mx-2 bg-std border-2 border-success rounded-xl text-success tracking-widest font-bold shadow-lg"
      >
        COMPLETED
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Status = "SUBMITTED" | "PENDING" | "ACCEPTED" | "INVOICING" | "COMPLETED";

const props = defineProps<{
  id: string;
  subject: string;
  email: string;
  environ: string;
  status: Status;
}>();

const emit = defineEmits<{
  (event: "change", id: string, status: Status): void;
  (event: "reject", id: string): void;
}>();

const handleChange = (status: Status) => {
  emit("change", props.id, status);
};

const handleReject = () => {
  emit("reject", props.id);
};
</script>

<style scoped></style>
