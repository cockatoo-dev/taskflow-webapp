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

  const { clear } = useUserSession()

  const { data, error, refresh } = useFetch('/api/account/boards', {method: 'get'})

  const deleteBoardId = ref('')
  const deleteTitle = ref('')
  const showDeleteTask = ref(false)
  const showDeleteAccount = ref(false)


  const deleteTaskHandler = (boardId: string, title: string) => {
    deleteBoardId.value = boardId
    deleteTitle.value = title
    showDeleteTask.value = true
  }

  const logout = async (clear: () => Promise<void>) => {
    await clear()
    navigateTo("/", {external: true})
  }

  let refreshInterval: ReturnType<typeof setTimeout>
  const intervalRefresh = () => {
    if (!error.value) {
      refresh()
    }
  }
  onMounted(() => {
    refreshInterval = setInterval(intervalRefresh, 60000)
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
      v-model="showDeleteTask"
      :board-id="deleteBoardId" 
      :title="deleteTitle"
      :refresh
    />
    <DeleteAccountModal v-model="showDeleteAccount" :clear-session="clear" />
    <main v-if="data">
      <StdContainer>
        <h1 class="text-3xl">My Account</h1>
        <AuthState v-slot="{ user }">
          <div class="pb-4">
            <div v-if="user?.userName" class="pt-2 font-bold">
              You are logged in as {{ user.userName }}.
            </div>
          </div>
        </AuthState>
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
              :delete-handler="() => {deleteTaskHandler(board.boardId, board.title)}"
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
            type="button"
            label="Log Out"
            icon="i-heroicons-arrow-right-start-on-rectangle-16-solid"
            variant="ghost"
            :ui="BUTTON_UI_OBJECT"
            @click="() => logout(clear)"
          />
        </div>
        <div class="block sm:hidden pt-1 text-center">
          <UButton 
            type="button"
            color="red"
            icon="i-heroicons-trash-16-solid"
            label="Delete Account"
            variant="ghost"
            :ui="BUTTON_UI_OBJECT"
            @click="() => {showDeleteAccount = true}"
          />
        </div>
        <div class="hidden sm:flex sm:gap-2 sm:justify-center">
          <div>
            <UButton 
              type="button"
              label="Log Out"
              icon="i-heroicons-arrow-right-start-on-rectangle-16-solid"
              variant="ghost"
              :ui="BUTTON_UI_OBJECT"
              @click="() => {logout(clear)}"
            />
          </div>
          <div>
            <UButton 
              type="button"
              color="red"
              icon="i-heroicons-trash-16-solid"
              label="Delete Account"
              variant="ghost"
              :ui="BUTTON_UI_OBJECT"
              @click="() => {showDeleteAccount = true}"
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