<script setup lang="ts">
  const { $csrfFetch } = useNuxtApp()
  
  const isVisible = defineModel<boolean>()

  const props = defineProps<{
    boardId: string,
    title: string,
    refresh: () => void
  }>()

  const isMotionSafe = useMotionSafe()

  const errorMessage = ref('')
  const deleteLoading = ref(false)

  const deleteBoard = async () => {
    deleteLoading.value = true
    try {
      await $csrfFetch('/api/board/delete', {
        method: 'post',
        body: {
          boardId: props.boardId
        }
      })
      props.refresh()
      isVisible.value = false
    } catch (e) {
      deleteLoading.value = false
      fetchErrorHandler(e, errorMessage)
    }
  }

  watch(isVisible, () => {
    if (isVisible.value) {
      errorMessage.value = ''
      deleteLoading.value = false
    }
  })
</script>

<template>
  <UModal v-model="isVisible" :transition="isMotionSafe" :ui="{background: 'dark:bg-black'}">
    <div class="p-4">
      <h3 class="text-xl font-bold pb-2">Delete '{{ title }}'?</h3>
      <p>
        You are about to delete this board. All tasks on this board will be deleted. People will no longer be able to access this board. This cannot be undone.
      </p>
      <div class="flex gap-2 sm:gap-4 pt-2">
        <div>
          <UButton 
            label="Delete Board"
            icon="i-heroicons-trash-16-solid"
            color="red"
            :ui="BUTTON_UI_OBJECT"
            :loading="deleteLoading"
            @click="deleteBoard"
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
