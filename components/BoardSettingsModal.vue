<script setup lang="ts">
  import { FetchError } from 'ofetch'
  
  const isVisible = defineModel<boolean>()
  const props = defineProps<{
    boardName: string,
    publicPerms: number
  }>()
  
  const route = useRoute()

  const boardNameEdit = ref("")
  const publicPermsEdit = ref(1)
  const errorMessage = ref("")
  const disableSubmit = ref(false)

  const submitForm = async () => {
    if (boardNameEdit.value.length > 40) {
      errorMessage.value = "Board name is too long (maximum 40 characters)."
      return
    }

    disableSubmit.value = true
    try {
      await $fetch("/api/board/create", {
        method: 'post',
        body: {
          boardId: route.params.boardId,
          boardName: boardNameEdit.value,
          publicPerms: publicPermsEdit.value
        }
      })
      isVisible.value = false
    } catch (e) {
      if (e instanceof FetchError) {
        disableSubmit.value = false
        errorMessage.value = e.message
      } else {
        throw e
      }
    }
  }

  watch(isVisible, () => {
    if (isVisible.value) {
      boardNameEdit.value = props.boardName
      publicPermsEdit.value = props.publicPerms
      errorMessage.value = ''
      disableSubmit.value = false
    }
  })
</script>

<template>
  <LargeModal v-model="isVisible">
    <div class="w-full p-4">
      <h3 class="text-3xl font-bold pb-2">Board Settings</h3>
      <form @submit.prevent="submitForm">
        <div class="pb-2">
          <label for="settings-name" class="block pb-2 font-bold">Board Name</label>
          <UInput 
            id="settings-name"
            v-model="boardNameEdit" 
            required
            autocomplete="off"
            class="block w-full"
            :ui="TEXT_INPUT_UI_OBJECT"
          />
          <CharLimit :str="boardName" :limit="40" :show-length="30" />
        </div>
        <div class="pb-4">
          <PublicPermsRadio v-model="publicPermsEdit" />
        </div>
        <div class="flex gap-4">
          <div>
            <UButton 
              type="submit"
              label="Save Changes"
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
  </LargeModal>
</template>
