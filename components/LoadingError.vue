<script setup lang="ts">
  defineProps<{
    refresh: () => void
  }>()
</script>

<template>
  <div class="py-16">
    <h2 class="pb-2 text-xl text-center font-bold">Something went wrong while loading data.</h2>
    <div class="text-center">
      <UButton 
        type="button"
        label="Try Again"
        icon="i-heroicons-arrow-uturn-right-16-solid"
        :ui="BUTTON_UI_OBJECT"
        @click="refresh"
      />
    </div>
  </div>
</template>
