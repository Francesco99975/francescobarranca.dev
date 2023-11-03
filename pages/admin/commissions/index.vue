<template>
  <main
    v-if="!pending"
    class="flex flex-col w-full items-center justify-center"
  >
    <h1 class="text-3xl tracking-wider text-accent mb-6">Commissions</h1>

    <Teleport to="body">
      <dialog
        ref="pricing"
        class="w-full md:w-2/3 bg-std shadow-2xl rounded border-2 border-primary"
      >
        <VModal @cancel="handleCancel" @agree="handleAgree" />
      </dialog>
    </Teleport>

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
        <HeadlessTabPanel class="w-full md:w-4/5">
          <VCommissionList
            @change="handleChange"
            @reject="handleReject"
            :list="contracting"
          />
        </HeadlessTabPanel>
        <HeadlessTabPanel class="w-full md:w-4/5">
          <VCommissionList @change="handleChange" :list="inProgress" />
        </HeadlessTabPanel>
        <HeadlessTabPanel class="w-full md:w-4/5">
          <VCommissionList @change="handleChange" :list="invoicing" />
        </HeadlessTabPanel>
        <HeadlessTabPanel class="w-full md:w-4/5">
          <VCommissionList :list="completed" />
        </HeadlessTabPanel>
      </HeadlessTabPanels>
    </HeadlessTabGroup>
  </main>
</template>

<script setup lang="ts">
import type Commission from "~/interfaces/commission";
type Status = "SUBMITTED" | "PENDING" | "ACCEPTED" | "INVOICING" | "COMPLETED";

definePageMeta({
  layout: "admin",
});

const { pending, data } = await useFetch<
  { commission: Commission; customerEmail: string }[]
>("/api/commissions", {
  lazy: true,
});

const pricing = ref<HTMLDialogElement | null>(null);
const modalId = ref("");

const update = (commission: Commission, email: string) => {
  if (data.value) {
    const index = data.value.findIndex(
      (x) => x.commission.id === commission.id
    );

    if (!index || index < 0) {
      return console.log("index error");
    }
    const updatedVal = { commission, customerEmail: email };
    data.value[index] = updatedVal;
  }
};

const handleAgree = async (json: string) => {
  if (pricing.value) {
    pricing.value.close(json);
    const { price, subscription }: { price: number; subscription: number } =
      JSON.parse(pricing.value.returnValue);
    const updatedData = await $fetch<{
      commission: Commission;
      customerEmail: string;
    }>("/api/commissions", {
      method: "PUT",
      body: {
        id: modalId.value,
        price,
        subscription,
      },
    });

    update(updatedData.commission, updatedData.customerEmail);
  }
};

const handleCancel = () => {
  if (pricing.value) {
    pricing.value.close();
  }
};

const handleChange = async (id: string, status: Status) => {
  try {
    if (status !== "PENDING") {
      const updatedData = await $fetch<{
        commission: Commission;
        customerEmail: string;
      }>("/api/commissions", {
        method: "PUT",
        body: {
          id,
          status,
        },
      });

      console.log(updatedData);

      update(updatedData.commission, updatedData.customerEmail);
    } else {
      if (pricing.value) {
        modalId.value = id;
        pricing.value.showModal();
      }
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

const inReview = computed(() => {
  if (!data.value || data.value.length <= 0) return [];
  return data.value.filter((x) => x.commission.status === "SUBMITTED");
});

const contracting = computed(() => {
  if (!data.value || data.value.length <= 0) return [];
  return data.value.filter((x) => x.commission.status === "PENDING");
});

const inProgress = computed(() => {
  if (!data.value || data.value.length <= 0) return [];
  return data.value.filter((x) => x.commission.status === "ACCEPTED");
});

const invoicing = computed(() => {
  if (!data.value || data.value.length <= 0) return [];
  return data.value.filter((x) => x.commission.status === "INVOICING");
});

const completed = computed(() => {
  if (!data.value || data.value.length <= 0) return [];
  return data.value.filter((x) => x.commission.status === "COMPLETED");
});
</script>

<style scoped>
::backdrop {
  background-image: linear-gradient(45deg, black, gray, black, gray);
  opacity: 0.75;
}
</style>
