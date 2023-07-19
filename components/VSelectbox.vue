<template>
  <div class="w-72">
    <Listbox v-model="selectedOption">
      <div class="relative mt-1">
        <ListboxButton
          class="relative w-full cursor-default rounded-lg bg-base py-2 pl-3 pr-10 text-left shadow-md focus:outline-none sm:text-sm"
        >
          <span class="block truncate text-primary text-lg md:text-xl">{{
            selectedOption.label
          }}</span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <Icon
              name="ic:outline-keyboard-double-arrow-down"
              class="text-primary"
              size="1.2rem"
            />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-std py-1 text-lg md:text-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ListboxOption
              v-slot="{ active, selected }"
              v-for="option in props.options"
              :key="option.label"
              :value="option"
              as="template"
            >
              <li
                :class="[
                  active ? 'font-bold text-accent' : 'text-primary',
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                  >{{ option.label }}</span
                >
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-accent"
                >
                  <Icon
                    name="ic:baseline-check"
                    class="text-accent"
                    size="1rem"
                  />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

const props = defineProps(["options"]);
const emits = defineEmits(["change"]);

const selectedOption = ref(props.options[6]);

watch(selectedOption, () => {
  emits("change", selectedOption.value.filter);
});
</script>

<style scoped></style>
