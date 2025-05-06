<!-- Task item componenent for homepage -->
<script setup lang="ts">
  defineProps<{
    title: string,
    status: 'completed' | 'ready' | 'not ready'
  }>()
</script>

<template>
  <div class="p-1">
    <UCard
      v-if="status === 'completed'"
      :ui="{body: 'p-2 sm:p-2 lg:p-2'}"
      class="bg-green-600 dark:bg-green-400 text-slate-100 dark:text-slate-900"
    >
      <div class="flex gap-2 leading-5">
        <div>
          <UIcon name="i-heroicons-check-circle-16-solid" class="h-5 w-5" />
        </div>
        <div class="text-sm font-bold tracking-wider line-clamp-1 overflow-hidden">COMPLETED</div>
      </div>

      <div
        class="line-clamp-1 overflow-ellipsis text-xl font-bold"
      >
        {{ title }}
      </div>
    </UCard>
    <UCard
      v-else-if="status === 'ready'"
      :ui="{body: 'p-2 sm:p-2 lg:p-2'}"
      class="bg-blue-600 dark:bg-blue-400 text-slate-100 dark:text-slate-900"
    >
      <div class="flex gap-2 leading-5">
        <div>
          <UIcon name="i-heroicons-play-circle-16-solid" class="h-5 w-5" />
        </div>
        <div class="text-sm font-bold tracking-wider line-clamp-1 overflow-hidden">READY</div>
      </div>

      <div
        class="line-clamp-1 overflow-ellipsis text-xl font-bold"
      >
        {{ title }}
      </div>
    </UCard>
    <UCard
      v-else
      :ui="{body: 'p-2 sm:p-2 lg:p-2'}"
      class="bg-red-600 dark:bg-red-400 text-slate-100 dark:text-slate-900"
    >
      <div class="flex gap-2 leading-5">
        <div>
          <UIcon name="i-heroicons-clock-16-solid" class="h-5 w-5" />
        </div>
        <div class="text-sm font-bold tracking-wide line-clamp-1 overflow-hidden">NOT READY</div>
      </div>

      <div
        class="line-clamp-1 overflow-ellipsis text-xl font-bold"
      >
        {{ title }}
      </div>
    </UCard>
  </div>
</template>
