<template>
  <main class="container mx-auto px-4 py-6">
    <section class="flex flex-col justify-between">
      <h1 class="text-primary text-xl font-bold">Send a commission</h1>
      <form @submit="handleSubmit" class="flex flex-col justify-between p-2">
        <VInput
          name="subject"
          label="Brief description of your idea"
          type="text"
          :value="form.data.subject"
          @update:value="(val: string) => form.data.subject = val"
        />

        <VArea
          name="description"
          label="Detailed description of your idea"
          :value="form.data.description"
          @update:value="(val: string) => form.data.description = val"
        />

        <VArea
          name="theme"
          label="Detailed description the theme and colors to be used"
          :value="form.data.theme"
          @update:value="(val: string) => form.data.theme = val"
        />

        <h3 class="text-primary text-lg italic">Choose platforms needed</h3>

        <VMultiCheck
          v-if="environs && environs.length > 0"
          :options="
            environs.map((el) => {
              return { id: el.name, label: el.name };
            })
          "
          @choice="handleEnvironsSelection"
        />

        <div v-if="environs[1].value" class="flex justify-between p-2">
          <span class="text-primary"
            >Should this website operate as an installable application on
            desktop and mobile ?</span
          >
          <HeadlessSwitch
            v-model="pwa"
            @click="togglePWA"
            :class="pwa ? 'bg-gray-800' : 'bg-gray-800'"
            class="inline-flex h-[33px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            <span
              aria-hidden="true"
              :class="pwa ? 'translate-x-9' : 'translate-x-1'"
              class="pointer-events-none inline-block transform shadow-lg ring-0 transition duration-200 ease-in-out"
            >
              <ClientOnly>
                <Icon
                  name="line-md:confirm-circle"
                  v-if="pwa"
                  class="text-success text-center"
                  size="1.2rem"
                />
                <Icon
                  name="material-symbols:do-not-disturb-on-outline"
                  size="1.2rem"
                  v-else
                  class="text-error text-center"
                />
              </ClientOnly>
            </span>
          </HeadlessSwitch>
        </div>

        <div v-if="environs[1].value" class="flex justify-between p-2">
          <span class="text-primary"
            >Does this website manage data like users or images?</span
          >
          <HeadlessSwitch
            v-model="stat"
            @click="toggleStatic"
            :class="stat ? 'bg-gray-800' : 'bg-gray-800'"
            class="inline-flex h-[33px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            <span
              aria-hidden="true"
              :class="stat ? 'translate-x-9' : 'translate-x-1'"
              class="pointer-events-none inline-block transform shadow-lg ring-0 transition duration-200 ease-in-out"
            >
              <ClientOnly>
                <Icon
                  name="line-md:confirm-circle"
                  v-if="stat"
                  class="text-success text-center"
                  size="1.2rem"
                />
                <Icon
                  name="material-symbols:do-not-disturb-on-outline"
                  size="1.2rem"
                  v-else
                  class="text-error text-center"
                />
              </ClientOnly>
            </span>
          </HeadlessSwitch>
        </div>

        <VInput
          name="pages"
          label="How many pages/screens does you app/website need?"
          type="number"
          :value="form.data.pages"
          :min="0"
          :max="10"
          @update:value="(val: number) => form.data.pages = val"
        />

        <VInput
          name="email"
          label="Your Email Adress"
          type="text"
          :value="form.data.customerEmail"
          @update:value="(val: string) => form.data.customerEmail = val"
        />

        <button
          type="submit"
          :class="form.pending && 'cursor-wait'"
          class="btn mt-8"
          :disabled="form.pending"
        >
          <span class="text-center" v-if="!form.pending"
            >Submit Commission</span
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
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { Commission } from "@prisma/client";

const environs = ref<{ name: string; value: boolean }[]>([
  { name: "CLI App", value: false },
  { name: "Webiste", value: false },
  { name: "Mobile App (Android)", value: false },
  { name: "Mobile App (iOS)", value: false },
  { name: "Desktop App", value: false },
]);

const pwa = ref<boolean>(false);

const togglePWA = () => {
  pwa.value = !pwa.value;
};

const stat = ref<boolean>(false);

const toggleStatic = () => {
  stat.value = !stat.value;
};

const handleEnvironsSelection = (choice: {
  index: number;
  status: boolean;
}) => {
  environs.value[choice.index].value = choice.status;
};

const form = reactive({
  data: {
    subject: "",
    description: "",
    theme: "",
    pages: 0,
    customerEmail: "",
  },
  error: "",
  pending: false,
});

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  try {
    const _environs = environs.value.filter((x) => x.value).map((x) => x.name);
    form.pending = true;
    form.error = "";

    if (
      _environs.length <= 0 ||
      Object.values(form.data)
        .filter((x) => typeof x === "string")
        .some((x) => x.toString().trim().length <= 0 || form.data.pages <= 0)
    ) {
      form.error = "Invalid Data";
      return;
    }

    const commission = {
      ...form.data,
      environs: _environs,
      static: !stat,
      pwa: pwa.value,
    };

    await $fetch<Commission>("/api/commissions", {
      method: "POST",
      body: commission,
    });
  } catch (error) {
    form.error = "Something Went wrong";
  } finally {
    form.data = {
      subject: "",
      description: "",
      theme: "",
      pages: 0,
      customerEmail: "",
    };
    form.pending = false;
  }
};
</script>

<style scoped></style>
