<script setup lang="ts">
  const props = defineProps<{
    id: string,
    title: string,
    isComplete: boolean,
    numDeps: number,
  }>()
</script>

<template>
  <div>
    <UCard
      v-if="isComplete"
      class="w-full text-slate-100 dark:text-slate-900 inline-flex leading-8 line-clamp-1 overflow-ellipsis bg-green-600 dark:bg-green-400"
      :ui="{body:'px-1 py-0 sm:px-1 sm:py-0'}"
    >
      <div class="flex gap-2">
        <div class="h-8 pl-1 py-1.5">
          <UIcon
            name="i-heroicons-check-circle-16-solid"
            class="h-5 w-5"
          />
        </div>
        <div class="py-0.5">{{ props.title }}</div>
      </div>
    </UCard>
    <UCard
      v-else-if="numDeps <= 0"
      class="w-full text-slate-100 dark:text-slate-900 inline-flex leading-8 line-clamp-1 overflow-ellipsis bg-blue-600 dark:bg-blue-400"
      :ui="{body:'px-1 py-0 sm:px-1 sm:py-0'}"
    >
      <div class="flex gap-2">
        <div class="h-8 pl-1 py-1.5">
          <UIcon
            name="i-heroicons-play-circle-16-solid"
            class="h-5 w-5"
          />
        </div>
        <div class="py-0.5 line-clamp-1 overflow-ellipsis">{{ props.title }}</div>
      </div>
    </UCard>
    <UCard
      v-else
      class="w-full text-slate-100 dark:text-slate-900 inline-flex leading-8 line-clamp-1 overflow-ellipsis bg-red-600 dark:bg-red-400"
      :ui="{body:'px-1 py-0 sm:px-1 sm:py-0'}"
    >
      <div class="flex gap-2">
        <div class="h-8 pl-1 py-1.5">
          <UIcon
            name="i-heroicons-clock-16-solid"
            class="h-5 w-5"
          />
        </div>
        <div class="py-0.5">{{ props.title }}</div>
      </div>
    </UCard>
  </div>
</template>
