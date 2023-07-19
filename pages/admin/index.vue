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

    <section class="w-full h-96 my-2 flex justify-center">
      <VChart
        :labels="currentStat.labels"
        :title="currentStat.title"
        :data="currentStat.data"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { Dataset, DateFilter, RawDataset } from "~/interfaces/dataset.client";
import { MONTHS } from "~/interfaces/constants";
import Visit from "~/interfaces/visit";

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

function months(config: any) {
  var cfg = config || {};
  var count = cfg.count || 12;
  var section = cfg.section;
  var values = [];
  var i, value;

  for (i = 0; i < count; ++i) {
    value = MONTHS[Math.ceil(i) % 12];
    values.push(value.substring(0, section));
  }

  return values;
}

function lastDay(month: number, year: number) {
  if (month == 1) {
    if ((0 == year % 4 && 0 != year % 100) || 0 == year % 400) return 29;
    else return 28;
  }

  if (month < 7) {
    return month % 2 === 0 ? 31 : 30;
  } else return month % 2 === 0 ? 30 : 31;
}

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

const allTime = (set: RawDataset): Dataset => {
  const dates: Date[] = set.data
    .map((visitor: Visit) => new Date(visitor.date))
    .sort((a: Date, b: Date) => new Date(a).getTime() - new Date(b).getTime());

  if (dates.length === 0) return { title: set.title, labels: [], data: [] };

  const initialDate = dates[0];

  const currentDate = new Date();

  const between = currentDate.getTime() - initialDate.getTime();
  const years = [];
  const ydata = [];
  if (between >= 31557600000 * 3) {
    for (
      let i = initialDate.getFullYear();
      i <= currentDate.getFullYear();
      i++
    ) {
      for (let j = initialDate.getMonth(); j < 12; j += 7) {
        if (j < 12) {
          years.push(`${months({ count: 12 })[j]} ${i}`);
          ydata.push(
            set.data.filter(
              (x: Visit) =>
                new Date(x.date).getMonth() === j &&
                new Date(x.date).getFullYear() === i
            ).length
          );
        }
      }
    }
    return { title: set.title, labels: years, data: ydata };
  } else if (between > 31557600000 && between < 31557600000 * 3) {
    for (
      let i = initialDate.getFullYear();
      i <= currentDate.getFullYear();
      i++
    ) {
      for (let j = initialDate.getMonth(); j < 12; j += 3) {
        if (j < 12) {
          years.push(`${months({ count: 12 })[j]} ${i}`);
          ydata.push(
            set.data.filter(
              (x: any) =>
                new Date(x.date).getMonth() === j &&
                new Date(x.date).getFullYear() === i
            ).length
          );
        }
      }
    }
    return { title: set.title, labels: years, data: ydata };
  } else {
    for (let j = initialDate.getMonth(); j >= 0; j -= 1) {
      if (j < 12) {
        years.push(`${months({ count: 12 })[j]} ${initialDate.getFullYear()}`);
        if (!set.callback) {
          ydata.push(
            set.data.filter(
              (x: any) =>
                new Date(x.date).getMonth() === j &&
                new Date(x.date).getFullYear() === initialDate.getFullYear()
            ).length
          );
        } else {
          ydata.push(
            set.callback(
              set.data.filter(
                (x: any) =>
                  new Date(x.date).getMonth() === j &&
                  new Date(x.date).getFullYear() === initialDate.getFullYear()
              )
            )
          );
        }
      }
    }
    return { title: set.title, labels: years.reverse(), data: ydata.reverse() };
  }
};

const YTD = (set: RawDataset): Dataset => {
  const labels = months({ count: 12 });
  const tmp = set.data.filter(
    (x: any) => new Date(x.date).getFullYear() === new Date().getFullYear()
  );
  const ydata: any = [];

  labels.forEach((_, index) => {
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: any) => new Date(x.date).getMonth() === index).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: any) => new Date(x.date).getMonth() === index)
        )
      );
    }
  });
  return { title: set.title, labels, data: ydata };
};

const last12Months = (set: RawDataset): Dataset => {
  const now = new Date();
  const labels: any = [];
  const tmp = set.data.filter(
    (x: any) => now.getTime() - new Date(x.date).getTime() <= 31557600000
  );
  const ydata: any = [];

  const Months = months({ count: 12 });

  for (let index = now.getMonth(); index !== now.getMonth() - 12; index--) {
    const mnx = index >= 0 ? index : 12 + index;
    labels.push(
      `${Months[mnx]} ${index >= 0 ? now.getFullYear() : now.getFullYear() - 1}`
    );
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => new Date(x.date).getMonth() === mnx).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => new Date(x.date).getMonth() === mnx)
        )
      );
    }
  }
  return { title: set.title, labels, data: ydata };
};

const lastMonth = (set: RawDataset): Dataset => {
  const now = new Date();
  const labels: any = [];
  const Months = months({ count: 12 });
  const tmp = set.data.filter((x: any) => {
    const date = new Date(x.date);
    if (date.getMonth() !== 0) {
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() - 1
      );
    } else {
      return (
        date.getFullYear() === now.getFullYear() - 1 && date.getMonth() === 11
      );
    }
  });

  const ydata: any = [];

  for (let index = 1; index < 30; index++) {
    labels.push(
      `${index} ${
        now.getMonth() - 1 < 0 ? Months[11] : Months[now.getMonth() - 1]
      }`
    );
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return (
            date.getDate() === index &&
            date.getMonth() ===
              (now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1)
          );
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return (
              date.getDate() === index &&
              date.getMonth() ===
                (now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1)
            );
          })
        )
      );
    }
  }
  return { title: set.title, labels, data: ydata };
};

const last30Days = (set: RawDataset): Dataset => {
  const now = new Date();
  const labels: any = [];
  const tmp = set.data.filter(
    (x: any) => now.getTime() - new Date(x.date).getTime() <= 2629800000
  );

  const Months = months({ count: 12 });
  const ydata: any = [];

  for (let index = now.getDate(); index !== now.getDate() - 30; index--) {
    const dnx =
      index >= 0
        ? index
        : lastDay(now.getMonth() - 1, now.getFullYear()) + index;
    labels.push(
      `${dnx} ${
        index >= 0
          ? Months[now.getMonth()]
          : now.getMonth() - 1 < 0
          ? Months[11]
          : Months[now.getMonth() - 1]
      }`
    );
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return (
            date.getDate() === dnx &&
            date.getMonth() ===
              (index > 0
                ? now.getMonth()
                : now.getMonth() - 1 < 0
                ? 11
                : now.getMonth() - 1)
          );
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return (
              date.getDate() === dnx &&
              date.getMonth() ===
                (index > 0
                  ? now.getMonth()
                  : now.getMonth() - 1 < 0
                  ? 11
                  : now.getMonth() - 1)
            );
          })
        )
      );
    }
  }
  return { title: set.title, labels: labels.reverse(), data: ydata };
};

const MTD = (set: RawDataset): Dataset => {
  const now = new Date();
  const labels: any = [];
  const tmp = set.data.filter(
    (x: any) => new Date(x.date).getMonth() === new Date().getMonth()
  );
  const Months = months({ count: 12 });
  const ydata: any = [];

  for (
    let index = 1;
    index < lastDay(now.getMonth() - 1, now.getFullYear());
    index++
  ) {
    labels.push(
      `${index} ${
        now.getMonth() - 1 < 0 ? Months[11] : Months[now.getMonth() - 1]
      }`
    );
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return (
            date.getDate() === index &&
            date.getMonth() ===
              (now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1)
          );
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return (
              date.getDate() === index &&
              date.getMonth() ===
                (now.getMonth() - 1 < 0 ? 11 : now.getMonth() - 1)
            );
          })
        )
      );
    }
  }
  return { title: set.title, labels, data: ydata };
};

const last7Days = (set: RawDataset): Dataset => {
  const now = new Date();
  const labels: any = [];
  const tmp = set.data.filter(
    (x: any) => now.getTime() - new Date(x.date).getTime() <= 2629800000
  );

  const Months = months({ count: 12 });
  const ydata: any = [];

  for (let index = now.getDate(); index >= now.getDate() - 7; index--) {
    const dnx =
      index >= 0
        ? index
        : lastDay(now.getMonth() - 1, now.getFullYear()) + index;
    labels.push(
      `${dnx} ${
        index >= 0
          ? Months[now.getMonth()]
          : now.getMonth() - 1 < 0
          ? Months[11]
          : Months[now.getMonth() - 1]
      }`
    );
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return (
            date.getDate() === dnx &&
            date.getMonth() ===
              (index > 0
                ? now.getMonth()
                : now.getMonth() - 1 < 0
                ? 11
                : now.getMonth() - 1)
          );
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return (
              date.getDate() === dnx &&
              date.getMonth() ===
                (index > 0
                  ? now.getMonth()
                  : now.getMonth() - 1 < 0
                  ? 11
                  : now.getMonth() - 1)
            );
          })
        )
      );
    }
  }
  return { title: set.title, labels: labels.reverse(), data: ydata.reverse() };
};

const today = (set: RawDataset): Dataset => {
  const now = new Date();
  const tmp = set.data.filter((x: any) => {
    const date = new Date(x.date);
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  });

  const ydata: any = [];

  for (let index = 0; index < 22; index += 3) {
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return date.getHours() === index;
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return date.getHours() === index;
          })
        )
      );
    }
  }
  return {
    title: set.title,
    labels: [
      "00:00",
      "03:00",
      "06:00",
      "09:00",
      "12:00",
      "15:00",
      "18:00",
      "21:00",
    ],
    data: ydata,
  };
};

const realtime = (set: RawDataset): Dataset => {
  const now = new Date();
  const tmp = set.data.filter((x: any) => {
    const date = new Date(x.date);
    return date.getTime() - now.getTime() <= 1800000;
  });

  const ydata: any = [];

  for (let index = 30; index >= 2; index -= 4) {
    if (!set.callback) {
      ydata.push(
        tmp.filter((x: Visit) => {
          const date = new Date(x.date);
          return date.getTime() - now.getTime() <= index * 60000;
        }).length
      );
    } else {
      ydata.push(
        set.callback(
          tmp.filter((x: Visit) => {
            const date = new Date(x.date);
            return date.getTime() - now.getTime() <= index * 60000;
          })
        )
      );
    }
  }

  return {
    title: set.title,
    labels: ["-30m", "-26m", "-22m", "-18m", "-14m", "-10m", "-6m", "-2m"],
    data: ydata,
  };
};

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
