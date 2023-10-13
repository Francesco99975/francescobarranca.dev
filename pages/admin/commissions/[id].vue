<template>
  <main
    v-if="data && !pending"
    class="flex flex-col w-full items-center justify-center"
  >
    <div>
      <a :href="'mailto:' + data.customerEmail" class="">
        <ClientOnly>
          <Icon
            name="material-symbols:mail-sharp"
            class="text-accent text-center"
            size="2.5rem"
          ></Icon
        ></ClientOnly>
      </a>
      <h1>
        {{ data.commission.subject }} -
        <span class="relative">
          <span v-if="data.commission.pwa" class="absolute">PWA</span
          >{{ data.commission.environ }}</span
        >
      </h1>
    </div>

    <p>{{ data.commission.description }}</p>

    <div class="relative">
      <p>{{ data.commission.theme }}</p>
      <span class="absolute">{{ data.commission.pages }}</span>
      <span v-if="data.commission.static" class="absolute">STATIC</span>
    </div>
  </main>
</template>

<script setup lang="ts">
import Commission from "interfaces/commission";

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
