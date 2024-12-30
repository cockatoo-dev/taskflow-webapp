<script setup lang="ts">
  const isVisible = defineModel<boolean>()
  const noAnimate = useMediaQuery('(prefers-reduced-motion)')
</script>

<template>
  <UModal
    v-model="isVisible"
    :transition="!noAnimate"
    :ui="{
      container: 'items-center',
      width: 'w-11/12 lg:w-[960px] sm:max-w-full'
    }"
  >
    <div class="text-slate-800 dark:text-slate-200">
      <slot />
    </div>
  </UModal>
</template>
