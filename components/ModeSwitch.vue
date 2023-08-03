<template>
  <div>
    <HeadlessSwitch
      v-model="enabled"
      v-if="enabled !== null"
      @click="toggleTheme"
      :class="enabled ? 'bg-black' : 'bg-gray-300'"
      class="relative inline-flex h-[33px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      <span class="sr-only">Mode setting</span>
      <span
        aria-hidden="true"
        :class="enabled ? 'translate-x-9' : 'translate-x-1'"
        class="pointer-events-none inline-block transform shadow-lg ring-0 transition duration-200 ease-in-out"
      >
        <ClientOnly>
          <Icon
            name="bi:moon-fill"
            v-if="enabled"
            class="text-primary text-center"
            size="1.2rem"
          />
          <Icon
            name="bi:sun-fill"
            size="1.2rem"
            v-else
            class="text-accent text-center"
          />
        </ClientOnly>
      </span>
    </HeadlessSwitch>
  </div>
</template>

<script setup lang="ts">
import useTheme from "~/composables/useTheme";

useHead({
  script: [
    {
      children: `if (localStorage.theme === "dark" || (!('theme' in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
        } else {
        document.documentElement.classList.remove("dark")
        }`,
    },
  ],
});

const { enabled, toggleTheme } = useTheme();
</script>
