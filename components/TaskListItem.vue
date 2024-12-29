<script setup lang="ts">
  const props = defineProps<{
    boardId: string,
    taskId: string,
    title: string,
    description: string,
    isComplete: boolean,
    numDeps: number
  }>()

  const isMouseOver = ref(false)
</script>

<template>
  <NuxtLink 
    :to="`/board/${boardId}/task?taskId=${taskId}`"
    @mouseenter="() => {isMouseOver = true}"
    @mouseleave="() => {isMouseOver = false}"
  >
    <UCard
      v-if="isComplete"
      :ui="{ body: { padding: 'p-2 sm:p-2 lg:p-4' } }"
      class="bg-green-600 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-300 text-slate-100 dark:text-slate-900"
    >
      <div class="flex gap-2 leading-5">
        <div>
          <UIcon name="i-heroicons-check-circle-16-solid" class="h-5 w-5" />
        </div>
        <div class="text-sm font-bold tracking-wider">COMPLETE</div>
      </div>

      <h3
        class="line-clamp-1 overflow-ellipsis text-2xl font-bold"
        :class="isMouseOver ? 'underline' : ''"
        :title="$props.title"
      >
        {{ props.title }}
      </h3>
      <p class="h-10 lg:h-20 line-clamp-2 lg:line-clamp-4 overflow-ellipsis">
        {{ props.description }}
      </p>
    </UCard>
    <UCard
      v-else-if="numDeps <= 0"
      :ui="{ body: { padding: 'p-2 sm:p-2 lg:p-4' } }"
      class="bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-slate-100 dark:text-slate-900"
    >
      <div class="flex gap-2 leading-5">
        <div>
          <UIcon name="i-heroicons-play-circle-16-solid" class="h-5 w-5" />
        </div>
        <div class="text-sm font-bold tracking-wider">READY</div>
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
    <UCard
      v-else
      :ui="{ body: { padding: 'p-2 sm:p-2 lg:p-4' } }"
      class="bg-red-600 dark:bg-red-400 hover:bg-red-700 dark:hover:bg-red-300 text-slate-100 dark:text-slate-900"
    >
      <div class="flex gap-2 leading-5">
        <div>
          <UIcon
            name="i-heroicons-clock-16-solid"
            class="h-5 w-5"
          />
        </div>
        <div class="text-sm font-bold tracking-wider">NOT READY</div>
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
