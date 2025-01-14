<script setup lang="ts">
  const isVisible = defineModel<boolean>()
  const isMotionSafe = useMotionSafe()
</script>

<template>
  <UModal
    v-model="isVisible"
    :transition="isMotionSafe"
    :ui="{
      container: 'items-center',
      width: 'w-11/12 lg:w-[960px] sm:max-w-full',
      background: 'dark:bg-black'
    }"
  >
    <div class="text-slate-800 dark:text-slate-200">
      <slot />
    </div>
  </UModal>
</template>
