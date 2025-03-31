<script setup lang="ts">
  const NAVBAR_BUTTON_UI_OBJECT = {
    variant: {
      solid: 'shadow-none bg-{color}-500 dark:bg-{color}-500 hover:bg-{color}-600 dark:hover:bg-{color}-400 disabled:bg-{color}-500 dark:disabled:bg-{color}-500 focus-visible:outline-slate-100 dark:focus-visible:outline-slate-900 text-slate-100 dark:text-slate-900 text-base font-bold',
    },
    truncate: 'truncate text-clip'
  }

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
            label="My Account"
            to="/account"
            icon="i-heroicons-user-16-solid"
            truncate
            :ui="NAVBAR_BUTTON_UI_OBJECT"
          />
          <UButton 
            v-else
            type="button"
            label="Log In"
            icon="i-heroicons-arrow-right-end-on-rectangle-16-solid"
            truncate
            :ui="NAVBAR_BUTTON_UI_OBJECT"
            @click="() => {showLogin = true}"
          />
        </AuthState>
      </div>
    </nav>
  </div>
</template>
