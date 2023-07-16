<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { ref } from "vue";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

const props = defineProps(["labels", "title", "data"]);

const { enabled } = useTheme();

watch(enabled, () => {
  primaryCh.value = enabled.value ? "rgb(75, 192, 192)" : "rgb(16, 59, 65)";
  accentCh.value = enabled.value ? "rgb(255, 196, 61)" : "rgb(164, 38, 0)";
});

const primaryCh = ref(enabled.value ? "rgb(75, 192, 192)" : "rgb(16, 59, 65)");
const accentCh = ref(enabled.value ? "rgb(255, 196, 61)" : "rgb(164, 38, 0)");

const chartData = computed(() => {
  return {
    labels: props.labels,
    datasets: [
      {
        label: props.title,
        borderColor: primaryCh.value,
        backgroundColor: primaryCh.value,
        data: props.data,
      },
    ],
  };
});
const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: accentCh.value,
        },
      },
      y: {
        ticks: {
          color: accentCh.value,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: primaryCh.value, // not 'fontColor:' anymore
          // fontSize: 18  // not 'fontSize:' anymore
          font: {
            size: 16, // 'size' now within object 'font {}'
          },
        },
      },
    },
  };
});
</script>

<style scoped></style>
