<template>
  <ul
    v-if="props.list.length > 0"
    class="flex flex-col w-full justify-center items-center"
  >
    <li v-for="(el, index) in props.list" :key="index" class="w-full">
      <VCommissionItem
        :subject="el.commission.subject"
        :email="el.customerEmail"
        :environ="el.commission.environ"
        :status="el.commission.status!"
        :id="el.commission.id!"
      />
    </li>
  </ul>

  <div
    v-if="props.list.length <= 0"
    class="flex justify-center items-center w-full h-[80vh]"
  >
    <h2 class="text-2xl font-bold text-primary">Nothing to see here...</h2>
  </div>
</template>

<script setup lang="ts">
import Commission from "interfaces/commission";

const props = defineProps<{
  list: { commission: Commission; customerEmail: string }[];
}>();
</script>

<style scoped></style>
