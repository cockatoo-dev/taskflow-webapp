<script setup lang="ts">
  useHead({
    title: "Taskflow"
  })
  useSeoMeta({
    title: 'Taskflow',
    ogTitle: 'Taskflow',
    description: 'Helping keep your team coordinated to meet your goals!',
    ogDescription: 'Helping keep your team coordinated to meet your goals!'
  })

  const showCreate = ref(false)
</script>

<template>
  <div>
    <NavBar />
    <CreateBoardModal v-model="showCreate" />
    <StdContainer>
      <main class="w-full lg:w-[1280px] mx-auto">
        Taskflow homepage
        <UButton @click="() => showCreate = true">Show modal</UButton> 
      </main>
    </StdContainer>
  </div>
</template>
