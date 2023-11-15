<template>
  <main class="flex flex-col w-full">
    <section
      class="text-primary text-center text-xl my-6 md:text-2xl flex flex-col md:flex-row w-full items-center"
    >
      <span class="md:hidden">Admin Dashboard</span>
      <span class="flex items-center md:ml-6"
        ><div
          class="mr-2 h-3 w-3 rounded-full"
          :class="online > 0 ? 'bg-success' : 'bg-gray-600'"
        ></div>
        {{ online }} current visitor{{ online !== 1 ? "s" : "" }}</span
      >
    </section>

    <section
      class="flex w-full mx-2 my-6 border-2 border-accent p-6 !overflow-x-scroll truncate"
    >
      <VStat
        desc="Unique Visitors"
        :value="uniqueVisitors.length"
        @click="() => handleStat(0)"
        :active="selectedStat.index === 0"
      />
      <VertSep />
      <VStat
        desc="Total Visits"
        :value="visitors.length"
        @click="() => handleStat(1)"
        :active="selectedStat.index === 1"
      />
      <VertSep />
      <VStat
        desc="Total Pageviews"
        :value="pageviews"
        @click="() => handleStat(2)"
        :active="selectedStat.index === 2"
      />
      <VertSep />
      <VStat
        desc="Views Per Visit"
        :value="avgViewVisit"
        @click="() => handleStat(3)"
        :active="selectedStat.index === 3"
      />
      <VertSep />
      <VStat
        desc="Bounce Rate"
        :value="bounceRate"
        @click="() => handleStat(4)"
        :active="selectedStat.index === 4"
      />
      <VertSep />
      <VStat
        desc="Visit Duration"
        :value="avgDuration"
        @click="() => handleStat(5)"
        :active="selectedStat.index === 5"
      />
    </section>

    <VSelectbox
      :options="filters"
      @change="(fil: DateFilter) => handleStatFilter(fil)"
    />

    <section class="w-full h-96 my-2 flex justify-center">
      <VChart
        :labels="currentStat.labels"
        :title="currentStat.title"
        :data="currentStat.data"
      />
    </section>

    <section
      class="w-full flex flex-col md:flex-row justify-around my-6 items-center md:items-start"
    >
      <ul class="card">
        <li>
          <span class="font-bold">Sauce</span>
          <span class="font-bold">Visitors</span>
        </li>
        <li v-for="sauce in sauceData">
          <span :title="sauce.url">{{ sauce.url }}</span>
          <span>{{ sauce.visits }}</span>
        </li>
      </ul>

      <ul class="card">
        <li>
          <span class="font-bold">Devices</span>
          <span class="font-bold">Visitors</span>
        </li>
        <li v-for="device in deviceData">
          <span :title="device.info">{{ device.info }}</span>
          <span>{{ device.visits }}</span>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  DateFilter,
  MTD,
  type RawDataset,
  YTD,
  allTime,
  last12Months,
  last30Days,
  last7Days,
  lastMonth,
  realtime,
  today,
} from "~/interfaces/dataset.client";
import type Visit from "~/interfaces/visit";
import { UAParser } from "ua-parser-js";

const { $io } = useNuxtApp();

onMounted(() => {
  $io.emit("join");
  $io.on("init", (message: { visitors: Visit[]; current: number }) => {
    visitors.value = message.visitors;
    online.value = message.current;
  });
  $io.on("collect", (message: { visitor: Visit; current: number }) => {
    online.value = message.current;
    visitors.value.push(message.visitor);
  });
  $io.on("visitors", (message: { current: number }) => {
    online.value = message.current;
  });
});

definePageMeta({
  layout: "admin",
  middleware: ["admin-only"],
});

const online = ref<number>(0);
let visitors = ref<Visit[]>([]);

const handleStat = (i: number) => {
  selectedStat.index = i;
};

const handleStatFilter = (fil: DateFilter) => {
  selectedStat.filter = fil;
};

const deviceData = computed(() => {
  const unique = [...new Set(visitors.value.map((v) => v.agent))];
  const deviceInfo = [
    ...new Set(
      unique.map((agent) => {
        const info = new UAParser(agent);
        return {
          info: info.getBrowser().name + " / " + info.getOS().name,
          agent: agent,
        };
      })
    ),
  ];

  return deviceInfo
    .map((device) => {
      return {
        info: device.info,
        visits: visitors.value.filter((v) => v.agent === device.agent).length,
      };
    })
    .sort((a, b) => b.visits - a.visits);
});

const sauceData = computed(() => {
  const unique = [...new Set(visitors.value.map((v) => v.sauce))];

  return unique
    .map((sauce) => {
      return {
        url: sauce,
        visits: visitors.value.filter((v) => v.sauce === sauce).length,
      };
    })
    .sort((a, b) => b.visits - a.visits);
});

const uniqueVisitors = computed(() => {
  const uvs: any[] = [];
  const uniqueIps = [...new Set(visitors.value.map((x) => x.ip))];
  uniqueIps.forEach((ip) => {
    const vis = visitors.value.find((x) => x.ip === ip);
    uvs.push(vis);
  });

  return uvs;
});

const pageviews = computed(() =>
  visitors.value.reduce((prev, cur) => prev + cur.views, 0)
);

const avgViewVisit = computed(() =>
  (pageviews.value / visitors.value.length).toFixed(2)
);

const bounceRate = computed(
  () =>
    `${Math.trunc(
      visitors.value.length /
        visitors.value.filter((visit) => visit.views === 0).length
    )}%`
);

const avgDuration = computed(
  () =>
    `${Math.trunc(
      visitors.value.reduce((prev, cur) => prev + cur.duration, 0) /
        visitors.value.length /
        1000
    )} sec.`
);

const filters: { label: string; filter: DateFilter }[] = [
  { label: "All Time", filter: DateFilter.ALL_TIME },
  { label: "Last 12 Months", filter: DateFilter.LAST_12_MONTHS },
  { label: "YTD", filter: DateFilter.YTD },
  { label: "Last Month", filter: DateFilter.LAST_MONTH },
  { label: "MTD", filter: DateFilter.MTD },
  { label: "Last 30 Days", filter: DateFilter.LAST_30_DAYS },
  { label: "Last 7 Days", filter: DateFilter.LAST_7_DAYS },
  { label: "Today", filter: DateFilter.TODAY },
  { label: "Realtime", filter: DateFilter.REALTIME },
];

const datasets = ref<RawDataset[]>([
  { title: "Unique Visitors", data: uniqueVisitors },
  { title: "Total Visits", data: visitors },
  {
    title: "Total Pageviews",
    data: visitors,
    callback: (arr: any) => {
      return arr.reduce((prev: number, cur: Visit) => prev + cur.views, 0);
    },
  },
  {
    title: "Views per Visit",
    data: visitors,
    callback: (arr: any) => {
      return +(
        arr.reduce((prev: number, cur: Visit) => prev + cur.views, 0) /
        arr.length
      ).toFixed(2);
    },
  },
  {
    title: "Bounce Rate",
    data: visitors,
    callback: (arr: any) => {
      return Math.trunc(
        arr.length / arr.filter((visit: Visit) => visit.views === 0).length
      );
    },
  },
  {
    title: "Visit Duration",
    data: visitors,
    callback: (arr: any) => {
      return Math.trunc(
        arr.reduce((prev: number, cur: Visit) => prev + cur.duration, 0) /
          arr.length /
          1000
      );
    },
  },
]);

const selectedStat = reactive<{ index: number; filter: DateFilter }>({
  index: 0,
  filter: DateFilter.LAST_7_DAYS,
});

const currentStat = computed(() => {
  const cur = datasets.value[selectedStat.index];

  switch (selectedStat.filter) {
    case DateFilter.ALL_TIME:
      return allTime(cur);
    case DateFilter.LAST_12_MONTHS:
      return last12Months(cur);
    case DateFilter.YTD:
      return YTD(cur);
    case DateFilter.LAST_MONTH:
      return lastMonth(cur);
    case DateFilter.MTD:
      return MTD(cur);
    case DateFilter.LAST_30_DAYS:
      return last30Days(cur);
    case DateFilter.LAST_7_DAYS:
      return last7Days(cur);
    case DateFilter.TODAY:
      return today(cur);
    case DateFilter.REALTIME:
      return realtime(cur);
    default:
      return { title: "error", labels: [], data: [] };
  }
});
</script>

<style scoped></style>
