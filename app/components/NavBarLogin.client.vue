<!-- Navbar displayed on all pages -->
<script setup lang="ts">
  const NAVBAR_BUTTON_CLASS = 'bg-teal-500 dark:bg-teal-500 hover:bg-teal-400 dark:hover:bg-teal-600 active:bg-teal-400 dark:active:bg-teal-600 text-base font-bold text-slate-100 dark:text-slate-900 focus-visible:outline-slate-100 dark:focus-visible:outline-slate-900'
  const showLogin = ref(false)
</script>

<template>
  <div>
    <LoginModal v-model="showLogin" />
    <AuthState v-slot="{ loggedIn }">
      <UButton 
        v-if="loggedIn"
        type="button"
        to="/account"
        icon="heroicons:user-16-solid"
        truncate
        :class="NAVBAR_BUTTON_CLASS"
      >
        My Account
      </UButton>
      <UButton 
        v-else
        type="button"
        icon="heroicons:arrow-right-end-on-rectangle-16-solid"
        truncate
        :class="NAVBAR_BUTTON_CLASS"
        @click="() => {showLogin = true}"
      >
        Log In
      </UButton> 
    </AuthState>
  </div>
</template>
