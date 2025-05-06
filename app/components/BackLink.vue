<!-- Back link button -->
<script setup lang="ts">
  const props = defineProps<{
    boardId?: string | string[]
  }>()

  // Generate link to either the home page or the board page
  const link = computed(() => {
    if (!props.boardId) {
      return "/"
    } else {
      return `/board/${props.boardId}`
    }
  })
</script>

<template>
  <UButton
    :to="link"
    variant="ghost"
    icon="i-heroicons-arrow-left-16-solid"
    :class="BUTTON_GHOST_CLASS"
  >
    Back
  </UButton>
</template>
