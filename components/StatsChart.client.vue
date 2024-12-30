<script setup lang="ts">
  import { Doughnut } from 'vue-chartjs';
  import { Chart as ChartJS, Tooltip, ArcElement } from 'chart.js';

  const props = defineProps<{
    complete: number,
    ready: number,
    notReady: number
  }>()
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')
  const noAnimate = useMediaQuery('(prefers-reduced-motion)')

  // https://tailwindcss.com/docs/customizing-colors
  const RED_400 = '#f87171'
  const RED_600 = '#dc2626'
  const GREEN_400 = '#4ade80'
  const GREEN_600 = '#16a34a'
  const BLUE_400 = '#60a5fa'
  const BLUE_600 = '#2563eb'
  const SLATE_100 = '#f1f5f9'
  const SLATE_900 = '#0f172a'

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
        isDark.value ? GREEN_400 : GREEN_600,
        isDark.value ? BLUE_400 : BLUE_600,
        isDark.value ? RED_400 : RED_600
      ],
      borderWidth: 1,
      borderColor: isDark.value ? SLATE_900 : SLATE_100
    }],
    labels: ['COMPLETED', 'READY', 'NOT READY']
  }
})

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {animateRotate: !noAnimate.value},
    plugins: {tooltip: {titleColor: SLATE_100, bodyColor: SLATE_100}}
  }
})

</script>

<template>
  <div class="w-64 h-64 mx-auto my-8">
    <Doughnut
      :data="statsChartData"
      :options="chartOptions"
      aria-label="A doughnut chart comparing the number of tasks completed, the number of tasks ready to be complted, and the number of tasks not ready to be completed."
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
