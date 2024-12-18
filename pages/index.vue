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

  // let refreshInterval: ReturnType<typeof setTimeout>
  // const { data, refresh } = useFetch("/api/tasks")
  // const searchValue = ref('')

  // const displayTasks = computed(() => {
  //   if (!data.value) {
  //     return []
  //   }
  //   const sorted = [...data.value.tasks]
  //   sorted.sort((a, b) => {
  //     return taskSortNum(b.isComplete, b.numDeps) - taskSortNum(a.isComplete, a.numDeps)
  //   })
  //   const result: typeof sorted = []
  //   for (const i of sorted) {
  //     if (
  //       i.title.toLowerCase().includes(searchValue.value.toLowerCase()) ||
  //       i.description.toLowerCase().includes(searchValue.value.toLowerCase())
  //     ) {
  //       result.push(i)
  //     }
  //   }
  //   return result
  // })

  // const stats = computed(() => {
  //   const result = {
  //     complete: 0,
  //     ready: 0,
  //     notReady: 0,
  //     percent: 0,
  //   }
    
  //   if (!data.value) {
  //     return result
  //   }
    
  //   for (const i of data.value.tasks) {
  //     if (i.isComplete) {
  //       result.complete += 1
  //     } else if (i.numDeps <= 0) {
  //       result.ready += 1
  //     } else {
  //       result.notReady += 1
  //     }
  //   }
  //   result.percent = Math.floor(result.complete / data.value.tasks.length * 100)
  //   return result
  // })

  // onMounted(() => {
  //   refreshInterval = setInterval(refresh, 20000)
  // })
  // onUnmounted(() => {
  //   clearInterval(refreshInterval)
  // })
</script>

<template>
  <main class=" w-full min-w-80 h-[calc(100vh-4rem)] sm:grid sm:grid-cols-[50%_50%] lg:grid-cols-[67%_33%] 2xl:grid-cols-[75%_25%]">
    Taskflow homepage
  </main>
</template>