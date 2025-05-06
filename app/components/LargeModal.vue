<!-- Large modal component, modal has a larger width -->
<script setup lang="ts">
  defineProps<{
    title: string,
    description: string
  }>()
  const isVisible = defineModel<boolean>()
  const isMotionSafe = useMotionSafe()
</script>

<template>
  <UModal
    v-model:open="isVisible"
    :transition="isMotionSafe"
    class="w-11/12 sm:max-w-full lg:w-[960px]"
  >
    <template #content>
      <div class="text-slate-800 dark:text-slate-200">
        <slot />
      </div>
    </template>
  </UModal>
</template>
