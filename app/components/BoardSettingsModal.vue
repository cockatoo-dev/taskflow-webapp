<script setup lang="ts">
  const { $csrfFetch } = useNuxtApp()
  const isVisible = defineModel<boolean>()
  const props = defineProps<{
    boardId: string | string[]
    title: string,
    publicPerms: number,
    refresh: () => Promise<void>
  }>()

  const titleEdit = ref("")
  const publicPermsEdit = ref(1)
  const errorMessage = ref("")
  const disableSubmit = ref(false)

  const submitForm = async () => {
    if (titleEdit.value.length > 50) {
      errorMessage.value = "Board Name is too long (maximum 50 characters)."
      return
    }

    disableSubmit.value = true
    try {
      await $csrfFetch("/api/board/edit", {
        method: 'post',
        body: {
          boardId: props.boardId,
          title: titleEdit.value,
          publicPerms: publicPermsEdit.value
        }
      })
      await props.refresh()
      isVisible.value = false
    } catch (e) {
      disableSubmit.value = false
      fetchErrorHandler(e, errorMessage)
    }
  }

  watch(isVisible, () => {
    if (isVisible.value) {
      titleEdit.value = props.title
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
            v-model="titleEdit" 
            required
            autocomplete="off"
            class="block w-full"
            :ui="TEXT_INPUT_UI_OBJECT"
          />
          <CharLimit :str="title" :limit="40" :show-length="30" />
        </div>
        <div class="pb-4">
          <PublicPermsRadio v-model="publicPermsEdit" />
        </div>
        <div class="flex gap-4">
          <div>
            <UButton 
              type="submit"
              label="Save Changes"
              icon="i-heroicons-check-16-solid"
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
      <div v-if="$route.path !== '/account'" class="pt-2">
        If you are looking to delete this board, please go to the
        <NuxtLink to="/account" class="text-teal-600 dark:text-teal-400 hover:underline">
          account page.
        </NuxtLink>
      </div>
    </div>
  </LargeModal>
</template>
