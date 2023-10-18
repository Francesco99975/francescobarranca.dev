<template>
  <div class="flex justify-center items-center text-center flex-col">
    <h1 class="text-xl text-center text-primary font-bold tracking-wider">
      Establish Pricing
    </h1>
    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col w-full p-2 items-center"
    >
      <VInput
        name="price"
        label="Commission Price"
        type="number"
        :value="form.data.price"
        :min="0"
        :max="100000000"
        @update:value="(val: number) => form.data.price = val"
        class="w-3/4 md:w-1/3"
      />

      <VInput
        name="subscription"
        label="Commission Subscription Price"
        type="number"
        :value="form.data.subscription"
        :min="0"
        :max="100000000"
        @update:value="(val: number) => form.data.subscription = val"
        class="w-3/4 md:w-1/3"
      />

      <div
        class="w-full flex flex-col md:flex-row md:justify-around py-2 md:p-0"
      >
        <button
          type="submit"
          :class="form.pending && 'cursor-wait'"
          class="btn mt-8"
          :disabled="form.pending"
        >
          <span class="text-center" v-if="!form.pending"
            >Set Price & Agree</span
          >
          <ClientOnly>
            <Icon
              v-if="form.pending"
              name="eos-icons:bubble-loading"
              class="text-accent text-center"
              size="1.2rem"
            ></Icon>
          </ClientOnly>
        </button>
        <button
          type="button"
          @click="emit('cancel')"
          :class="form.pending && 'cursor-wait'"
          class="btn mt-8"
          :disabled="form.pending"
        >
          <span class="text-center" v-if="!form.pending">Cancel</span>
          <ClientOnly>
            <Icon
              v-if="form.pending"
              name="eos-icons:bubble-loading"
              class="text-accent text-center"
              size="1.2rem"
            ></Icon>
          </ClientOnly>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: "cancel"): void;
  (event: "agree", json: string): void;
}>();

const handleSubmit = () => {
  emit("agree", JSON.stringify(form.data));
};

const form = reactive({
  data: {
    price: 0,
    subscription: 0,
  },
  error: "",
  pending: false,
});
</script>

<style scoped></style>
