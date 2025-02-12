<script setup lang="ts">
  const isVisible = defineModel<boolean>()

  const isMotionSafe = useMotionSafe()
</script>

<template>
  <UModal v-model="isVisible" :transition="isMotionSafe" :ui="{background: 'dark:bg-black'}">
    <div class="px-2 pt-2 text-right">
      <UButton 
        color="red"
        label="Close"
        variant="ghost"
        icon="i-heroicons-x-mark-16-solid"
        :ui="BUTTON_UI_OBJECT"
        @click="() => {isVisible = false}"
      />
    </div>
    <div class="px-4 pb-4">
      <div class="text-xl text-center font-bold">Log in to Taskflow with your Github account.</div>
      <div class="py-2 text-center">
        <UButton
          to="/api/account/login/github"
          icon="i-simple-icons-github"
          label="Log in with Github"
          color="black"
          :ui="GITHUB_BUTTON_UI_OBJECT"
          external
        />
      </div>
      <div class="text-xs">
        When you log in with Github, you agree for a cookie to be saved to your web browser to store your login information for Taskflow. 
        Taskflow does not use cookies for any other purpose. Only your Github user ID and username is collected by Taskflow, which is used to associate your Github account with the boards you create.
      </div>
    </div>
  </UModal>
</template>
