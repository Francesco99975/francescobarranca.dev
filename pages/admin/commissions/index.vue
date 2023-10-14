<template>
  <main
    v-if="!pending"
    class="flex flex-col w-full items-center justify-center"
  >
    <h1 class="text-3xl tracking-wider text-accent mb-6">Commissions</h1>
    <!-- TABS Commissions -->

    <HeadlessTabGroup>
      <HeadlessTabList class="flex w-full justify-evenly">
        <HeadlessTab as="template" v-slot="{ selected }">
          <button
            :class="[
              'w-fit text-center text-xl p-6 relative',
              'focus:outline-none outline-none',
              selected
                ? 'text-accent shadow'
                : 'text-primary hover:underline hover:text-accent',
            ]"
          >
            <div
              :class="inReview.length > 99 && 'w-10 h-10'"
              class="absolute w-6 h-6 flex items-center justify-center border-2 border-primary shadow top-0 right-0 rounded-full text-center z-20"
            >
              <span class="text-sm font-bold text-primary text-center">{{
                inReview.length
              }}</span>
            </div>
            <ClientOnly>
              <Icon name="pajamas:review-list" size="2.2rem"></Icon>
            </ClientOnly>
          </button>
        </HeadlessTab>

        <HeadlessTab as="template" v-slot="{ selected }">
          <button
            :class="[
              'w-fit text-center text-xl p-6 relative',
              'focus:outline-none outline-none',
              selected
                ? 'text-accent shadow'
                : 'text-primary hover:underline hover:text-accent',
            ]"
          >
            <div
              :class="contracting.length > 99 && 'w-10 h-10'"
              class="absolute w-6 h-6 flex items-center justify-center border-2 border-primary shadow top-0 right-0 rounded-full text-center z-20"
            >
              <span class="text-sm font-bold text-primary text-center">{{
                contracting.length
              }}</span>
            </div>
            <ClientOnly>
              <Icon
                name="material-symbols:contract-edit-sharp"
                size="2.2rem"
              ></Icon>
            </ClientOnly>
          </button>
        </HeadlessTab>

        <HeadlessTab as="template" v-slot="{ selected }">
          <button
            :class="[
              'w-fit text-center text-xl p-6 relative',
              'focus:outline-none outline-none',
              selected
                ? 'text-accent shadow'
                : 'text-primary hover:underline hover:text-accent',
            ]"
          >
            <div
              :class="inProgress.length > 99 && 'w-10 h-10'"
              class="absolute w-6 h-6 flex items-center justify-center border-2 border-primary shadow top-0 right-0 rounded-full text-center z-20"
            >
              <span class="text-sm font-bold text-primary text-center">{{
                inProgress.length
              }}</span>
            </div>
            <ClientOnly>
              <Icon name="mdi:progress-wrench" size="2.2rem"></Icon>
            </ClientOnly>
          </button>
        </HeadlessTab>

        <HeadlessTab as="template" v-slot="{ selected }">
          <button
            :class="[
              'w-fit text-center text-xl p-6 relative',
              'focus:outline-none outline-none',
              selected
                ? 'text-accent shadow'
                : 'text-primary hover:underline hover:text-accent',
            ]"
          >
            <div
              :class="invoicing.length > 99 && 'w-10 h-10'"
              class="absolute w-6 h-6 flex items-center justify-center border-2 border-primary shadow top-0 right-0 rounded-full text-center z-20"
            >
              <span class="text-sm font-bold text-primary text-center">{{
                invoicing.length
              }}</span>
            </div>
            <ClientOnly>
              <Icon name="solar:hand-money-outline" size="2.2rem"></Icon>
            </ClientOnly>
          </button>
        </HeadlessTab>

        <HeadlessTab as="template" v-slot="{ selected }">
          <button
            :class="[
              'w-fit text-center text-xl p-6 relative',
              'focus:outline-none outline-none',
              selected
                ? 'text-accent shadow'
                : 'text-primary hover:underline hover:text-accent',
            ]"
          >
            <div
              :class="completed.length > 99 && 'w-10 h-10'"
              class="absolute w-6 h-6 flex items-center justify-center border-2 border-primary shadow top-0 right-0 rounded-full text-center z-20"
            >
              <span class="text-sm font-bold text-primary text-center">{{
                completed.length
              }}</span>
            </div>
            <ClientOnly>
              <Icon name="ion:md-done-all" size="2.2rem"></Icon>
            </ClientOnly>
          </button>
        </HeadlessTab>
      </HeadlessTabList>

      <HeadlessTabPanels class="w-full flex justify-center">
        <HeadlessTabPanel class="w-full md:w-4/5">
          <VCommissionList :list="inReview" />
        </HeadlessTabPanel>
        <HeadlessTabPanel>
          <VCommissionList :list="contracting" />
        </HeadlessTabPanel>
        <HeadlessTabPanel>
          <VCommissionList :list="inProgress" />
        </HeadlessTabPanel>
        <HeadlessTabPanel>
          <VCommissionList :list="invoicing" />
        </HeadlessTabPanel>
        <HeadlessTabPanel>
          <VCommissionList :list="completed" />
        </HeadlessTabPanel>
      </HeadlessTabPanels>
    </HeadlessTabGroup>
  </main>
</template>

<script setup lang="ts">
import Commission from "interfaces/commission";
import { Status } from "@prisma/client";

definePageMeta({
  layout: "admin",
});

const { pending, data } = await useFetch<
  { commission: Commission; customerEmail: string }[]
>("/api/commissions", {
  lazy: true,
});

const inReview = computed(() => {
  if (!data.value || data.value.length <= 0) return [];
  return data.value.filter((x) => x.commission.status === Status.SUBMITTED);
});

const contracting = computed(() => {
  if (!data.value || data.value.length <= 0) return [];
  return data.value.filter((x) => x.commission.status === Status.PENDING);
});

const inProgress = computed(() => {
  if (!data.value || data.value.length <= 0) return [];
  return data.value.filter((x) => x.commission.status === Status.ACCEPTED);
});

const invoicing = computed(() => {
  if (!data.value || data.value.length <= 0) return [];
  return data.value.filter((x) => x.commission.status === Status.INVOICING);
});

const completed = computed(() => {
  if (!data.value || data.value.length <= 0) return [];
  return data.value.filter((x) => x.commission.status === Status.COMPLETED);
});
</script>

<style scoped></style>
