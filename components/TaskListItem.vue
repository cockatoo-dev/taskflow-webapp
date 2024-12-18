<script setup lang="ts">
  const props = defineProps<{
    boardId: string,
    taskId: string,
    title: string,
    description: string,
    isComplete: boolean,
    numDeps: number
  }>()
  
  const bgClass = computed(() => {
    if (props.isComplete) {
      return "bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300"
    } else if (props.numDeps <= 0) {
      return "bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300"
    } else {
      return "bg-red-600 dark:bg-red-400 hover:bg-red-700 dark:hover:bg-red-300"
    }
  })

  const icon = computed(() => {
    if (props.isComplete) {
      return 'i-heroicons-check-circle-16-solid'
    } else if (props.numDeps <= 0) {
      return 'i-heroicons-play-circle-16-solid'
    } else {
      return 'i-heroicons-clock-16-solid'
    }
  })

  const stateText = computed(() => {
    if (props.isComplete) {
      return 'COMPLETE'
    } else if (props.numDeps <= 0) {
      return 'READY'
    } else {
      return 'NOT READY'
    }
  })

  const isMouseOver = ref(false)
</script>

<template>
  <NuxtLink :to="`/${boardId}/task?taskId=${taskId}`">
    <UCard
      :ui="{ body: { padding: 'p-2 sm:p-2 lg:p-4' } }"
      class="text-slate-200 dark:text-slate-800 text-sm"
      :class="bgClass"
    >
      <div class="inline-flex leading-5">
        <UIcon
          :name="icon"
          class="h-5 w-5 mr-2 mb-1"
        />
        <span
          class="font-bold tracking-wider"
        >
          {{ stateText }}
        </span>
      </div>

      <h3
        class="line-clamp-1 overflow-ellipsis text-2xl font-bold"
        :class="isMouseOver ? 'underline' : ''"
        :title="$props.title"
      >
        {{ props.title }}
      </h3>
      <p class=" h-10 lg:h-20 line-clamp-2 lg:line-clamp-4 overflow-ellipsis">
        {{ props.description }}
      </p>
    </UCard>
  </NuxtLink>
</template>