<!-- Task status card component, used on the task page -->
<script setup lang="ts">
  defineProps<{
    isComplete: boolean,
    numDeps: number
  }>()
</script>

<template>
  <div>
    <UCard
      v-if="isComplete"
      :ui="{body: 'p-2 sm:p-2 lg:p-2'}"
      class="bg-green-600 dark:bg-green-400 text-slate-100 dark:text-slate-900"
    >
      <div class="flex gap-2">
        <div>
          <UIcon name="heroicons:check-circle-16-solid" class="h-5 w-5" />
        </div>
        <div class="text-sm font-bold tracking-wider">
          COMPLETED
        </div>
      </div>
      <p>This task has been completed. Great Job!</p>
    </UCard>
    <UCard
      v-else-if="numDeps <= 0"
      :ui="{body: 'p-2 sm:p-2 lg:p-2'}"
      class="bg-blue-600 dark:bg-blue-400 text-slate-100 dark:text-slate-900"
    >
      <div class="flex gap-2">
        <div>
          <UIcon name="heroicons:play-circle-16-solid" class="h-5 w-5" />
        </div>
        <div class="text-sm font-bold tracking-wider">
          READY
        </div>
      </div>
      <p>This task is ready to be completed. Time to get to work!</p>
    </UCard>
    <UCard
      v-else
      :ui="{body: 'p-2 sm:p-2 lg:p-2'}"
      class="bg-red-600 dark:bg-red-400 text-slate-100 dark:text-slate-900"
    >
      <div class="flex gap-2">
        <div>
          <UIcon name="heroicons:clock-16-solid" class="h-5 w-5" />
        </div>
        <div class="text-sm font-bold tracking-wider">
          NOT READY
        </div>
      </div>
      <p>
        This task is not ready to be completed. {{ `${numDeps} ${numDeps == 1 ? 'task' : 'tasks'}` }} depended on by this task {{ `${numDeps == 1 ? 'has' : 'have'}` }} not been completed yet.
      </p>
    </UCard>
  </div>
</template>