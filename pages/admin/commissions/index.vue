<template>
  <main
    v-if="!pending"
    class="flex flex-col w-full items-center justify-center"
  >
    <h1 class="text-3xl tracking-wider text-accent mb-6">Commissions</h1>

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
          <VCommissionList
            @change="handleChange"
            @reject="handleReject"
            :list="inReview"
          />
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

const form = reactive({
  data: {
    price: 0,
    subscription: 0,
  },
  error: "",
  pending: false,
});

const handleChange = async (id: string, status: Status) => {
  try {
    let updatedData: { commission: Commission; customerEmail: string };
    if (status === Status.PENDING) {
      //Activate Form Modal

      if (form.data.price <= 0 || form.data.subscription <= 0) {
        return;
      }
      updatedData = await $fetch<{
        commission: Commission;
        customerEmail: string;
      }>("/api/commissions", {
        method: "PUT",
        body: {
          id,
          price: form.data.price,
          subscription: form.data.subscription,
        },
      });
    } else {
      updatedData = await $fetch<{
        commission: Commission;
        customerEmail: string;
      }>("/api/commissions", {
        method: "PUT",
        body: {
          id,
          status,
        },
      });
    }

    if (data.value) {
      const index = data.value.findIndex(
        (x) => x.commission.id === updatedData.commission.id
      );

      if (!index || index < 0) return;

      data.value[index].commission = updatedData.commission;
      data.value[index].customerEmail = updatedData.customerEmail;
    }
  } catch (error) {
    console.log(error);
  }
};

const handleReject = async (id: string) => {
  try {
    if (data.value) {
      const updatedData = await $fetch<{
        commission: Commission;
        customerEmail: string;
      }>("/api/commissions", {
        method: "DELETE",
        body: {
          id,
        },
      });

      data.value = data.value.filter(
        (x) => x.commission.id !== updatedData.commission.id
      );
    }
  } catch (error) {
    console.log(error);
  }
};

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
