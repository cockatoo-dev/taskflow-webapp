<script setup lang="ts">
  const route = useRoute()

  let refreshInterval: ReturnType<typeof setTimeout>
  const { data, error, refresh } = useFetch("/api/tasks", {
    query: {boardId: route.params.boardId},
    method: 'get'
  })

  // State variables
  const searchValue = ref('')
  const showBoardSettings = ref(false)
  const showBoardInvite = ref(false)
  const showAddTask = ref(false)

  // Show invalid board modal if the board ID is invalid
  const showInvalidBoard = computed(() => {
    if (!error.value) {
      return false
    } else if (
      error.value.data.statusCode === 400 &&
      error.value.data.message === 'Invalid board ID.'
    ) {
      return true
    } else {
      return false
    }
  })

  // Dynamic page title
  const pageTitle = computed(() => {
    if (!data.value) {
      return 'Taskflow'
    } else {
      return `${data.value.board.title} | Taskflow`
    }
  })
  useHead({
    title: pageTitle
  })
  useSeoMeta({
    title: pageTitle,
    ogTitle: pageTitle,
    description: 'Task tracking for keeping your team coordinated.',
    ogDescription: 'Task tracking for keeping your team coordinated.'
  })

  // Generate sorted array of tasks to be displayed, which
  // is filtered by the search value 
  const displayTasks = computed(() => {
    if (!data.value) {
      return []
    }
    const sorted = [...data.value.tasks]
    sorted.sort((a, b) => {
      return taskSortNum(b.isComplete, b.numDeps) - taskSortNum(a.isComplete, a.numDeps)
    })
    const result: typeof sorted = []
    for (const i of sorted) {
      if (
        i.title.toLowerCase().includes(searchValue.value.toLowerCase()) ||
        i.description.toLowerCase().includes(searchValue.value.toLowerCase())
      ) {
        result.push(i)
      }
    }
    return result
  })

  // Generate board statistics
  // - complete: number of tasks that are complete
  // - ready: number of tasks that are not complete but have no dependencies
  // - notReady: number of tasks that are not complete and have dependencies
  // - percent: percentage of tasks that are complete
  const stats = computed(() => {
    const result = {
      complete: 0,
      ready: 0,
      notReady: 0,
      percent: 0,
    }
    
    if (!data.value) {
      return result
    }
    
    for (const i of data.value.tasks) {
      if (i.isComplete) {
        result.complete += 1
      } else if (i.numDeps <= 0) {
        result.ready += 1
      } else {
        result.notReady += 1
      }
    }
    result.percent = Math.floor(result.complete / data.value.tasks.length * 100)
    return result
  })

  // Refresh data if there is no error
  const intervalRefresh = () => {
    if (!error.value) {
      refresh()
    }
  }

  // Automatically refresh data every 20 seconds.
  onMounted(() => {
    refreshInterval = setInterval(intervalRefresh, 20000)
  })
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
</script>

<template>
  <div>
    <NavBar />
    <InvalidBoardModal v-model="showInvalidBoard" />
    <main 
      v-if="data"
      class="w-full min-w-80 sm:grid sm:grid-cols-[50%_50%] lg:grid-cols-[67%_33%] 2xl:grid-cols-[75%_25%]"
    >
      <BoardSettingsModal 
        v-model="showBoardSettings"
        :board-id="$route.params.boardId || ''"
        :title="data.board.title || ''"
        :public-perms="data.board.publicPerms || 0"
        :is-owner="data.board.isOwner || false"
        :refresh
      />
      <BoardInviteModal v-model="showBoardInvite" />
      <AddTaskModal v-model="showAddTask" :board-id="route.params.boardId || ''" /> 
      <div class="w-full h-full">
        <div class="h-10 p-1 grid grid-cols-[1fr_auto]">
          <h1 class="px-1 pt-1.5 lg:pt-0.5 lg:text-2xl text-center font-bold line-clamp-1 overflow-ellipsis">
            {{ data.board.title }}
          </h1>
          <div v-if="data.board.isOwner">
            <div class="block lg:hidden">
              <UDropdownMenu
                :items="[
                  [{
                    label: 'Board Settings',
                    icon: 'i-heroicons-wrench-16-solid',
                    color: 'primary',
                    onSelect: () => {showBoardSettings = true}
                  }],
                  [{
                    label: 'Invite to Board',
                    icon: 'i-heroicons-user-plus-16-solid',
                    color: 'primary',
                    onSelect: () => {showBoardInvite = true}
                  }]
                ]"
                :content="{align:'end'}"
                :ui="DROPDOWN_UI"
              >
                <UButton 
                  type="button"
                  icon="i-heroicons-ellipsis-vertical-16-solid"
                  variant="ghost"
                  :class="BUTTON_GHOST_CLASS"
                >
                  Options
                </UButton>
              </UDropdownMenu>
            </div>
            <div class="hidden lg:flex gap-1">
              <UButton 
                type="button"
                icon="i-heroicons-wrench-16-solid"
                variant="ghost"
                :class="BUTTON_GHOST_CLASS"
                @click="() => {showBoardSettings = true}"
              >
                Board Settings
              </UButton>
              <UButton 
                type="button"
                label="Invite to Board"
                icon="i-heroicons-user-plus-16-solid"
                variant="ghost"
                :class="BUTTON_GHOST_CLASS"
                @click="() => {showBoardInvite = true}"
              >
                Invite to Board
              </UButton>
            </div>
          </div>
          <div v-else>
            <UButton 
              type="button"
              icon="i-heroicons-user-plus-16-solid"
              variant="ghost"
              :class="BUTTON_GHOST_CLASS"
              @click="() => {showBoardInvite = true}"
            >
              Invite to Board
            </UButton>
          </div>
        </div>
        
        <div 
          v-if="canEdit(data.board)"
          class="h-10 p-1 grid grid-cols-[1fr_auto]"
        >
          <h2 class="pl-2 pt-0.5 leading-8 text-2xl">Current Tasks</h2>
          <UButton 
            type="button"
            icon="i-heroicons-plus-16-solid"
            :class="BUTTON_SOLID_CLASS"
            @click="() => {showAddTask = true}"
          >
            Add Task
          </UButton>
        </div>
        <div v-else class="h-10 p-1">
          <h2 class="pl-2 pt-0.5 leading-8 text-2xl">Current Tasks</h2>
        </div>

        <div class="p-1">
          <label class="sr-only" for="tasks-search">Search for a task. The list of tasks will update automatically.</label>
          <UInput 
            id="tasks-search"
            v-model="searchValue"
            autocomplete="off"
            variant="outline"
            icon="i-heroicons-magnifying-glass-16-solid"
            placeholder="Search for a task..."
            class="w-full"
            :ui="TEXT_INPUT_UI"
          />
        </div>
        <ul
          v-if="data && data.tasks.length > 0" 
          class="lg:grid lg:grid-cols-2 2xl:grid-cols-3 p-2 lg:p-4 lg:gap-4 max-h-[calc(100vh-11rem)] overflow-y-auto list-none m-0"
        >
          <li 
            v-for="item of displayTasks" 
            :key="item.taskId"
            class="max-lg:pb-2 m-0"
          >
            <TaskListItem
              :board-id="item.boardId"
              :task-id="item.taskId"
              :title="item.title"
              :description="item.description"
              :is-complete="item.isComplete"
              :num-deps="item.numDeps"
            />
          </li>
        </ul>
        <div v-else class="pt-8">
          <h3 class="font-bold text-3xl text-center">
            No tasks!
          </h3>
          <p class="text-center">
            Click "Add Task" above to create a task.
          </p>
        </div>
      </div>
      <div class="hidden sm:block w-full max-h-[calc(100vh-3rem)] overflow-y-auto p-1 lg:p-2">
        <div class="p-1 lg:p-2 text-center text-3xl">
          <div v-if="stats.percent < 100">
            <p>
              We're <span class="text-teal-600 dark:text-teal-400">{{ stats.percent }}%</span> of the way there!
            </p>
          </div>
          <div v-else>
            <p class="text-green-600 dark:text-green-400">We've made it. </p>
            <p class="text-green-600 dark:text-green-400">Great work, team!</p>
          </div>
        </div>
        <StatsChart
          :complete="stats.complete"
          :ready="stats.ready"
          :not-ready="stats.notReady"
        />
      </div>
    </main>
    <div v-else-if="error && !showInvalidBoard">
      <LoadingError :refresh />
    </div>
    <div v-else class="text-center font-bold text-xl pt-8">
      Loading...
    </div>
  </div>
</template>
