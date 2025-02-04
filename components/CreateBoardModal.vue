<script setup lang="ts">
  const isVisible = defineModel<boolean>()

  const title = ref("")
  const publicPerms = ref(1)
  const errorMessage = ref("")
  const disableSubmit = ref(false)

  const submitForm = async () => {
    if (title.value.length > 50) {
      errorMessage.value = "Board Name is too long (maximum 50 characters)."
      return
    }

    disableSubmit.value = true
    try {
      const { boardId } = await $fetch("/api/board/create", {
        method: 'post',
        body: {
          title: title.value,
          publicPerms: publicPerms.value
        }
      })
      await navigateTo(`/board/${boardId}`)
    } catch (e) {
      disableSubmit.value = false
      fetchErrorHandler(e, errorMessage)
    }
  }

  watch(isVisible, () => {
    if (isVisible.value) {
      title.value = ''
      publicPerms.value = 1
      disableSubmit.value = false
      errorMessage.value = ''
    }
  })
</script>

<template>
  <LargeModal v-model="isVisible">
    <div class="w-full p-4">
      <AuthState v-slot="{loggedIn}">
        <div v-if="loggedIn">
          <h3 class="text-3xl font-bold pb-2">Create New Board</h3>
          <form @submit.prevent="submitForm">
            <div class="pb-2">
              <label for="create-name" class="block pb-2 font-bold">Board Name</label>
              <UInput 
                id="create-name"
                v-model="title" 
                required
                autocomplete="off"
                class="block w-full"
                :ui="TEXT_INPUT_UI_OBJECT"
              />
              <CharLimit :str="title" :limit="40" :show-length="30" />
            </div>
            <div class="pb-4">
              <PublicPermsRadio v-model="publicPerms" />
              <div class="py-1">Your board can be accessed by anyone with your board code or a link to your board.</div>
              <div class="py-1">You will always have full permissions for the boards that you create. Only you can change these settings or delete this board after it is created.</div>
            </div>
            <div class="flex gap-2 sm:gap-4">
              <div>
                <UButton 
                  type="submit"
                  :loading="disableSubmit"
                  label="Create Board"
                  icon="i-heroicons-plus-16-solid"
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
        <div v-else>
          <div class="text-right">
            <UButton 
              color="red"
              label="Close"
              variant="ghost"
              icon="i-heroicons-x-mark-16-solid"
              :ui="BUTTON_UI_OBJECT"
              @click="() => {isVisible = false}"
            />
          </div>
          <div class="text-xl text-center font-bold">Log in to Taskflow with your Github account to create a board.</div>
          <div class="py-2 text-center">
            <UButton
              to="/api/account/login/github"
              icon="i-simple-icons-github"
              label="Log in with GitHub"
              color="black"
              :ui="GITHUB_BUTTON_UI_OBJECT"
              external
            />
          </div>
          <div class="text-xs px-2 pb-2">When you log in with Github, you agree for a cookie to be saved to your web browser to store your login information for Taskflow. Taskflow does not use cookies for any other purpose. Only your Github user ID and username is collected by Taskflow, which is used to associate your Github account with the boards you create.</div>
        </div>
      </AuthState>
    </div>
  </LargeModal>
</template>
