<script setup lang="ts">
  defineProps<{
    message: string
  }>()
</script>

<template>
  <div v-if="message" class="pt-2 text-slate-800 dark:text-slate-200">
    <UCard 
      class="rounded-md drop-shadow-md bg-red-200 dark:bg-red-800 border-2 border-red-500"
      :ui="{body:{padding: 'p-2 sm:p-2'}}"
    >
      <div class="font-bold pb-1">Error</div>
      <p>
        {{ message }}
      </p>
    </UCard>
  </div>
  
</template>
