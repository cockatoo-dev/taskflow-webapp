<script setup lang="ts">
  import { FetchError } from 'ofetch'
  
  useHead({
    title: 'Taskflow'
  })
  useSeoMeta({
    title: 'Taskflow',
    ogTitle: 'Taskflow',
    description: 'Task tracking for keeping your team coordinated.',
    ogDescription: 'Task tracking for keeping your team coordinated.'
  })

  const showCreate = ref(false)
  const boardId = ref('')
  const errorMessage = ref('')

  const submitForm = async () => {
    if (boardId.value.length !== 8) {
      errorMessage.value = 'This board does not exist.'
      return
    } 
    try {
      await $fetch('/api/board/info', {
        method: 'get',
        query: {
          boardId: boardId.value.toLowerCase()
        }
      })
      navigateTo(`/board/${boardId.value.toLowerCase()}`)
    } catch (e) {
      if (e instanceof FetchError) {
        if (e.statusCode === 400) {
          errorMessage.value = 'This board does not exist.'
        }
      }
    }
  }
</script>

<template>
  <div>
    <NavBar />
    <CreateBoardModal v-model="showCreate" />
    <main class="w-full bg-teal-50 dark:bg-teal-950">
      <StdContainer>
        <div class="py-8 sm:py-16">
          <h1 class="text-3xl sm:text-6xl sm:leading-[1.25] font-bold text-center">
            Task tracking for
            <br>
            <span class="text-teal-600 dark:text-teal-400">keeping your team coordinated.</span>
          </h1>
          <p class="pt-4 sm:pt-8 sm:text-2xl text-center">Taskflow is a web app for keeping track of tasks, helping you to keep your team coordinated and reach your goals.</p>
        </div>
        <div class="w-full px-4 py-4 bg-white dark:bg-black rounded-xl shadow-xl">
          <form class="block w-full mx-auto" @submit.prevent="submitForm">
            <div class="grid grid-cols-[1fr_auto]">
              <div class="pr-2">
                <label for="homepage-board" class="sr-only">Enter board code</label>
                <UInput 
                  id="homepage-board"
                  v-model="boardId"
                  placeholder="Enter board code..."
                  class="block w-full"
                  :ui="TEXT_INPUT_UI_OBJECT"
                />
              </div>
              <div>
                <div class="block sm:hidden">
                  <UButton 
                    type="submit"
                    label="Open"
                    icon="i-heroicons-arrow-right-16-solid"
                    :ui="BUTTON_UI_OBJECT"
                  />
                </div>
                <div class="hidden sm:block">
                  <UButton 
                    type="submit"
                    label="Open Board"
                    icon="i-heroicons-arrow-right-16-solid"
                    :ui="BUTTON_UI_OBJECT"
                  />
                </div>
              </div>
            </div>
            <FormError :message="errorMessage" />
          </form>
          <div class="pt-2 max-w-[720px] mx-auto">
            <div class="text-center pb-2">or</div>
            <div class="text-center">
              <UButton 
                type="button"
                label="Create New Board"
                icon="i-heroicons-plus-16-solid"
                variant="ghost"
                :ui="BUTTON_UI_OBJECT"
                @click="() => {showCreate = true}"
              />
            </div>
          </div>
        </div>
        <div class="py-8">
          <p>Taskflow is a web app for keeping track of tasks that you and your team need to complete in order to meet your goals.</p>
          <p>
            Check our the project's 
            <a 
              class="text-teal-600 dark:text-teal-400 hover:underline" 
              href='https://github.com/max8539/taskflow'
              target="_blank"
              rel="noreferrer noopener"
            >
              Github page.
            </a>
            Got a suggestion? Head over to the 
            <a 
              class="text-teal-600 dark:text-teal-400 hover:underline" 
              href='https://github.com/max8539/taskflow/issues'
              target="_blank"
              rel="noreferrer noopener"
            >
              issues page.
            </a>
          </p>
        </div>
      </StdContainer>
    </main>
  </div>
</template>
