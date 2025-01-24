<script setup lang="ts">
  const isVisible = defineModel<boolean>()

  const errorMessage = ref('')
  const deleteLoading = ref(false)
  const isMotionSafe = useMotionSafe()

  watch(isVisible, () => {
    if (isVisible.value) {
      errorMessage.value = ''
      deleteLoading.value = false
    }
  })

  const deleteAccount = async () => {
    deleteLoading.value = true
    try {
      await $fetch("/api/account/delete", {method: 'post'})
      navigateTo("/")
    } catch (e) {
      deleteLoading.value = false
      fetchErrorHandler(e, errorMessage)
    }
  }
</script>

<template>
  <UModal v-model="isVisible" :transition="isMotionSafe" :ui="{background: 'dark:bg-black'}">
    <div class="p-4">
      <h3 class="text-xl font-bold pb-2">Delete your account??</h3>
      <p>
        You are about to delete your account. All your boards, and all the tasks on your boards, will be deleted. This cannot be undone.
        If you log in again with the same Github account, you will have an empty account.
      </p>
      <div class="flex gap-2 sm:gap-4 pt-2">
        <div>
          <UButton 
            label="Delete Board"
            icon="i-heroicons-trash-16-solid"
            color="red"
            :ui="BUTTON_UI_OBJECT"
            :loading="deleteLoading"
            @click="deleteAccount"
          />
        </div>
        <div>
          <UButton 
            icon="i-heroicons-x-mark-16-solid"
            label="Cancel"
            variant="ghost"
            :ui="BUTTON_UI_OBJECT"
            @click="() => {isVisible = false}"
          />
        </div>
      </div>
      <FormError :message="errorMessage" />
    </div>
  </UModal>
</template>