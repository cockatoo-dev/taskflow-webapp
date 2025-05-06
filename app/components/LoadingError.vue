<!-- Loading error component, used on all pages that load data -->
<script setup lang="ts">
  defineProps<{
    refresh: () => void
  }>()
</script>

<template>
  <div class="py-16">
    <h1 class="pb-2 text-xl text-center font-bold">Something went wrong while loading data.</h1>
    <div class="text-center">
      <UButton 
        type="button"
        icon="i-heroicons-arrow-uturn-right-16-solid"
        :class="BUTTON_SOLID_CLASS"
        @click="refresh"
      >
        Try Again
      </UButton>
    </div>
  </div>
</template>
