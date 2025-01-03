<script setup lang="ts">
  import { FetchError } from 'ofetch'
  
  useHead({
    title: 'Taskflow'
  })
  useSeoMeta({
    title: 'Taskflow',
    ogTitle: 'Taskflow',
    description: 'Helping keep your team coordinated to meet your goals!',
    ogDescription: 'Helping keep your team coordinated to meet your goals!'
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
    <StdContainer>
      <main class="w-full">
        <div class="py-12 sm:py-24">
          <h1 class="text-4xl sm:text-6xl font-bold text-center text-teal-500">Taskflow</h1>
        </div>
        <form class="block w-full max-w-[720px] mx-auto" @submit.prevent="submitForm">
          <div class="grid grid-cols-[1fr_auto]">
            <div class="pr-2">
              <label for="homepage-board" class="hidden">Enter board code</label>
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
                  label="Go"
                  icon="i-heroicons-arrow-right-16-solid"
                  :ui="BUTTON_UI_OBJECT"
                />
              </div>
              <div class="hidden sm:block">
                <UButton 
                  type="submit"
                  label="Go to Board"
                  icon="i-heroicons-arrow-right-16-solid"
                  :ui="BUTTON_UI_OBJECT"
                />
              </div>
            </div>
          </div>
          <FormError :message="errorMessage" />
        </form>
        <div class="pt-2 pb-8 max-w-[720px] mx-auto">
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
      </main>
    </StdContainer>
  </div>
</template>
