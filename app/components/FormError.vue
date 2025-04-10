<script setup lang="ts">
  defineProps<{
    message: string
  }>()
</script>

<template>
  <div v-if="message" class="pt-2">
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
</template>
