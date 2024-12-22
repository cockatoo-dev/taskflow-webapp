<script setup lang="ts">
  defineProps<{
    text: string,
    lineClass?: string
  }>()
</script>

<template>
  <p
    v-for="line in $props.text.split('\n')"
    :key="line"
    :class="lineClass || ''"
  >
    {{ line }}
  </p>
</template>