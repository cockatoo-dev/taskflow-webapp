<script setup lang="ts">  
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

  const boardInfoFetch = useFetch('/api/board/info', {
    query: {boardId: route.params.boardId},
    method: 'get'
  })
  const showInvalidBoard = computed(() => {
    if (!boardInfoFetch.error.value) {
      return false
    } else if (boardInfoFetch.error.value.statusCode === 400) {
      return true
    } else {
      return false
    }
  })

  const addDepsFetch = useFetch("/api/tasksInfo", {
    query: {
      boardId: route.params.boardId
    },
    method: 'get',
    immediate: false
  })

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

    let num = 0
    for (const i of data.value.deps) {
      if (!i.isComplete) {
        num += 1
      }
    }

    if (data.value.task.numDeps !== num) {
      console.log(`depscheck ${route.params.boardId} ${route.query.taskId}`)
      await $fetch('/api/task/depscheck', {
        method: 'get',
        params: {
          boardId: route.params.boardId,
          taskId: data.value.task.taskId
        }
      })
      refresh()
    }
  })

  const depsExists = (id: string) => {
    for (const i of data.value?.deps || []) {
      if (i.taskId === id) {
        return true
      }
    }
    return false
  }
  
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

  const intervalRefresh = async () => {
    if (showEdit.value) {
      return
    }
    await boardInfoFetch.refresh()
    await refresh()
  }

  const setComplete = async (value: boolean) => {
    completeDisabled.value = true

    await $fetch('/api/task/complete', {
      method: 'post',
      body: {
        boardId: route.params.boardId,
        taskId: route.query.taskId,
        value: value
      }
    })
    .catch((err) => {
      errorMessage.value = err.data.message || err.message
      showError.value = true
    })

    await refresh()
    completeDisabled.value = false
    
  }

  const addDepsFocus = async () => {
    if (Date.now() - addDepsLastUpdate > 20000) {
      addDepsShow.value = false
      await addDepsFetch.refresh()
      addDepsLastUpdate = Date.now()
    }
    addDepsShow.value = true
    addDepsDisable.value = false
  }

  const addDeps = async (id: string) => {
    if (!data.value) {
      return
    }
    
    addDepsDisable.value = true
    
    await $fetch('/api/deps/add', {
      method: 'post',
      body: {
        boardId: route.params.boardId,
        source: data.value.task.taskId,
        dest: id,
      }
    })
    .catch((err) => {
      errorMessage.value = err.data.message || err.message
      showError.value = true
    })

    await refresh()
    addDepsDisable.value = false
  }

  const removeDeps = async (id: string) => {
    removeDepsDisable.value = true
    await $fetch('/api/deps/remove', {
      method: 'post',
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

    <StdContainer v-if="boardInfoFetch.data.value">
      <EditTaskModal
        v-model="showEdit"
        :title="data?.task.title || ''"
        :description="data?.task.description || ''"
        :refresh
      />
      <DeleteTaskModal v-model="showDelete" />
      <ErrorModal 
        v-model="showError"
        :message="errorMessage"
      />
      <BackLink :board-id="route.params.boardId" />
      <div v-if="data">
        <div class="py-4">
          <TaskStatusCard 
            :is-complete="data?.task.isComplete || false"
            :num-deps="data?.task.numDeps || 0"
          />
        </div>
        
        <h1 class=" text-3xl font-bold pb-2">
          {{ data.task.title }}
        </h1>
        <MultiLineP
          :text="data.task.description"
          line-class="pb-2"
        />
        
        <div 
          v-if="canSetComplete(boardInfoFetch.data.value)" 
          class="text-center"
        >
          <UButton 
            v-if="!data.task.isComplete"
            color="green"
            icon="i-heroicons-check-circle-16-solid"
            label="Mark as Completed"
            :ui="BUTTON_UI_OBJECT"
            @click="() => setComplete(true)"
          />
          <UButton 
            v-else
            icon="i-heroicons-exclamation-circle-16-solid"
            label="Mark as Not Completed"
            :ui="BUTTON_UI_OBJECT"
            @click="() => setComplete(false)"
          />
        </div>

        <div 
          v-if="canEdit(boardInfoFetch.data.value)"
          class="w-full md:grid md:grid-cols-2 pt-2"
        >
          <div class="md:pr-1">
            <h3 class="pb-1 text-lg font-bold">Current Dependencies</h3>
            <div class="w-full max-w-full h-48 overflow-y-auto ">
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
                      color="red"
                      icon="i-heroicons-minus-16-solid"
                      label="Remove"
                      variant="ghost"
                      :ui="BUTTON_UI_OBJECT"
                      :loading="removeDepsDisable"
                      @click="() => removeDeps(item.taskId)"
                    />
                  </div>
                </div>
              </div>
              <div v-else>
                <p class="pt-20 leading-8 text-center">
                  This task does not have any dependencies.
                </p>
              </div>
            </div>
          </div>
          <div class="md:pl-1">
            <h3 class="pb-1 text-lg font-bold">Add a Dependency</h3>
            <UInput 
              v-model="addDepsSearch"
              autocomplete="off"
              variant="outline"
              icon="i-heroicons-magnifying-glass-16-solid"
              placeholder="Search for a task title..."
              aria-label="Search for a task title to show tasks that can be added as dependencies."
              :ui="TEXT_INPUT_UI_OBJECT"
              @focus="addDepsFocus"
            />
            <div class="h-40 w-full overflow-y-auto">
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
                      color="green"
                      icon="i-heroicons-plus-16-solid"
                      label="Add"
                      :loading="addDepsDisable"
                      variant="ghost"
                      :ui="BUTTON_UI_OBJECT"
                      @click="() => addDeps(item.id)"
                    />
                  </div>
                </div>
              </div>
              <div v-else-if="addDepsShow">
                <p class="pt-12 text-center">
                  Loading tasks...
                </p>
              </div>
              <div v-else>
                <p class="pt-12 text-center">
                  Use the search bar above to search for a task.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="w-full">
          <h3 class="pb-1 text-lg font-bold">Current Dependencies</h3>
          <div class="w-full max-w-full h-48 overflow-y-auto ">
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
              <p class="pt-20 leading-8 text-center">
                This task does not have any dependencies.
              </p>
            </div>
          </div>
        </div>

        <div v-if="canEdit(boardInfoFetch.data.value)">
          <h3 class="py-2 text-lg font-bold">Task Options</h3>
          <div class="block sm:hidden pt-1">
            <UButton 
              label="Edit Task Details"
              icon="i-heroicons-pencil-square-16-solid"
              variant="ghost"
              class="w-full justify-center"
              :ui="BUTTON_UI_OBJECT"
              @click="() => {showEdit = true}"
            />
          </div>
          <div class="block sm:hidden pt-1">
            <UButton 
              color="red"
              icon="i-heroicons-trash-16-solid"
              label="Delete Task"
              variant="ghost"
              class="w-full justify-center"
              :ui="BUTTON_UI_OBJECT"
              @click="() => {showDelete = true}"
            />
          </div>
          <div class="hidden sm:flex gap-4 justify-center pt-2">
            <div>
              <UButton 
                label="Edit Task Details"
                icon="i-heroicons-pencil-square-16-solid"
                variant="ghost"
                :ui="BUTTON_UI_OBJECT"
                @click="() => {showEdit = true}"
              />
            </div>
            <div>
              <UButton 
                color="red"
                icon="i-heroicons-trash-16-solid"
                label="Delete Task"
                variant="ghost"
                :ui="BUTTON_UI_OBJECT"
                @click="() => {showDelete = true}"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="error && error.statusCode === 400" class="py-16">
        <h1 class="pb-2 text-xl text-center font-bold">This task does not exist.</h1>
        <div class="text-center">
          <UButton 
            label="Back to Board Page"
            icon="i-heroicons-home-16-solid"
            :ui="BUTTON_UI_OBJECT"
            :to="`/board/${route.params.boardId}`"
          />
        </div>
      </div>
      <div v-else>
        <p class="text-center font-bold text-2xl pt-8">
          Loading...
        </p>
      </div>
    </StdContainer>
  </div>
</template>
