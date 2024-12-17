<script setup lang="ts">
  const props = defineProps<{
    id: string,
    title: string,
    isComplete: boolean,
    numDeps: number,
    selected: string
  }>()

  const bgClass = computed(() => {
    if (props.selected == props.id) {
      return "bg-teal-500 dark:bg-teal-400"
    } else if (props.isComplete) {
      return "bg-green-500 dark:bg-green-400 hover:bg-green-600 dark:hover:bg-green-300"
    } else if (props.numDeps <= 0) {
      return "bg-blue-500 dark:bg-blue-400 hover:bg-blue-600 dark:hover:bg-blue-300"
    } else {
      return "bg-red-500 dark:bg-red-400 hover:bg-red-600 dark:hover:bg-red-300"
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
</script>

<template>
  <UCard
    class="w-full text-sm text-white dark:text-black inline-flex leading-8 line-clamp-1 overflow-ellipsis"
    :class="bgClass"
    :ui="{
      body: { padding: 'px-1 py-0 sm:px-1 sm:py-0' }
    }"
  >
    <UIcon
      :name="icon"
      dynamic
      class="h-5 w-5 ml-1 mr-2 mb-1"
    />
    <span class="leading-6">{{ props.title }}</span>
  </UCard>
</template>