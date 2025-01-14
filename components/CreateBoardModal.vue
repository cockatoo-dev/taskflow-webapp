<script setup lang="ts">
  import { FetchError } from 'ofetch'
  
  const isVisible = defineModel<boolean>()

  const title = ref("")
  const publicPerms = ref(1)
  const errorMessage = ref("")
  const disableSubmit = ref(false)

  const submitForm = async () => {
    if (title.value.length > 40) {
      errorMessage.value = "Board Name is too long (maximum 40 characters)."
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
      if (e instanceof FetchError) {
        disableSubmit.value = false
        errorMessage.value = e.message
      } else {
        throw e
      }
    }
  }
</script>

<template>
  <LargeModal v-model="isVisible">
    <div class="w-full p-4">
      <div v-if="true">
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
        <div class="py-16 text-center">
          <div class="text-xl font-bold pb-2">You need to be logged in to create a board.</div>
          <div>Login button placeholder</div>
        </div>
      </div>
    </div>
  </LargeModal>
</template>
