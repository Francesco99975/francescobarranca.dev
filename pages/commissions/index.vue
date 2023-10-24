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

        <VRadioCommission
          v-if="environs && environs.length > 0"
          :platforms="environs"
          @choice="handleEnvironsSelection"
        />

        <div v-if="chosenEnv === 'Website'" class="flex justify-between p-2">
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

        <VInput
          name="pages"
          label="How many pages/screens does you app/website need?"
          type="number"
          :value="form.data.pages"
          :min="0"
          :max="10"
          @update:value="(val: number) => form.data.pages = val"
          class="w-2/3 md:w-1/3"
        />

        <div class="flex flex-col w-full justify-center items-center mt-8">
          <h2 class="text-lg text-center text-accent font-bold">Client Info</h2>
          <VInput
            name="email"
            label="Your Email Address"
            type="text"
            :value="form.data.customerEmail"
            @update:value="(val: string) => form.data.customerEmail = val"
            class="w-full md:w-3/4"
          />

          <VInput
            name="firstname"
            label="Your First Name"
            type="text"
            :value="form.data.customerFirstname"
            @update:value="(val: string) => form.data.customerFirstname = val"
            class="w-full md:w-3/4"
          />

          <VInput
            name="middlename"
            label="Your Middle Name (if applicable)"
            type="text"
            :value="form.optional.customerMiddlename"
            @update:value="(val: string) => form.optional.customerMiddlename = val"
            class="w-full md:w-3/4"
          />

          <VInput
            name="lastname"
            label="Your Last name"
            type="text"
            :value="form.data.customerLastname"
            @update:value="(val: string) => form.data.customerLastname = val"
            class="w-full md:w-3/4"
          />

          <VInput
            name="address"
            label="Your Address"
            type="text"
            :value="form.data.customerAddress"
            @update:value="(val: string) => form.data.customerAddress = val"
            class="w-full md:w-3/4"
          />
        </div>

        <div class="flex justify-around pt-6">
          <span class="text-primary font-bold"
            >I Agree to the
            <NuxtLink
              to="/privacy"
              class="italic hover:underline hover:text-accent underline-offset-4"
              >Privacy Policy</NuxtLink
            >
            and
            <NuxtLink
              to="/terms"
              class="italic hover:underline hover:text-accent underline-offset-4"
              >Terms and Conditions</NuxtLink
            ></span
          >
          <HeadlessSwitch
            v-model="form.data.privacyPolicyAgreed"
            @click="togglePrivacy"
            :class="
              form.data.privacyPolicyAgreed ? 'bg-gray-800' : 'bg-gray-800'
            "
            class="inline-flex h-[33px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            <span
              aria-hidden="true"
              :class="
                form.data.privacyPolicyAgreed
                  ? 'translate-x-9'
                  : 'translate-x-1'
              "
              class="pointer-events-none inline-block transform shadow-lg ring-0 transition duration-200 ease-in-out"
            >
              <ClientOnly>
                <Icon
                  name="line-md:confirm-circle"
                  v-if="form.data.privacyPolicyAgreed"
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
import Commission from "interfaces/commission";
import { Customer } from "interfaces/customer";

const environs = ref<{ name: string; value: boolean }[]>([
  { name: "CLI App", value: false },
  { name: "Website", value: false },
  { name: "Mobile App (Android)", value: false },
  { name: "Mobile App (iOS)", value: false },
  { name: "Desktop App", value: false },
]);

const chosenEnv = ref<string>("");

const pwa = ref<boolean>(false);

const togglePWA = () => {
  pwa.value = !pwa.value;
};

const togglePrivacy = () => {
  form.data.privacyPolicyAgreed = !form.data.privacyPolicyAgreed;
};

const handleEnvironsSelection = (choice: string) => {
  chosenEnv.value = choice;
};

const form = reactive({
  data: {
    subject: "",
    description: "",
    theme: "",
    pages: 0,
    customerEmail: "",
    customerFirstname: "",

    customerLastname: "",
    customerAddress: "",
    privacyPolicyAgreed: false,
  },
  optional: {
    customerMiddlename: "",
  },
  error: "",
  pending: false,
});

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  try {
    form.pending = true;
    form.error = "";

    if (
      Object.values(form.data)
        .filter((x) => typeof x === "string")
        .some((x) => x.toString().trim().length <= 0 || form.data.pages <= 0)
    ) {
      form.error = "Invalid Data";
      return;
    }

    const commission: Commission = {
      subject: form.data.subject,
      description: form.data.description,
      pages: form.data.pages,
      theme: form.data.theme,
      environ: chosenEnv.value,
      pwa: pwa.value,
    };

    const customer: Customer = {
      email: form.data.customerEmail,
      firstname: form.data.customerFirstname,
      middlename: form.optional.customerMiddlename,
      lastname: form.data.customerLastname,
      address: form.data.customerAddress,
    };

    await $fetch<Commission>("/api/commissions", {
      method: "POST",
      body: {
        commission,
        customer,
        privacyPolicyAgreed: form.data.privacyPolicyAgreed,
      },
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
      customerAddress: "",
      customerFirstname: "",
      customerLastname: "",
      privacyPolicyAgreed: false,
    };
    form.optional = { customerMiddlename: "" };
    form.pending = false;
  }
};
</script>

<style scoped></style>
