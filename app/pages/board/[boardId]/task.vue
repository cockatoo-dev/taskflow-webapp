<script setup lang="ts">  
  const { $csrfFetch } = useNuxtApp()

  const toast = useToast()
  
  let refreshInterval: ReturnType<typeof setInterval>
  let addDepsLastUpdate = 0
  const route = useRoute()
  const { data, error, refresh } = useFetch("/api/task/info", {
    query: {
      boardId: route.params.boardId,
      taskId: route.query.taskId
    },
    method: 'get'
  })

  // Show modal if the board ID is invalid
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
      return `${data.value.task?.title} | Taskflow`
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

  // Array of all tasks, used for displaying options for adding dependencies
  const addDepsFetch = useFetch("/api/tasksInfo", {
    query: {
      boardId: route.params.boardId
    },
    method: 'get',
    immediate: false
  })

  // State variables
  const completeDisabled = ref(false)
  const showEdit = ref(false)
  const showDelete = ref(false)
  const addDepsSearch = ref('')
  const addDepsShow = ref(false)
  const addDepsDisable = ref(false)
  const removeDepsDisable = ref(false)
  const showError = ref(false)
  const errorMessage = ref('')

  watch(data, async () => {
    if (!data || !data.value) {
      return
    }

    // Validate dependency count, request server to check the value if 
    // client detects that it is incorrect, and refresh the task data.
    let num = 0
    for (const i of data.value.deps) {
      if (!i.isComplete) {
        num += 1
      }
    }
    if (data.value.task?.numDeps !== num) {
      console.log(`depscheck ${route.params.boardId} ${route.query.taskId}`)
      await $csrfFetch('/api/task/depscheck', {
        method: 'POST',
        body: {
          boardId: route.params.boardId,
          taskId: data.value.task?.taskId
        }
      })
      await refresh()
    }
  })

  // Check if a task is a dependency of the current task
  const depsExists = (id: string) => {
    for (const i of data.value?.deps || []) {
      if (i.taskId === id) {
        return true
      }
    }
    return false
  }
  
  // Sort task dependencies to be displayed
  const displayDepsList = computed(() => {
    if (!data || !data.value) {
      return []
    }
    const result = [...data.value.deps]
    result.sort((a, b) => {
      return taskSortNum(b.isComplete, b.numDeps) - taskSortNum(a.isComplete, a.numDeps)
    })
    return result
  })
  
  // Generate array of tasks that can be added as dependencies, and
  // update the list when the search input is changed.
  const addDepsList = computed(() => {
    if (!addDepsFetch.data || !addDepsFetch.data.value) {
      return []
    }
    const result: typeof addDepsFetch.data.value.tasksInfo = []
    for (const i of addDepsFetch.data.value.tasksInfo) {
      if (
        i.id !== route.query.taskId &&
        i.title.toLowerCase().includes(addDepsSearch.value.toLowerCase()) &&
        !depsExists(i.id)
      ) {
        result.push(i)
      }
    }

    result.sort((a, b) => {
      return taskSortNum(b.isComplete, b.numDeps) - taskSortNum(a.isComplete, a.numDeps)
    })
    return result
  })

  // Set the completed status of this task and refresh the task data.
  const setComplete = async (value: boolean) => {
    completeDisabled.value = true

    await $csrfFetch('/api/task/complete', {
      method: 'POST',
      body: {
        boardId: route.params.boardId,
        taskId: route.query.taskId,
        value: value
      }
    })
    .catch((err) => {
      toast.add({
        title: 'Error',
        description: err.data.message || err.message,
        color: 'error'
      })
    })

    await refresh()
    completeDisabled.value = false
    
  }

  // Fetch array of tasks that can be added as dependencies
  // when the search input is focused and the array was 
  // last updated more than 20 seconds ago.
  const addDepsFocus = async () => {
    if (Date.now() - addDepsLastUpdate > 20000) {
      addDepsShow.value = false
      await addDepsFetch.refresh()
      addDepsLastUpdate = Date.now()
    }
    addDepsShow.value = true
    addDepsDisable.value = false
  }

  // Add a dependency to the current task
  // and refresh the task data.
  const addDeps = async (id: string) => {
    if (!data.value) {
      return
    }
    
    addDepsDisable.value = true
    
    await $csrfFetch('/api/deps/add', {
      method: 'POST',
      body: {
        boardId: route.params.boardId,
        source: data.value.task?.taskId,
        dest: id,
      }
    })
    .catch((err) => {
      toast.add({
        title: 'Error',
        description: err.data.message || err.message,
        color: 'error'
      })
    })

    await refresh()
    addDepsDisable.value = false
  }

  // Remove a dependency from the current task
  // and refresh the task data.
  const removeDeps = async (id: string) => {
    removeDepsDisable.value = true
    await $csrfFetch('/api/deps/remove', {
      method: 'POST',
      body: {
        boardId: route.params.boardId,
        source: route.query.taskId,
        dest: id
      }
    })
    .catch((err) => {
      errorMessage.value = err.data.message || err.message
      showError.value = true
    })

    await refresh()
    removeDepsDisable.value = false
  }

  // Refresh data if the task is not being edited
  // and there is no error.
  const intervalRefresh = () => {
    if (!(showEdit.value || error.value)) {
      refresh()
    }
  }

  // Automatically refresh the task data every 30 seconds.
  onMounted(() => {
    refreshInterval = setInterval(intervalRefresh, 30000)
  })
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
</script>

<template>
  <div>
    <NavBar />
    <InvalidBoardModal v-model="showInvalidBoard" />
    <main v-if="data">
      <StdContainer>
        <EditTaskModal
          v-model="showEdit"
          :title="data?.task?.title || ''"
          :description="data?.task?.description || ''"
          :refresh
        />
        <DeleteTaskModal 
          v-model="showDelete" 
          :task-id="$route.query.taskId || ''"
          :task-name="data.task?.title || ''"
        />

        <BackLink :board-id="route.params.boardId" />
        <div>
          <div class="py-4">
            <TaskStatusCard 
              :is-complete="data.task?.isComplete || false"
              :num-deps="data.task?.numDeps || 0"
            />
          </div>
          
          <h1 class="text-3xl pb-2">
            {{ data.task?.title }}
          </h1>

          <div 
            v-if="canSetComplete(data.board)" 
            class="text-center pb-2"
          >
            <UButton 
              v-if="!data.task?.isComplete"
              color="success"
              icon="heroicons:check-circle-16-solid"
              :class="BUTTON_SOLID_CLASS"
              @click="() => setComplete(true)"
            >
              Mark as Completed
            </UButton>
            <UButton 
              v-else
              color="warning"
              icon="heroicons:exclamation-circle-16-solid"
              :class="BUTTON_SOLID_CLASS"
              @click="() => setComplete(false)"
            >
              Mark as Not Completed
            </UButton>
          </div>

          <MultiLineP
            :text="data.task?.description || ''"
            line-class="pb-2"
          />

          <div 
            v-if="canEdit(data.board)"
            class="w-full md:grid md:grid-cols-2 pt-2"
          >
            <div class="md:pr-1">
              <h3 class="pb-1 text-lg font-bold">Current Dependencies</h3>
              <div class="w-full max-w-full max-h-48 md:h-48 overflow-y-auto ">
                <div v-if="displayDepsList.length > 0">
                  <div
                    v-for="item of displayDepsList"
                    :key="item.taskId"
                    class="pb-1 grid grid-cols-[1fr_auto]"
                  >
                    <DepsListItem
                      :id="item.taskId"
                      :title="item.title"
                      :is-complete="item.isComplete"
                      :num-deps="item.numDeps"
                    />
                    <div class="pl-1">
                      <UButton 
                        color="error"
                        icon="heroicons:minus-16-solid"
                        label="Remove"
                        variant="ghost"
                        :class="BUTTON_GHOST_CLASS"
                        :loading="removeDepsDisable"
                        @click="() => removeDeps(item.taskId)"
                      >
                        Remove
                      </UButton>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <p class="pt-2 md:pt-20 text-center">
                    This task does not have any dependencies.
                  </p>
                </div>
              </div>
            </div>
            <div class="md:pl-1">
              <h3 class="pb-1 text-lg font-bold">Add a Dependency</h3>
              <label class="sr-only" for="deps-search">Search for a task title to show tasks that can be added as dependencies.</label>
              <UInput 
                id="deps-search"
                v-model="addDepsSearch"
                autocomplete="off"
                variant="outline"
                icon="heroicons:magnifying-glass-16-solid"
                placeholder="Search for a task title..."
                class="w-full"
                :ui="TEXT_INPUT_UI"
                @focus="addDepsFocus"
              />
              <div class="max-h-40 md:h-40 w-full overflow-y-auto">
                <div v-if="addDepsShow && addDepsFetch.data.value">
                  <div
                    v-for="item of addDepsList"
                    :key="item.id"
                    class="pt-1 grid grid-cols-[1fr_auto]"
                  >
                    <DepsListItem
                      :id="item.id"
                      :title="item.title"
                      :is-complete="item.isComplete"
                      :num-deps="item.numDeps"
                    />
                    <div class="pl-1">
                      <UButton 
                        color="success"
                        icon="heroicons:plus-16-solid"
                        :loading="addDepsDisable"
                        loading-icon="heroicons:arrow-path-16-solid"
                        variant="ghost"
                        :class="BUTTON_GHOST_CLASS"
                        @click="() => addDeps(item.id)"
                      >
                        Add
                      </UButton>
                    </div>
                  </div>
                </div>
                <div v-else-if="addDepsShow">
                  <p class="pt-2 md:pt-12 text-center">
                    Loading tasks...
                  </p>
                </div>
                <div v-else>
                  <p class="pt-2 md:pt-12 text-center">
                    Use the search bar above to search for a task.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="w-full">
            <h3 class="pb-1 text-lg font-bold">Current Dependencies</h3>
            <div class="w-full max-w-full max-h-48 md:h-48 overflow-y-auto ">
              <div v-if="displayDepsList.length > 0">
                <div
                  v-for="item of displayDepsList"
                  :key="item.taskId"
                  class="pb-1"
                >
                  <DepsListItem
                    :id="item.taskId"
                    :title="item.title"
                    :is-complete="item.isComplete"
                    :num-deps="item.numDeps"
                  />
                </div>
              </div>
              <div v-else>
                <p class="pt-2 md:pt-20 text-center">
                  This task does not have any dependencies.
                </p>
              </div>
            </div>
          </div>

          <div v-if="canEdit(data.board)">
            <h3 class="py-2 text-lg font-bold">Task Options</h3>
            <div class="block sm:hidden pt-1 text-center">
              <UButton 
                icon="heroicons:pencil-square-16-solid"
                variant="ghost"
                :class="BUTTON_GHOST_CLASS"
                @click="() => {showEdit = true}"
              >
                Edit Task Details
              </UButton>
            </div>
            <div class="block sm:hidden pt-1 text-center">
              <UButton 
                color="error"
                icon="heroicons:trash-16-solid"
                label="Delete Task"
                variant="ghost"
                :class="BUTTON_GHOST_CLASS"
                @click="() => {showDelete = true}"
              >
                Delete Task
              </UButton>
            </div>
            <div class="hidden sm:flex gap-4 justify-center pt-2">
              <div>
                <UButton 
                  icon="heroicons:pencil-square-16-solid"
                  variant="ghost"
                  :class="BUTTON_GHOST_CLASS"
                  @click="() => {showEdit = true}"
                >
                  Edit Task Details
                </UButton>
              </div>
              <div>
                <UButton 
                  color="error"
                  icon="heroicons:trash-16-solid"
                  variant="ghost"
                  :class="BUTTON_GHOST_CLASS"
                  @click="() => {showDelete = true}"
                >
                  Delete Task
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </StdContainer>
    </main>
    <div v-else-if="error && error.statusCode === 400" class="py-16">
      <h1 class="pb-2 text-xl text-center font-bold">This task does not exist.</h1>
      <div class="text-center">
        <UButton 
          icon="heroicons:arrow-left-16-solid"
          :class="BUTTON_SOLID_CLASS"
          :to="`/board/${route.params.boardId}`"
        >
          Return to Board
        </UButton>
      </div>
    </div>
    <LoadingError v-else-if="error && !showInvalidBoard" :refresh />
    <div v-else class="text-center font-bold text-xl pt-8">
      Loading...
    </div>
  </div>
</template>
