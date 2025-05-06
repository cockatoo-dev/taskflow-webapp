<!-- Public permissions selection component for forms -->
<script setup lang="ts">
  const value = defineModel<string>({default: "1"})
</script>

<template>
  <URadioGroup 
    v-model="value"
    legend="Public Permissions"
    :items="[
      { value: '0', label: 'Visitors can only view tasks.' },
      { value: '1', label: 'Visitors can mark tasks as complete.'},
      { value: '2', label: 'Visitors can add, modify and delete tasks. They can also mark tasks as complete.'}
    ]"
    :ui="{
      legend: 'mb-0 pb-2 text-base font-bold text-slate-800 dark:text-slate-200',
      item: 'text-base font-normal',
      base: 'h-5 w-5', indicator: 'h-5 w-5', container: 'h-5 w-5 pt-1'
    }"
  />
</template>
