<script setup lang="ts">
  const { $csrfFetch } = useNuxtApp()
  
  const isVisible = defineModel<boolean>()

  const props = defineProps<{
    clearSession: () => Promise<void>
  }>()

  const errorMessage = ref('')
  const deleteLoading = ref(false)

  watch(isVisible, () => {
    if (isVisible.value) {
      errorMessage.value = ''
      deleteLoading.value = false
    }
  })

  const deleteAccount = async () => {
    deleteLoading.value = true
    try {
      await $csrfFetch("/api/account/delete", {method: 'post'})
      await props.clearSession()
      navigateTo("/")
    } catch (e) {
      deleteLoading.value = false
      fetchErrorHandler(e, errorMessage)
    }
  }
</script>

<template>
  <SmallModal 
    v-model="isVisible"
    title="Delete your account?"
    description="Are you sure you want to delete your account?"
  >
    <div class="p-4">
      <div class="text-xl font-bold pb-2">Delete your account?</div>
      <p>
        You are about to delete your account. All your boards, and all the tasks on your boards, will be deleted. This cannot be undone.
        If you log in again with the same Github account, you will have an empty account.
      </p>
      <div class="flex gap-2 sm:gap-4 pt-2">
        <div>
          <UButton 
            icon="i-heroicons-trash-16-solid"
            color="error"
            :class="BUTTON_SOLID_CLASS"
            :loading="deleteLoading"
            loading-icon="i-heroicons-arrow-path-16-solid"
            @click="deleteAccount"
          >
            Delete Board
          </UButton>
        </div>
        <div>
          <UButton 
            icon="i-heroicons-x-mark-16-solid"
            label="Cancel"
            variant="ghost"
            :class="BUTTON_GHOST_CLASS"
            @click="() => {isVisible = false}"
          >
            Cancel
          </UButton>
        </div>
      </div>
      <FormError :message="errorMessage" />
    </div>
  </SmallModal>
</template>
