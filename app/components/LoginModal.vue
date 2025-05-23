<!-- Login modal, used by navbar -->
<script setup lang="ts">
  const isVisible = defineModel<boolean>()
</script>

<template>
  <SmallModal 
    v-model="isVisible"
    title="Log in to Taskflow"
    description="Log in to Taskflow with your Github account."
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
      <div class="text-xl text-center font-bold">Log in to Taskflow with your Github account.</div>
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
        Only your Github user ID and username is collected by Taskflow, which is used to associate your Github account with the boards you create.
      </div>
    </div>
  </SmallModal>
</template>
