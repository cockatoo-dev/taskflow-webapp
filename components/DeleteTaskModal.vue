<script setup lang="ts">
  const isVisible = defineModel<boolean>()
  const noAnimate = useMediaQuery('(prefers-reduced-motion)')

  const route = useRoute()

  const errorMessage = ref('')
  const deleteLoading = ref(false)

  const deleteTask = async () => {
    deleteLoading.value = true
    try {
      await $fetch('/api/task/delete', {
        method: 'post',
        body: {
          boardId: route.params.boardId,
          taskId: route.query.taskId
        }
      })
      navigateTo(`/board/${route.params.boardId}`)
    } catch (err) {
      deleteLoading.value = false
      if (err instanceof Error) {
        errorMessage.value = err.message
      }
    }
  }

  watch(isVisible, () => {
    deleteLoading.value = false
  })
</script>

<template>
  <UModal v-model="isVisible" :transition="!noAnimate">
    <div class="p-4">
      <h3 class="text-xl font-bold pb-2">Delete Task?</h3>
      <p>You are about to delete this task. Other tasks will be updated to no longer depend on this task. This cannot be undone.</p>
      <div class="block sm:hidden pt-1">
        <UButton 
          label="Delete Task"
          icon="i-heroicons-trash-16-solid"
          color="red"
          class="w-full justify-center"
          :ui="BUTTON_UI_OBJECT"
          @click="deleteTask"
        />
      </div>
      <div class="block sm:hidden pt-1">
        <UButton 
          icon="i-heroicons-x-mark-16-solid"
          label="Cancel"
          variant="ghost"
          class="w-full justify-center"
          :ui="BUTTON_UI_OBJECT"
          @click="() => {isVisible = false}"
        />
      </div>
      <div class="hidden sm:flex gap-4 justify-center pt-2">
        <div>
          <UButton 
            label="Delete Task"
            icon="i-heroicons-trash-16-solid"
            color="red"
            :ui="BUTTON_UI_OBJECT"
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
