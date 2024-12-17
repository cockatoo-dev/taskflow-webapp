<script setup lang="ts">
  const props = defineProps<{
    complete: number,
    ready: number,
    notReady: number
  }>()
  const isDark = useDark()
  import { Doughnut } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Tooltip,
    ArcElement
  } from 'chart.js';

  ChartJS.register(
    ArcElement,
    Tooltip
  );

const statsChartData = computed(() => {
  return {
    datasets: [{
      data: [
        props.complete,
        props.ready,
        props.notReady
      ],
      backgroundColor: [
        isDark.value ? '#4ade80' : '#22c55e',
        isDark.value ? '#60a5fa' : '#3b82f6',
        isDark.value ? '#f87171' : '#ef4444'
      ],
      borderWidth: 1,
      borderColor: isDark.value ? '#000000' : '#ffffff'
    }]
  }
})
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>

<template>
  <div class="w-64 h-64 mx-auto my-8">
    <Doughnut
      :data="statsChartData"
      :options="chartOptions"
    />
  </div>
  <div
    v-if="$props.complete > 0 || $props.ready > 0 || $props.notReady > 0"
    class="w-64 mx-auto text-2xl font-bold text-black dark:text-white"
  >
    <p>
      <span class="text-green-500 dark:text-green-400">{{ $props.complete }}</span> {{ $props.complete == 1 ? 'task' : 'tasks' }} completed
    </p>
    <p>
      <span class="text-blue-500 dark:text-blue-400">{{ $props.ready }}</span> {{ $props.ready == 1 ? 'task' : 'tasks' }} ready
    </p>
    <p>
      <span class="text-red-500 dark:text-red-400">{{ $props.notReady }}</span> {{ $props.notReady == 1 ? 'task' : 'tasks' }} not ready
    </p>
  </div>
</template>