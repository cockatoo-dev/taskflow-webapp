<script setup lang="ts">
  const isLoggedIn = true

 const NAVBAR_BUTTON_UI_OBJECT = {
    variant: {
      solid: 'shadow-none bg-{color}-500 dark:bg-{color}-500 hover:bg-{color}-600 dark:hover:bg-{color}-400 disabled:bg-{color}-500 dark:disabled:bg-{color}-500 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-500 text-slate-100 dark:text-slate-900 text-base font-bold',
    }
  }
</script>

<template>
  <nav class=" bg-teal-500 h-12 w-full  grid grid-cols-[auto_1fr]">
    <NuxtLink to="/" class="flex">
      <div class="p-2">
        <UIcon
          name="i-heroicons-play-circle-16-solid"
          class="block h-8 w-8 text-slate-100 dark:text-slate-900" 
        />
      </div>
      
      <div class="block text-slate-100 dark:text-slate-900 py-2 text-2xl font-bold">
        Taskflow 
      </div>
    </NuxtLink>
    <div class="text-right py-1.5 pr-1">
      <UButton 
        v-if="isLoggedIn"
        type="button"
        label="My Account"
        to="/account"
        icon="i-heroicons-user-16-solid"
        :ui="NAVBAR_BUTTON_UI_OBJECT"
      />
      <UButton 
        v-else
        type="button"
        label="Log In"
        icon="i-heroicons-arrow-right-end-on-rectangle-16-solid"
        :ui="NAVBAR_BUTTON_UI_OBJECT"
      />
    </div>
  </nav>
</template>
