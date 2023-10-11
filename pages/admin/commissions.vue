<template>
  <main class="flex flex-col w-full items-center justify-center">
    <h1>Commissions</h1>
    <!-- TABS Commissions -->
    <HeadlessTabGroup>
      <HeadlessTabList>
        <HeadlessTab as="template" v-slot="{ selected }">
          <button
            :class="[
              'w-full text-primary text-center text-xl p-6',
              'focus:outline-none outline-none',
              selected
                ? 'text-accent shadow'
                : 'text-primary hover:underline hover:text-accent',
            ]"
          >
            Review - {{ inReview.length }}
          </button>
        </HeadlessTab>
        <HeadlessTab as="template" v-slot="{ selected }">
          <button
            :class="[
              'w-full text-primary text-center text-xl p-6 border-x-2 border-accent',
              'focus:outline-none outline-none',
              selected
                ? 'text-accent shadow'
                : 'text-primary hover:underline hover:text-accent',
            ]"
          >
            Accepted - {{ InProgress.length }}
          </button>
        </HeadlessTab>
        <HeadlessTab as="template" v-slot="{ selected }">
          <button
            :class="[
              'w-full text-primary text-center text-xl p-6',
              'focus:outline-none outline-none',
              selected
                ? 'text-accent shadow'
                : 'text-primary hover:underline hover:text-accent',
            ]"
          >
            Completed - {{ completed.length }}
          </button>
        </HeadlessTab>
      </HeadlessTabList>
      <HeadlessTabPanels>
        <HeadlessTabPanel> </HeadlessTabPanel>
        <HeadlessTabPanel> </HeadlessTabPanel>
        <HeadlessTabPanel> </HeadlessTabPanel>
      </HeadlessTabPanels>
    </HeadlessTabGroup>
  </main>
</template>

<script setup lang="ts">
import Commission from "interfaces/commission";

definePageMeta({
  layout: "admin",
});

const { pending, data } = await useFetch<
  { commission: Commission; customerEmail: string }[]
>("/api/skills", {
  lazy: true,
});

const inReview = computed(() => {
  if (!data.value) return [];
  return data.value.filter((x) => !x.commission.accepted);
});

const InProgress = computed(() => {
  if (!data.value) return [];
  return data.value.filter(
    (x) => x.commission.accepted && !x.commission.completed
  );
});

const completed = computed(() => {
  if (!data.value) return [];
  return data.value.filter(
    (x) => x.commission.accepted && x.commission.completed
  );
});
</script>

<style scoped></style>
