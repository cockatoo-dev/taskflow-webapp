<!-- Character limit display for text fields -->
<script setup lang="ts">
  defineProps<{
    str: string,
    limit: number,
    showLength: number
  }>()
</script>

<template>
  <div 
    class="motion-safe:transition text-xs text-right"
    :class="str.length >= showLength ? 'visible opacity-100' : 'invisible opacity-0'"
  >
    <span 
      class="motion-safe:transition-colors"
      :class="str.length > limit ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'"
    >
      {{ str.length }}/{{ limit }}
    </span>
  </div>
</template>
