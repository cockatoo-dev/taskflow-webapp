<script setup lang="ts">
  import type { NuxtError } from '#app'
  const props = defineProps<{
    error: NuxtError
  }>()

  onMounted(() => {
    if (props.error.statusCode === 404) {
      console.info("Error information:\n", props.error)
    } else {
      console.info("Error information:\n", props.error, "\nIf this error appears repeatedly, consider creating an issue at https://github.com/cockatoo-dev/taskflow-webapp/issues")
    }

  })
</script>

<template>
  <NavBar />
  <StdContainer>
    <main class=" text-slate-800 dark:text-slate-200">
      <div class="py-16 text-center">
        <h1 v-if="error.statusCode === 404" class="pb-2 text-xl text-center font-bold">Page not found.</h1>
        <h1 v-else-if="error.statusCode >= 500" class="pb-2 text-xl text-center font-bold">Something went wrong on our end.</h1>
        <h1 v-else class="pb-2 text-xl text-center font-bold">Something went wrong.</h1>
        
        <UButton 
          type="button"
          to="/"
          label="Back to Homepage"
          icon="i-heroicons-home-16-solid"
          :ui="BUTTON_UI_OBJECT"
        />
      </div>
    </main>
  </StdContainer>
</template>