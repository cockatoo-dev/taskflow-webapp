<script setup lang="ts">
  const route = useRoute()
  
  const title = ref('')
  const description = ref('')
  const disableSubmit = ref(false)

  const showError = ref(false)
  const errorMessage = ref('')
  
  const submitForm = async () => {
    disableSubmit.value = true
    if (title.value == '') {
      errorMessage.value = 'Please enter a task title.'
      showError.value = true
      disableSubmit.value = false
      return
    } else if (title.value.length > 25) {
      errorMessage.value = 'Task ttitle is too long.'
      showError.value = true
      disableSubmit.value = false
      return
    } else if (description.value.length > 2500) {
      errorMessage.value = 'Task description is too long.'
      showError.value = true
      disableSubmit.value = false
      return
    }
    
    try {
      const result = await $fetch('/api/task/add', {
      method: 'POST',
      body: {
        boardId: route.params.boardId,
        title: title.value,
        description: description.value
      }
    })
    
      disableSubmit.value = false
      navigateTo(`/${route.params.boardId}/task?taskId=${result.taskId}`)
    } catch (err) {
      disableSubmit.value = false
      if (err instanceof Error) {
        errorMessage.value = err.message
        showError.value = true
      }
    }
    
  }
</script>

<template>
  <StdContainer>
    <BackLink />
    <h2 class=" py-4 text-4xl font-bold">
      New Task
    </h2>
    <form>
      <div>
        <label
          for="new-title"
          class="block pt-2 font-bold"
        >
          Title (required)
        </label>
        <UInput 
          id="new-title"
          v-model="title"
          required
          autocomplete="off"
          placeholder="Enter a task title here..."
          class="font-bold"
        />
        <p
          class=" h-4 text-right text-xs"
          :class="title.length > 25 ? 'text-red-700 dark:text-red-300' : ''"
        >
          {{ title.length }}/25
        </p>
      </div>
      
      <div>
        <label
          for="new-description"
          class="block pt-2 font-bold"
        >
          Description
        </label>
        <UTextarea 
          id="new-description"
          v-model="description"
          :rows="4"
          autocomplete="off"
          placeholder="Enter a task description here..."
        />
        <p
          class=" h-4 text-right text-xs"
          :class="description.length > 2500 ? 'text-red-700 dark:text-red-300' : ''"
        >
          <span v-if="description.length >= 2250">{{ description.length }}/2500</span>
        </p>
      </div>

      <div class="text-center">
        <UButton 
          type="submit"
          label="Create Task"
          icon="i-heroicons-document-plus-16-solid"
          class="font-bold mr-1"
          @click.prevent="submitForm"
        />
      </div> 

      <ErrorModal 
        v-model="showError"
        :message="errorMessage"
      />
    </form>
    <p class="pt-4 text-sm ">
      Dependencies for this task can be added after the task is created.
    </p>
  </StdContainer>
</template>