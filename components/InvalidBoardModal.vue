<script setup lang="ts">
  const isVisible = defineModel<boolean>()
</script>

<template>
  <UModal v-model="isVisible" prevent-close :ui="{background: 'dark:bg-black'}">
    <div class="p-4">
      <h1 class="text-xl font-bold pb-2">This board does not exist.</h1>
      <p>If you've reached this after clicking a link or scanning a QR code, you may want to double check that you clicked the correct link or scanned the correct QR code.</p>
      <div class="block pt-2 text-center">
        <UButton 
          label="Back to Homepage"
          icon="i-heroicons-home-16-solid"
          :ui="BUTTON_UI_OBJECT"
          to="/"
        />
      </div>
    </div>
  </UModal>
</template>