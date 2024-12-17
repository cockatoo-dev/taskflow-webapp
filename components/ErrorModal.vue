<script setup lang="ts">
  const isOpen = defineModel<boolean>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props = defineProps<{
    message: string
  }>()
</script>

<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ body: { padding: 'p-4 sm:p-4' } }">
      <div class="grid grid-cols-[1fr_auto]">
        <h3 class="text-xl font-bold text-red-500 dark:text-red-400">
          Error
        </h3>
        <div>
          <UButton 
            color="red"
            label="Close"
            icon="i-heroicons-x-mark-16-solid"
            @click="() => {isOpen = false}"
          />
        </div>
      </div>
      <p class="text-sm text-black dark:text-white">
        {{ $props.message }}
      </p>
    </UCard>
  </UModal>
</template>