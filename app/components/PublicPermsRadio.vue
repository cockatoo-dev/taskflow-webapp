<script setup lang="ts">
  const value = defineModel<number>({default: 1})
</script>

<template>
  <URadioGroup 
    v-model="value"
    legend="Public Permissions"
    :options="[
      { value: 0, label: 'Visitors can only view tasks.' },
      { value: 1, label: 'Visitors can mark tasks as complete.'},
      { value: 2, label: 'Visitors can add, modify and delete tasks. They can also mark tasks as complete.'}
    ]"
    :ui="{legend: 'mb-0 pb-2 text-base font-bold text-slate-800 dark:text-slate-200'}"
    :ui-radio="{container: 'h-6', base: 'h-5 w-5 pt-1', wrapper: 'pb-1 gap-2', inner:'ms-0', label:'text-base text-slate-800 dark:text-slate-200'}"
  />
</template>
