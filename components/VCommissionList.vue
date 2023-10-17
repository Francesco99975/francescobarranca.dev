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
        @change="bubbleChange"
        @reject="bubbleReject"
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
import { Status } from "@prisma/client";
import Commission from "interfaces/commission";

const props = defineProps<{
  list: { commission: Commission; customerEmail: string }[];
}>();

const emit = defineEmits<{
  (event: "change", id: string, status: Status): void;
  (event: "reject", id: string): void;
}>();

const bubbleChange = (id: string, status: Status) => {
  emit("change", id, status);
};

const bubbleReject = (id: string) => {
  emit("reject", id);
};
</script>

<style scoped></style>
