<script setup lang="ts">
  import { Doughnut } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Tooltip,
    ArcElement
  } from 'chart.js';
  const props = defineProps<{
    complete: number,
    ready: number,
    notReady: number
  }>()
  const isDark = useDark()

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
        isDark.value ? '#4ade80' : '#16a34a',
        isDark.value ? '#60a5fa' : '#2563eb',
        isDark.value ? '#f87171' : '#dc2626'
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
    class="w-64 mx-auto text-2xl font-bold text-slate-800 dark:text-slate-200"
  >
    <p>
      <span class="text-green-600 dark:text-green-400">{{ $props.complete }}</span> {{ $props.complete == 1 ? 'task' : 'tasks' }} completed
    </p>
    <p>
      <span class="text-blue-600 dark:text-blue-400">{{ $props.ready }}</span> {{ $props.ready == 1 ? 'task' : 'tasks' }} ready
    </p>
    <p>
      <span class="text-red-600 dark:text-red-400">{{ $props.notReady }}</span> {{ $props.notReady == 1 ? 'task' : 'tasks' }} not ready
    </p>
  </div>
</template>