<script setup lang="ts">
  const isVisible = defineModel<boolean>()
  const props = defineProps<{
    title: string,
    description: string,
    refresh: () => void
  }>()

  const route = useRoute()

  const editTitle = ref('')
  const editDescription = ref('')
  const disableSubmit = ref(false)
  const errorMessage = ref('')

  watch(isVisible, () => {
    if (isVisible.value) {
      editTitle.value = props.title
      editDescription.value = props.description
      errorMessage.value = ''
      disableSubmit.value = false
    }
  })

  const submitForm = async () => {
    if (editTitle.value == '') {
      errorMessage.value = 'Please enter a task title.'
      return
    } else if (editTitle.value.length > 50) {
      errorMessage.value = 'Task ttitle is too long (maximum 50 characters).'
      return
    } else if (editDescription.value.length > 2500) {
      errorMessage.value = 'Task description is too long (maximum 2500 characters).'
      return
    }
    
    disableSubmit.value = true
    try {
      await $fetch('/api/task/edit', {
        method: 'POST',
        body: {
          boardId: route.params.boardId,
          taskId: route.query.taskId,
          title: editTitle.value,
          description: editDescription.value
        }
      })
      await props.refresh()
      isVisible.value = false
    } catch (e) {
      disableSubmit.value = false
      fetchErrorHandler(e, errorMessage)
    }
  }
</script>

<template>
  <LargeModal v-model="isVisible">
    <div class="w-full p-4">
      <h3 class="text-3xl font-bold pb-2">Edit Task Details</h3>
      <form @submit.prevent="submitForm">
        <div class="pb-2">
          <label for="edit-title" class="block pb-2 font-bold">Title</label>
          <UInput 
            id="edit-title"
            v-model="editTitle" 
            required
            autocomplete="off"
            class="block w-full"
            size="lg"
            :ui="TEXT_INPUT_UI_OBJECT"
          />
          <CharLimit :str="editTitle" :limit="50" :show-length="40" />
        </div>
        <div class="pb-2">
          <label for="edit-description" class="block pb-2 font-bold">Description</label>
          <UTextarea
            id="edit-description"
            v-model="editDescription" 
            autocomplete="off"
            class="block w-full"
            :ui="TEXT_INPUT_UI_OBJECT"
          />
          <CharLimit :str="editDescription" :limit="2500" :show-length="2250" />
        </div>
        <div class="flex gap-4">
          <div>
            <UButton 
              type="submit"
              label="Save Changes"
              icon="i-heroicons-document-check-16-solid"
              :loading="disableSubmit"
              :ui="BUTTON_UI_OBJECT"
            />
          </div>
          <div>
            <UButton 
              type="button"
              label="Cancel"
              color="red"
              variant="ghost"
              icon="i-heroicons-x-mark-16-solid"
              :ui="BUTTON_UI_OBJECT"
              @click="() => {isVisible = false}"
            />
          </div>
        </div>
      </form>
      <FormError :message="errorMessage" />
    </div>
  </LargeModal>
</template>
