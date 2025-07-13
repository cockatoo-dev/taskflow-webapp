<!-- Form error message component -->
<script setup lang="ts">
  const props = defineProps<{
    message: string
  }>()

  const isApiDisabledError = computed(() => {
    return props.message === 'The API is temporarily disabled. Please try again later.'
  })
</script>

<template>
  <div v-if="message" class="pt-2">
    <div v-if="isApiDisabledError">
      <UAlert 
        title="Error"
        variant="subtle"
        color="error"
        :ui="{
          title: 'text-base font-bold text-slate-800 dark:text-slate-200',
          description: 'text-base font-normal text-slate-800 dark:text-slate-200'
        }"
      >
        <template #description>
          <p class="pb-1">{{ message }}</p>
          <p class="pb-1">
            We are preparing to close down the old website for Taskflow. You may need to use the new website for Taskflow to complete this action.
            <a href="https://taskflow.cockatoo-dev.workers.dev" class="text-teal-600 dark:text-teal-400 hover:underline">
              Click here to go to the new website for Taskflow.
            </a>
          </p>
        </template>
      </UAlert>
    </div>
    <div v-else>
      <UAlert 
        title="Error"
        :description="message"
        variant="subtle"
        color="error"
        :ui="{
          title: 'text-base font-bold text-slate-800 dark:text-slate-200',
          description: 'text-base font-normal text-slate-800 dark:text-slate-200'
        }"
      />
    </div>
  </div>
</template>
