<template>
  <div class="w-full px-4 py-16">
    <div class="mx-auto w-full max-w-md">
      <HeadlessRadioGroup v-model="selected">
        <HeadlessRadioGroupLabel class="sr-only"
          >Platform</HeadlessRadioGroupLabel
        >
        <div class="space-y-2">
          <HeadlessRadioGroupOption
            as="template"
            v-for="platform in platforms"
            :key="platform.name"
            :value="platform"
            v-slot="{ active, checked }"
          >
            <div
              :class="[
                active
                  ? 'ring-2 ring-accent ring-opacity-60 ring-offset-2 ring-offset-accent'
                  : '',
                checked
                  ? 'bg-std bg-opacity-75 text-primary border-2 border-solid border-accent'
                  : 'bg-accent',
              ]"
              class="relative flex bg-accent text-std cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none"
            >
              <div class="flex w-full items-center justify-between">
                <div class="flex items-center">
                  <div class="text-lg md:text-xl">
                    <HeadlessRadioGroupLabel
                      as="p"
                      :class="checked ? 'text-accent' : 'text-std'"
                      class="font-bold"
                    >
                      {{ platform.name }}
                    </HeadlessRadioGroupLabel>
                  </div>
                </div>
                <div v-show="checked" class="shrink-0 text-accent">
                  <ClientOnly>
                    <Icon
                      name="ic:baseline-check"
                      class="text-accent"
                      size="1.5rem"
                    />
                  </ClientOnly>
                </div>
              </div>
            </div>
          </HeadlessRadioGroupOption>
        </div>
      </HeadlessRadioGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ platforms: { name: string; value: boolean }[] }>();
const emits = defineEmits(["choice"]);

const selected = ref(props.platforms[0]);

watch(selected, () => {
  emits("choice", selected.value.name);
});
</script>

<style scoped></style>
