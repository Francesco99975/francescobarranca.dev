<template>
  <main
    v-if="data && !pending"
    class="flex flex-col w-full items-center justify-center"
  >
    <div class="flex justify-center items-center p-2 w-full my-6 relative">
      <span
        v-if="data.commission.pwa"
        class="absolute top-0 right-0 z-20 font-bold text-lg p-2 rounded text-center text-std bg-accent"
        >PWA</span
      >
      <a :href="'mailto:' + data.customerEmail" class="m-2">
        <ClientOnly>
          <Icon
            name="material-symbols:mail-sharp"
            class="text-accent text-center"
            size="2.5rem"
          ></Icon
        ></ClientOnly>
      </a>

      <h1 class="text-primary text-2xl max-w-[70%]">
        {{ data.commission.subject }} -
        <span
          class="p-2 rounded-lg text-lg border-2 border-primary leading-3"
          >{{ data.commission.environ }}</span
        >
      </h1>
    </div>

    <h2 class="text-xl my-2 text-primary font-bold italic tracking-widest">
      Project Description
    </h2>

    <p
      class="my-3 p-2 rounded-sm border-2 border-primary text-accent leading-8 min-w-full"
    >
      {{ data.commission.description }}
    </p>

    <h2 class="text-xl my-2 text-primary font-bold italic tracking-widest">
      Theme Description
    </h2>

    <div class="min-w-full">
      <p
        class="my-3 p-2 rounded-sm border-2 border-primary text-accent leading-8"
      >
        {{ data.commission.theme }}
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import type Commission from "~/interfaces/commission";

definePageMeta({
  layout: "admin",
});

const route = useRoute();
const { pending, data } = await useFetch<{
  commission: Commission;
  customerEmail: string;
}>(`/api/commissions/${route.params.id}`, {
  lazy: true,
});
</script>

<style scoped></style>
