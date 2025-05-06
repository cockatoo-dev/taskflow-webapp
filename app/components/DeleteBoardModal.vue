<script setup lang="ts">
  const { $csrfFetch } = useNuxtApp()
  
  const isVisible = defineModel<boolean>()

  const props = defineProps<{
    boardId: string,
    title: string,
    refresh: () => Promise<void>
  }>()

  const errorMessage = ref('')
  const deleteLoading = ref(false)

  // Delete board and refresh the board list
  const deleteBoard = async () => {
    deleteLoading.value = true
    try {
      await $csrfFetch('/api/board/delete', {
        method: 'post',
        body: {
          boardId: props.boardId
        }
      })
      await props.refresh()
      isVisible.value = false
    } catch (e) {
      deleteLoading.value = false
      fetchErrorHandler(e, errorMessage)
    }
  }

  // Clear error message and loading state when the modal is opened
  watch(isVisible, () => {
    if (isVisible.value) {
      errorMessage.value = ''
      deleteLoading.value = false
    }
  })
</script>

<template>
  <SmallModal
    v-model="isVisible"
    :title="`Delete ${title}?`"
    description="Are you sure you want to delete this board?"
  >
  <div class="p-4">
      <div class="text-xl font-bold pb-2">Delete '{{ title }}'?</div>
      <p>
        You are about to delete this board. All tasks on this board will be deleted. People will no longer be able to access this board. This cannot be undone.
      </p>
      <div class="flex gap-2 sm:gap-4 pt-2">
        <div>
          <UButton 
            icon="i-heroicons-trash-16-solid"
            color="error"
            :class="BUTTON_SOLID_CLASS"
            :loading="deleteLoading"
            loading-icon="i-heroicons-arrow-path-16-solid"
            @click="deleteBoard"
          >
            Delete Board
          </UButton>
        </div>
        <div>
          <UButton 
            icon="i-heroicons-x-mark-16-solid"
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
