<script setup lang="ts">
  import type { LocationQueryValue } from 'vue-router';
  const { $csrfFetch } = useNuxtApp()

  const isVisible = defineModel<boolean>()

  const props = defineProps<{
    taskId: LocationQueryValue | LocationQueryValue[],
    taskName: string
  }>()

  const route = useRoute()

  const errorMessage = ref('')
  const deleteLoading = ref(false)

  // Delete task and navigate to the board page
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

  // Clear error message and loading state when the modal is opened
  watch(isVisible, () => {
    if (isVisible.value) {
      deleteLoading.value = false
      errorMessage.value = ''
    }
    
  })
</script>

<template>
  <SmallModal 
    v-model="isVisible" 
    :title="`Delete ${taskName}?`"
    description="Are you sure you want to delete this task?"
  >
  <div class="p-4">
      <h3 class="text-xl font-bold pb-2">Delete '{{ taskName }}'?</h3>
      <p>You are about to delete this task. Other tasks will be updated to no longer depend on this task. This cannot be undone.</p>
      <div class="flex gap-2 sm:gap-4 pt-2">
        <div>
          <UButton 
            icon="heroicons:trash-16-solid"
            color="error"
            :class="BUTTON_SOLID_CLASS"
            :loading="deleteLoading"
            @click="deleteTask"
          >
            Delete Task
          </UButton>
        </div>
        <div>
          <UButton 
            icon="heroicons:x-mark-16-solid"
            color="neutral"
            variant="ghost"
            :class="BUTTON_GHOST_CLASS"
            @click="() => {isVisible = false}"
          >
            Cancel
          </UButton>
        </div>
      </div>
      <FormError :message="errorMessage" />
    </div>
  </SmallModal>
</template>
