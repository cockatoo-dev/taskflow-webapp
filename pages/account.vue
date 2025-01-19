<script setup lang="ts">
  useHead({
    title: 'My Account | Taskflow'
  })
  useSeoMeta({
    title: 'My Account | Taskflow',
    ogTitle: 'My Account | Taskflow',
    description: 'Task tracking for keeping your team coordinated.',
    ogDescription: 'Task tracking for keeping your team coordinated.'
  })
  
  const showCreate = ref(false)

  const { data, error, refresh } = useFetch('/api/account/boards', {method: 'get'})

  const deleteBoardId = ref('')
  const deleteTitle = ref('')
  const showDelete = ref(false)

  const deleteHandler = (boardId: string, title: string) => {
    deleteBoardId.value = boardId
    deleteTitle.value = title
    showDelete.value = true
  }

  let refreshInterval: ReturnType<typeof setTimeout>
  onMounted(() => {
    refreshInterval = setInterval(refresh, 60000)
  })
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
</script>

<template>
  <div>
    <NavBar />
    <CreateBoardModal v-model="showCreate"/>
    <DeleteBoardModal 
      v-model="showDelete"
      :board-id="deleteBoardId" 
      :title="deleteTitle"
      :refresh
    />
    <main v-if="data">
      <StdContainer>
        <h1 class="pb-4 text-3xl">My Account</h1>
        <h2 class="pb-2 font-bold text-xl">My Boards</h2>
        <ul>
          <li
            v-for="board of data.boards"
            :key="board.boardId"
            class="w-full py-1 border-t border-t-slate-300 dark:border-t-slate-700 first:border-t-0"
          >
            <BoardListItem 
              :board-id="board.boardId"
              :title="board.title"
              :public-perms="board.publicPerms"
              :delete-handler="() => {deleteHandler(board.boardId, board.title)}"
              :refresh
            />
          </li>
        </ul>
        <div class="pt-2 text-center">
          <UButton 
            type="button"
            label="Create New Board"
            icon="i-heroicons-plus-16-solid"
            variant="ghost"
            :ui="BUTTON_UI_OBJECT"
            @click="() => {showCreate = true}"
          />
        </div>
        <h2 class="pb-2 font-bold text-xl">Account Options</h2>
        <div class="block sm:hidden pt-1 text-center">
          <UButton 
            label="Edit Task Details"
            icon="i-heroicons-pencil-square-16-solid"
            variant="ghost"
            :ui="BUTTON_UI_OBJECT"
          />
        </div>
        <div class="block sm:hidden pt-1 text-center">
          <UButton 
            color="red"
            icon="i-heroicons-trash-16-solid"
            label="Delete Account"
            variant="ghost"
            :ui="BUTTON_UI_OBJECT"
            @click="() => {showDelete = true}"
          />
        </div>
        <div class="hidden sm:flex sm:gap-2 sm:justify-center">
          <div>
            <UButton 
              label="Edit Task Details"
              icon="i-heroicons-pencil-square-16-solid"
              variant="ghost"
              :ui="BUTTON_UI_OBJECT"
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
      </StdContainer>
    </main>
    <div v-else-if="error">
      <LoadingError :refresh />
    </div>
  </div>
</template>