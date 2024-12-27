<script setup lang="ts">
  import { FetchError } from 'ofetch'

  const isVisible = defineModel<boolean>()
  const props = defineProps<{
    boardId: string | string[]
  }>()

  const title = ref('')
  const description = ref('')
  const disableSubmit = ref(false)
  const errorMessage = ref('')

  const submitForm = async () => {
    disableSubmit.value = true
    if (title.value == '') {
      errorMessage.value = 'Please enter a task title.'
      disableSubmit.value = false
      return
    } else if (title.value.length > 25) {
      errorMessage.value = 'Task ttitle is too long.'
      disableSubmit.value = false
      return
    } else if (description.value.length > 2500) {
      errorMessage.value = 'Task description is too long.'
      disableSubmit.value = false
      return
    }
    
    try {
      const result = await $fetch('/api/task/add', {
        method: 'POST',
        body: {
          boardId: props.boardId,
          title: title.value,
          description: description.value
        }
      })
      disableSubmit.value = false
      navigateTo(`/board/${props.boardId}/task?taskId=${result.taskId}`)
    } catch (err) {
      disableSubmit.value = false
      if (err instanceof FetchError) {
        errorMessage.value = err.message
      }
    }
  }
</script>

<template>
  <LargeModal v-model="isVisible">
    <div class="w-full p-4">
      <h3 class="text-3xl font-bold pb-2">Add New Task</h3>
      <form @submit.prevent="submitForm">
        <div class="pb-2">
          <label for="add-title" class="block pb-2 font-bold">Title (required)</label>
          <UInput 
            id="add-title"
            v-model="title" 
            required
            autocomplete="off"
            class="block w-full text-base"
            :ui="{size:{sm:'text-base'}}"
          />
          <CharLimit :str="title" :limit="25" :show-length="15" />
        </div>
        <div class="pb-2">
          <label for="add-title" class="block pb-2 font-bold">Description</label>
          <UTextarea
            id="add-title"
            v-model="description" 
            autocomplete="off"
            class="block w-full text-base"
            :ui="{size:{sm:'text-base'}}"
          />
          <CharLimit :str="description" :limit="2500" :show-length="2250" />
        </div>
        <div class="flex gap-4">
          <div>
            <UButton 
              type="submit"
              label="Add Task"
              icon="i-heroicons-document-plus-16-solid"
              class="text-base font-bold"
            />
          </div>
          <div>
            <UButton 
              type="button"
              label="Cancel"
              color="red"
              variant="ghost"
              icon="i-heroicons-x-mark-16-solid"
              class="text-base"
              @click="() => {isVisible = false}"
            />
          </div>
        </div>
      </form>
      <FormError :message="errorMessage" />
    </div>
  </LargeModal>
</template>