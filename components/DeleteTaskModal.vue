<script setup lang="ts">
  import type { LocationQueryValue } from 'vue-router';
  const { $csrfFetch } = useNuxtApp()

  const isVisible = defineModel<boolean>()

  const props = defineProps<{
    taskId: LocationQueryValue | LocationQueryValue[],
    taskName: string
  }>()

  const route = useRoute()
  const isMotionSafe = useMotionSafe()

  const errorMessage = ref('')
  const deleteLoading = ref(false)

  const deleteTask = async () => {
    deleteLoading.value = true
    try {
      await $csrfFetch('/api/task/delete', {
        method: 'post',
        body: {
          boardId: route.params.boardId,
          taskId: props.taskId
        }
      })
      navigateTo(`/board/${route.params.boardId}`)
    } catch (e) {
      deleteLoading.value = false
      fetchErrorHandler(e, errorMessage)
    }
  }

  watch(isVisible, () => {
    if (isVisible.value) {
      deleteLoading.value = false
      errorMessage.value = ''
    }
    
  })
</script>

<template>
  <UModal v-model="isVisible" :transition="isMotionSafe" :ui="{background: 'dark:bg-black'}">
    <div class="p-4">
      <h3 class="text-xl font-bold pb-2">Delete '{{ taskName }}'?</h3>
      <p>You are about to delete this task. Other tasks will be updated to no longer depend on this task. This cannot be undone.</p>
      <div class="flex gap-2 sm:gap-4 pt-2">
        <div>
          <UButton 
            label="Delete Task"
            icon="i-heroicons-trash-16-solid"
            color="red"
            :ui="BUTTON_UI_OBJECT"
            :loading="deleteLoading"
            @click="deleteTask"
          />
        </div>
        <div>
          <UButton 
            icon="i-heroicons-x-mark-16-solid"
            label="Cancel"
            variant="ghost"
            :ui="BUTTON_UI_OBJECT"
            @click="() => {isVisible = false}"
          />
        </div>
      </div>
      <FormError :message="errorMessage" />
    </div>
  </UModal>
</template>
