<!-- Create Board Modal, shown on the homepage and account page -->
<script setup lang="ts">
  const { $csrfFetch } = useNuxtApp()
  
  const isVisible = defineModel<boolean>()

  // Form state variables
  const title = ref("")
  const publicPerms = ref("1")
  const errorMessage = ref("")
  const disableSubmit = ref(false)

  // Form submission
  // Check if the title is valid, and if so,
  // send the data to the server, then navigate to the new board.
  const submitForm = async () => {
    if (title.value.length > 50) {
      errorMessage.value = "Board Name is too long (maximum 50 characters)."
      return
    }

    disableSubmit.value = true
    try {
      const { boardId } = await $csrfFetch("/api/board/create", {
        method: 'post',
        body: {
          title: title.value,
          publicPerms: Number(publicPerms.value)
        }
      })
      await navigateTo(`/board/${boardId}`)
    } catch (e) {
      disableSubmit.value = false
      fetchErrorHandler(e, errorMessage)
    }
  }

  // Reset form state when the modal is opened
  watch(isVisible, () => {
    if (isVisible.value) {
      title.value = ''
      publicPerms.value = "1"
      disableSubmit.value = false
      errorMessage.value = ''
    }
  })
</script>

<template>
  <AuthState v-slot="{loggedIn}">
    <template v-if="loggedIn">
      <LargeModal 
        v-model="isVisible"
        title="Create New Board"
        description="Fill in this form to create a new baord."
      >
        <div class="w-full p-4">
          <div class="text-3xl font-bold pb-2">Create New Board</div>
          <form @submit.prevent="submitForm">
            <div class="pb-2">
              <label for="create-name" class="block pb-2 font-bold">Board Name</label>
              <UInput 
                id="create-name"
                v-model="title" 
                required
                autocomplete="off"
                class="block w-full"
                :ui="TEXT_INPUT_UI"
              />
              <CharLimit :str="title" :limit="50" :show-length="40" />
            </div>
            <div class="pb-4">
              <PublicPermsRadio v-model="publicPerms" />
              <div class="pt-4 pb-1">Your board can be accessed by anyone with your board code or a link to your board.</div>
              <div class="py-1">You will always have full permissions for the boards that you create. Only you can change these settings or delete this board after it is created.</div>
            </div>
            <div class="flex gap-2">
              <div>
                <UButton 
                  type="submit"
                  :loading="disableSubmit"
                  icon="heroicons:plus-16-solid"
                  :class="BUTTON_SOLID_CLASS"
                >
                  Create Board
                </UButton>
              </div>
              <div>
                <UButton 
                  type="button"
                  color="neutral"
                  variant="ghost"
                  icon="heroicons:x-mark-16-solid"
                  :class="BUTTON_GHOST_CLASS"
                  @click="() => {isVisible = false}"
                >
                  Cancel
                </UButton>
              </div>
            </div>
          </form>
          <FormError :message="errorMessage" />
        </div>
      </LargeModal>
    </template>
    <template v-else>
      <SmallModal 
        v-model="isVisible"
        title="Log in to Taskflow"
        description="Log in to Taskflow with your Github account to create a board."
      >
        <div class="px-2 pt-2 text-right">
          <UButton 
            color="neutral"
            variant="ghost"
            icon="heroicons:x-mark-16-solid"
            :class="BUTTON_GHOST_CLASS"
            @click="() => {isVisible = false}"
          >
            Close
          </UButton>
        </div>
        <div class="px-4 pb-4">
          <div class="text-xl text-center font-bold">Log in to Taskflow with your Github account to create a board.</div>
          <div class="py-2 text-center">
            <UButton
              to="/api/account/login/github"
              icon="simple-icons:github"
              :class="GITHUB_BUTTON_CLASS"
              external
            >
              Log in with Github
            </UButton>
          </div>
          <div class="text-xs">
            When you log in with Github, you agree for a cookie to be saved to your web browser to store your login information for Taskflow. 
            Taskflow does not use cookies for any other purpose. Only your Github user ID and username is collected by Taskflow, which is used to associate your Github account with the boards you create.
          </div>
        </div>
      </SmallModal>
    </template>
  </AuthState>
</template>
