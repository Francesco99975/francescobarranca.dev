<template>
  <main class="flex flex-col w-full items-center justify-center h-[80vh]">
    <h1 class="text-3xl md:text-6xl text-primary my-5">Admin Login</h1>
    <p v-if="form.error" class="my-3 text-std bg-error rounded shadow-md p-2">
      {{ form.error }}
    </p>

    <form
      @submit.prevent="handleSubmit"
      class="shadow-2xl border-x-2 border-accent rounded bg-transparent text-primary flex flex-col items-center m-6 p-2 w-10/12 md:w-2/6"
    >
      <VInput
        name="username"
        label="Username"
        type="text"
        :value="form.data.username"
        @update:value="(val: string) => form.data.username = val"
      />
      <VInput
        name="password"
        label="Password"
        type="password"
        :value="form.data.password"
        @update:value="(val: string) => form.data.password = val"
      />
      <div class="form-control !flex-row">
        <label for="me">Remember me</label>
        <input
          id="me"
          v-model="form.data.me"
          type="checkbox"
          class="cursor-pointer"
        />
      </div>
      <button type="submit" class="logbtn" :disabled="form.pending">
        Login
      </button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { useAuth } from "~/composables/auth";

definePageMeta({
  layout: false,
});

const { login } = useAuth();

const form = reactive({
  data: {
    username: "",
    password: "",
    me: false,
  },
  error: "",
  pending: false,
});

const handleSubmit = async () => {
  try {
    form.error = "";
    form.pending = true;
    await login(form.data.username, form.data.password, form.data.me);
    await navigateTo("/admin", { replace: true });
  } catch (error: any) {
    console.error(error);

    if (error.data.message) form.error = error.data.message;
  } finally {
    form.pending = false;
  }
};
</script>

<style scoped></style>
