<script setup lang="ts">
  const isVisible = defineModel<boolean>()
  const isMotionSafe = useMotionSafe()
</script>

<template>
  <UModal
    v-model:open="isVisible"
    :transition="isMotionSafe"
    :dismissible="false"
    class="dark:bg-black"
    title="This board does not exist."
    description="If you've reached this after clicking a link or scanning a QR code, the board may have been deleted.<"
  >
    <template #content>
      <div class="p-4">
        <div class="text-xl font-bold pb-2">This board does not exist.</div>
        <p>If you've reached this after clicking a link or scanning a QR code, the board may have been deleted.</p>
        <div class="block pt-2 text-center">
          <UButton 
            label="Back to Homepage"
            icon="i-heroicons-home-16-solid"
            :class="BUTTON_SOLID_CLASS"
            to="/"
          >
            Back to Homepage
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>