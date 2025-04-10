<script setup lang="ts">
  const NAVBAR_BUTTON_UI_OBJECT = {
    variant: {
      solid: 'shadow-none bg-{color}-500 dark:bg-{color}-500 hover:bg-{color}-600 dark:hover:bg-{color}-400 disabled:bg-{color}-500 dark:disabled:bg-{color}-500 focus-visible:outline-slate-100 dark:focus-visible:outline-slate-900 text-slate-100 dark:text-slate-900 text-base font-bold',
    },
    truncate: 'truncate text-clip'
  }
  const NAVBAR_BUTTON_CLASS = 'bg-teal-500 dark:bg-teal-500 hover:bg-teal-400 dark:hover:bg-teal-600 text-base font-bold text-slate-100 dark:text-slate-900'

  const showLogin = ref(false)
</script>

<template>
  <div>
    <LoginModal v-model="showLogin" />
    <nav class=" bg-teal-500 h-12 w-full grid grid-cols-[auto_1fr]">
      <NuxtLink 
        to="/" 
        class="flex focus-visible:outline-1 focus-visible:outline-slate-900 dark:focus-visible:outline-slate-100" 
        aria-label="Link to homepage"
      >
        <div class="p-2">
          <img src="/logo-light.webp" alt="Taskflow logo" class="block dark:hidden h-8">
          <img src="/logo-dark.webp" alt="Taskflow logo" class="hidden dark:block h-8">
        </div>
        
        <div class="block text-slate-100 dark:text-slate-900 py-2 pr-2 text-2xl font-bold">
          Taskflow 
        </div>
      </NuxtLink>
      <div class="text-right py-1.5 pr-1">
        <AuthState v-slot="{ loggedIn }">
          <UButton 
            v-if="loggedIn"
            type="button"
            to="/account"
            icon="i-heroicons-user-16-solid"
            truncate
            :class="NAVBAR_BUTTON_CLASS"
          >
            My Account
          </UButton>
          <UButton 
            v-else
            type="button"
            icon="i-heroicons-arrow-right-end-on-rectangle-16-solid"
            truncate
            :class="NAVBAR_BUTTON_CLASS"
            @click="() => {showLogin = true}"
          >
            Log In
          </UButton> 
        </AuthState>
      </div>
    </nav>
  </div>
</template>
