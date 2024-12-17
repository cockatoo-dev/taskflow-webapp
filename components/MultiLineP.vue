<script setup lang="ts">
  const props = defineProps<{
    text: string,
    class?: string
  }>()
</script>

<template>
  <p
    v-for="line in $props.text.split('\n')"
    :key="line"
    :class="props.class || ''"
  >
    {{ line }}
  </p>
</template>