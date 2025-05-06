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
    class="motion-safe:transition-opacity duration-300 text-xs text-right"
    :class="str.length >= showLength ? 'opacity-100' : 'opacity-0'"
  >
    <span 
      class="motion-safe:transition-colors duration-300"
      :class="str.length > limit ? 'text-red-600 dark:text-red-400' : ''"
    >
      {{ str.length }}/{{ limit }}
    </span>
  </div>
</template>
