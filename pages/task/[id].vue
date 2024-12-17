<script setup lang="ts">
  let refreshInterval: any
  let addDepsLastUpdate = 0
  const route = useRoute()
  const { data, refresh } = useFetch("/api/task/info", {
    params: {
      id: route.params.id
    },
    method: 'get'
  })
  const addDepsFetch = useFetch("/api/tasksInfo", {
    immediate: false
  })

  const completeDisabled = ref(false)
  const isEditing = ref(false)
  const editTitle = ref('')
  const editDescription = ref('')
  const editDisable = ref(false)
  const addDepsSearch = ref('')
  const addDepsShow = ref(false)
  const addDepsDisable = ref(true)
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

    if (data.value.task.numDeps != num) {
      // console.log(`numdeps check failed: expected: ${num}, actual: ${data.value.task.numDeps}`)
      // errorMessage.value = `numdeps check failed: expected: ${num}, actual: ${data.value.task.numDeps}`
      // showError.value = true
      await $fetch('/api/task/depscheck', {
        method: 'get',
        params: {
          id: data.value.task.id
        }
      })
      refresh()
    }
  })

  const depsExists = (id: string) => {
    for (const i of data.value?.deps || []) {
      if (i.id == id) {
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
          !depsExists(i.id) &&
          i.id != route.params.id &&
          i.title.toLowerCase().includes(addDepsSearch.value.toLowerCase())
        ) {
        result.push(i)
      }
    }

    result.sort((a, b) => {
      return taskSortNum(b.isComplete, b.numDeps) - taskSortNum(a.isComplete, a.numDeps)
    })
    return result
  })

  const refreshFn = () => {
    if (isEditing.value) {
      return
    }
    refresh()
  }

  const setComplete = async (value: boolean) => {
    completeDisabled.value = true

    await $fetch('/api/task/complete', {
      method: 'post',
      body: {
        id: route.params.id,
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
  const deleteTask = async () => {
    try {
      await $fetch('/api/task/delete', {
        method: 'delete',
        body: {
          id: route.params.id
        }
      })
      navigateTo('/')
    } catch (err) {
      if (err instanceof Error) {
        errorMessage.value = err.message
        showError.value = true
      }
    }
    
  }

  const editStart = () => {
    if (!data || !data.value) {
      return
    }

    editTitle.value = data.value.task.title
    editDescription.value = data.value.task.description
    isEditing.value = true
  }
  
  const editSave = async () => {
    editDisable.value = true
    if (editTitle.value == '') {
      errorMessage.value = 'Please enter a task title.'
      showError.value = true
      editDisable.value = false
      return
    } else if (editTitle.value.length > 25) {
      errorMessage.value = 'Task title is too long.'
      showError.value = true
      editDisable.value = false
      return
    } else if (editDescription.value.length > 2500) {
      errorMessage.value = 'Task description is too long.'
      showError.value = true
      editDisable.value = false
      return
    }

    await $fetch('/api/task/edit', {
      method: 'put',
      body: {
        id: route.params.id,
        title: editTitle.value,
        description: editDescription.value
      }
    })
    .catch((err) => {
      errorMessage.value = err.data.message || err.message
      showError.value = true
    })

    await refresh()
    isEditing.value = false
    editDisable.value = false
    
  }
  const editDiscard = () => {
    isEditing.value = false
    editTitle.value = data.value?.task.title || ''
    editDescription.value = data.value?.task.description || ''
  }

  const addDepsFocus = async () => {
    if (Date.now() - addDepsLastUpdate > 20000) {
      addDepsFetch.refresh()
      addDepsLastUpdate = Date.now()
    }
    addDepsShow.value = true
    addDepsDisable.value = true
  }

  const addDeps = async (id: string) => {
    if (!data.value) {
      return
    }
    
    addDepsDisable.value = true
    await $fetch('/api/deps/add', {
      method: 'post',
      body: {
        source: data.value.task.id,
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
      method: 'delete',
      body: {
        source: route.params.id,
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
    refreshInterval = setInterval(refreshFn, 20000)
  })
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
</script>

<template>
  <StdContainer>
    <ErrorModal 
      v-model="showError"
      :message="errorMessage"
    />
    <BackLink />
    <div v-if="data">
      <div class="py-4">
        <UCard
          v-if="data.task.isComplete"
          :ui="{ body: { padding: 'p-2 sm:p-2' } }"
          class="bg-green-500 dark:bg-green-400 text-white dark:text-black text-sm"
        >
          <div class="inline-flex leading-5">
            <UIcon
              name="i-heroicons-check-circle-16-solid"
              class="h-5 w-5 mr-2 mb-1"
            />
            <span class="font-bold tracking-wider">
              COMPLETED
            </span>
          </div>
          <p>This task has been completed. Great Job!</p>
        </UCard>
        <UCard
          v-else-if="data.task.numDeps <= 0"
          :ui="{ body: { padding: 'p-2 sm:p-2' } }"
          class="bg-blue-500 dark:bg-blue-400 text-white dark:text-black text-sm"
        >
          <div class="inline-flex leading-5">
            <UIcon
              name="i-heroicons-play-circle-16-solid"
              class="h-5 w-5 mr-2 mb-1"
            />
            <span class="font-bold tracking-wider">
              READY
            </span>
          </div>
          <p>This task is ready to be completed. Time to get to work!</p>
        </UCard>
        <UCard
          v-else
          :ui="{ body: { padding: 'p-2 sm:p-2' } }"
          class="bg-red-500 dark:bg-red-400 text-white dark:text-black text-sm"
        >
          <div class="inline-flex leading-5">
            <UIcon
              name="i-heroicons-clock-16-solid"
              class="h-5 w-5 mr-2 mb-1"
            />
            <span class="font-bold tracking-wider">
              NOT READY
            </span>
          </div>
          <p>
            This task is not ready to be completed. {{ `${data.task.numDeps} ${data.task.numDeps == 1 ? 'task' : 'tasks'}` }} depended on by this task {{ `${data.task.numDeps == 1 ? 'has' : 'have'}` }} not been completed yet.
          </p>
        </UCard>
      </div>
      
      <div v-if="isEditing">
        <form>
          <div>
            <label
              for="edit-title"
              class="block pt-2 text-black dark:text-white font-bold"
            >
              Title (required)
            </label>
            <UInput 
              id="edit-title"
              v-model="editTitle"
              required
              autocomplete="off"
              placeholder="Enter a task title here..."
              class="font-bold"
            />
            <p
              class=" h-4 text-right text-xs text-black dark:text-white"
              :class="editTitle.length > 25 ? 'text-red-700 dark:text-red-300' : ''"
            >
              {{ editTitle.length }}/25
            </p>
          </div>
          
          <div>
            <label
              for="edit-description"
              class="block pt-2 text-black dark:text-white font-bold"
            >
              Description
            </label>
            <UTextarea 
              id="edit-description"
              v-model="editDescription"
              :rows="4"
              autocomplete="off"
              placeholder="Enter a task description here..."
            />
            <p
              class=" h-4 text-right text-xs"
              :class="editDescription.length > 2500 ? 'text-red-700 dark:text-red-300' : ''"
            >
              <span v-if="editDescription.length >= 2250">{{ editDescription.length }}/2500</span>
            </p>
          </div>

          <div class="block sm:hidden text-center">
            <UButton 
              type="submit"
              color="green"
              label="Save Changes"
              icon="i-heroicons-document-check-16-solid"
              class="font-bold"
              @click.prevent="editSave"
            />
          </div>
          <div class="block sm:hidden pt-1 text-center">
            <UButton 
              type="button"
              label="Discard Changes"
              icon="i-heroicons-trash-16-solid"
              class="font-bold"
              @click="editDiscard"
            />
          </div>
          <div class="hidden sm:block text-center">
            <UButton 
              type="submit"
              color="green"
              label="Save Changes"
              icon="i-heroicons-document-check-16-solid"
              class="font-bold"
              @click.prevent="editSave"
            />
            <UButton 
              type="button"
              label="Discard Changes"
              icon="i-heroicons-trash-16-solid"
              class="font-bold ml-1"
              @click="editDiscard"
            />
          </div>
        </form>
      </div>
      <div v-else>
        <h2 class=" text-3xl text-black dark:text-white font-bold pb-2">
          {{ data.task.title }}
        </h2>
        <MultiLineP
          :text="data.task.description"
          class="pb-2 text-sm text-black dark:text-white"
        />

        <div class="block sm:hidden pt-2 text-center">
          <UButton 
            label="Edit Task Details"
            icon="i-heroicons-pencil-square-16-solid"
            class="font-bold"
            @click="editStart"
          />
        </div>
        <div class="block sm:hidden pt-1 text-center">
          <UButton 
            v-if="!data.task.isComplete"
            color="green"
            icon="i-heroicons-check-16-solid"
            label="Mark as Completed"
            class="font-bold"
            @click="() => setComplete(true)"
          />
          <UButton 
            v-else
            icon="i-heroicons-x-mark-16-solid"
            label="Mark as Not Completed"
            class="font-bold"
            @click="() => setComplete(false)"
          />
        </div>
        <div class="hidden sm:block pt-2 text-center">
          <UButton 
            label="Edit Task Details"
            icon="i-heroicons-pencil-square-16-solid"
            class="font-bold mr-1 mt-1"
            @click="editStart"
          />
          <UButton 
            v-if="!data.task.isComplete"
            color="green"
            icon="i-heroicons-check-16-solid"
            label="Mark as Completed"
            class="font-bold mt-1"
            @click="() => setComplete(true)"
          />
          <UButton 
            v-else
            icon="i-heroicons-x-mark-16-solid"
            label="Mark as Not Completed"
            class="font-bold mt-1"
            @click="() => setComplete(false)"
          />
        </div>

        <h3 class="text-xl font-bold text-black dark:text-white pt-4">
          Task Dependencies
        </h3>
        <div class="w-full md:grid md:grid-cols-2">
          <div class="md:pr-1">
            <h4 class=" text-black dark:text-white font-bold pb-1">
              Current Dependencies
            </h4>

            <div class="w-full max-w-full h-48 overflow-y-auto ">
              <div v-if="displayDepsList.length > 0">
                <div
                  v-for="item of displayDepsList"
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
                      color="red"
                      icon="i-heroicons-minus-16-solid"
                      label="Remove"
                      class="font-bold"
                      :disabled="removeDepsDisable"
                      @click="() => removeDeps(item.id)"
                    />
                  </div>
                </div>
              </div>
              <div v-else>
                <p class=" pt-20 text-sm leading-8 text-center text-gray-700 dark:text-gray-300">
                  This task does not have any dependencies.
                </p>
              </div>
            </div>
          </div>
          <div class="md:pl-1">
            <h4 class=" text-black dark:text-white font-bold pb-1">
              Add a Dependency
            </h4>
            <UInput 
              v-model="addDepsSearch"
              autocomplete="off"
              variant="outline"
              icon="i-heroicons-magnifying-glass-16-solid"
              placeholder="Search for a task title..."
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
                      class="font-bold"
                      :disabled="removeDepsDisable"
                      @click="() => addDeps(item.id)"
                    />
                  </div>
                </div>
              </div>
              <div v-else-if="addDepsShow">
                <p class="pt-14 text-sm text-center text-gray-700 dark:text-gray-300">
                  Loading tasks...
                </p>
              </div>
              <div v-else>
                <p class="pt-14 text-sm text-center text-gray-700 dark:text-gray-300">
                  Use the search bar above to search for a task.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center pt-8">
          <UButton 
            color="red"
            icon="i-heroicons-trash-16-solid"
            label="Delete Task"
            class="font-bold"
            @click="deleteTask"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center font-bold text-2xl text-black dark:text-white pt-8">
        Loading...
      </p>
    </div>
  </StdContainer>
</template>