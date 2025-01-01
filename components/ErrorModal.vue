<script setup lang="ts">
  const isVisible = defineModel<boolean>()
  const noAnimate = useMediaQuery('(prefers-reduced-motion)')
  defineProps<{
    message: string
  }>()
</script>

<template>
  <UModal v-model="isVisible" :transition="!noAnimate" :ui="{background: 'dark:bg-black'}">
    <UCard :ui="{ body: { padding: 'p-4 sm:p-4' } }">
      <div class="grid grid-cols-[1fr_auto]">
        <h3 class="text-xl font-bold text-red-600 dark:text-red-400">
          Error
        </h3>
        <div>
          <UButton 
            color="red"
            label="Close"
            variant="ghost"
            icon="i-heroicons-x-mark-16-solid"
            :ui="BUTTON_UI_OBJECT"
            @click="() => {isVisible = false}"
          />
        </div>
      </div>
      <p class="text-sm">
        {{ $props.message }}
      </p>
    </UCard>
  </UModal>
</template>
