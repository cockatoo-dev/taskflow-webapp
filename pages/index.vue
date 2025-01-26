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
  const joinLoading = ref(false)

  const submitForm = async () => {
    if (boardId.value.length !== 8) {
      errorMessage.value = 'This board does not exist.'
      return
    }
    joinLoading.value = true 
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
        if (e.statusCode === 400 && e.data.message === 'Invalid task ID.') {
          errorMessage.value = 'This board does not exist.'
        } else if (e.statusCode === 400) {
          errorMessage.value = e.data.message
        }
      }
    }
  }
</script>

<template>
  <div>
    <NavBar />
    <CreateBoardModal v-model="showCreate" />
    <main class="w-full min-h-[calc(100vh-9rem)] bg-teal-50 dark:bg-teal-950">
      <StdContainer>
        <div class="py-8 sm:py-16">
          <h1 class="text-3xl sm:text-6xl sm:leading-[1.25] font-bold text-center">
            Task tracking for
            <br>
            <span class="text-teal-600 dark:text-teal-400">keeping your team coordinated.</span>
          </h1>
          <p class="pt-4 sm:pt-8 sm:text-2xl text-center">Taskflow is a web app for keeping track of tasks, helping you to keep your team coordinated and reach your goals.</p>
        </div>
        <div class="w-full p-4 bg-white dark:bg-black rounded-xl shadow-xl">
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
        <div class="pt-16 pb-4 sm:grid sm:grid-cols-2">
          <div class="sm:order-1 sm:pr-2">
            <h2 class="text-xl sm:text-3xl font-bold">All of your team's tasks at a glance.</h2>
            <p class="py-2">Easily see all of your team's tasks on a virtual board, and know what tasks are left to complete. </p>
          </div>
          <div class="sm:order-2 sm:pl-2">
            <div class="w-full max-w-[488px] mx-auto grid grid-cols-2">
              <HomepageTaskItem title="Task 1" status="ready"/>
              <HomepageTaskItem title="Task 2" status="ready"/>
              <HomepageTaskItem title="Task 3" status="ready"/>
              <HomepageTaskItem title="Task 4" status="ready"/>
            </div>
          </div>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-2">
          <div class="sm:order-2 sm:pl-2">
            <h2 class="text-xl sm:text-3xl font-bold">Set tasks to be completed in a certain order.</h2>
            <p class="py-2">Set tasks that must be completed before other tasks are ready to be completed, and clearly see the tasks that can be completed right now.</p>
          </div>
          <div class="sm:order-1 sm:pr-2">
            <div class="w-full max-w-[488px] mx-auto grid grid-cols-2">
              <HomepageTaskItem title="Task 6" status="ready"/>
              <HomepageTaskItem title="Task 7" status="ready"/>
              <HomepageTaskItem title="Task 8" status="not ready"/>
              <HomepageTaskItem title="Task 5" status="completed"/>
            </div>
          </div>
        </div>
        <div class="pt-4 pb-8 sm:grid sm:grid-cols-2">
          <div class="sm:order-1 sm:pr-2">
            <h2 class="text-xl sm:text-3xl font-bold">Easily share your board with your team.</h2>
            <p class="py-2">Each board has a unique board code, along with a QR code and a shareable link, so your team members can easily open your board in their web browsers.</p>
          </div>
          <div class="sm:order-2 sm:pl-2">
            <div class="w-full max-w-[488px] mx-auto p-2 bg-white dark:bg-black rounded-md shadow-md">
              <div class="grid grid-cols-[70%_30%]">
                <div class="pl-2 flex flex-col justify-center border-r border-r-slate-300 dark:border-r-slate-700 text-3xl font-bold leading-snug">
                  Board code
                  <span class="text-teal-600 dark:text-teal-400">5f3759df</span>
                </div>
                <div>
                  <img src="/homepage-qrcode-light.webp" alt="Sample board sharing QR code" class="block dark:hidden w-full">
                  <img src="/homepage-qrcode-dark.webp" alt="Sample board sharing QR code" class="hidden dark:block w-full">
                </div>
              </div>
            </div>
          </div>
        </div>
      </StdContainer>
    </main>
    <footer class="w-full h-24 bg-teal-50 dark:bg-teal-950">
      <StdContainer>
        <div class="pt-4 border-t border-t-slate-300 dark:border-t-slate-700">
          <p>
            Taskflow | Check out the project's 
            <NuxtLink 
              class="text-teal-600 dark:text-teal-400 hover:underline" 
              href='https://github.com/max8539/taskflow'
              target="_blank"
            >
              Github page.
            </NuxtLink>
            Got a suggestion? Head over to the 
            <NuxtLink 
              class="text-teal-600 dark:text-teal-400 hover:underline" 
              href='https://github.com/max8539/taskflow/issues'
              target="_blank"
            >
              issues page.
            </NuxtLink>
          </p>
        </div>
      </StdContainer>
    </footer>
  </div>
</template>
