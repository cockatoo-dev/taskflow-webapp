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

  // Clear user session (logout or delete account)
  const { clear } = useUserSession()

  const { data, error, refresh } = useFetch('/api/account/boards', {method: 'get'})

  // Toggle for the create board modal
  const showCreate = ref(false)

  // State variables for the delete board modal
  const deleteBoardId = ref('')
  const deleteTitle = ref('')
  const showDeleteBoard = ref(false)

  // Toggle for the delete account modal
  const showDeleteAccount = ref(false)

  // Function to show the delete board modal
  const deleteBoardHandler = (boardId: string, title: string) => {
    deleteBoardId.value = boardId
    deleteTitle.value = title
    showDeleteBoard.value = true
  }

  // Logout function
  const logout = async (clear: () => Promise<void>) => {
    await clear()
    navigateTo("/", {external: true})
  }

  let refreshInterval: ReturnType<typeof setTimeout>
  
  // Refresh data if there is no error
  const intervalRefresh = () => {
    if (!error.value) {
      refresh()
    }
  }

  // Automatically refresh data every 60 seconds
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
      v-model="showDeleteBoard"
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
              :delete-handler="() => {deleteBoardHandler(board.boardId, board.title)}"
              :refresh
            />
          </li>
        </ul>
        <div class="pt-2 text-center">
          <UButton 
            type="button"
            icon="i-heroicons-plus-16-solid"
            variant="ghost"
            :class="BUTTON_GHOST_CLASS"
            @click="() => {showCreate = true}"
          >
            Create New Board
          </UButton>
        </div>
        <h2 class="pb-2 font-bold text-xl">Account Options</h2>
        <div class="block sm:hidden pt-1 text-center">
          <UButton 
            type="button"
            icon="i-heroicons-arrow-right-start-on-rectangle-16-solid"
            variant="ghost"
            :class="BUTTON_GHOST_CLASS"
            @click="() => logout(clear)"
          >
            Log Out
          </UButton>
        </div>
        <div class="block sm:hidden pt-1 text-center">
          <UButton 
            type="button"
            color="error"
            icon="i-heroicons-trash-16-solid"
            variant="ghost"
            :class="BUTTON_SOLID_CLASS"
            @click="() => {showDeleteAccount = true}"
          >
            Delete Account
          </UButton>
        </div>
        <div class="hidden sm:flex sm:gap-2 sm:justify-center">
          <div>
            <UButton 
              type="button"
              icon="i-heroicons-arrow-right-start-on-rectangle-16-solid"
              variant="ghost"
              :class="BUTTON_GHOST_CLASS"
              @click="() => {logout(clear)}"
            >
              Log Out
            </UButton>
          </div>
          <div>
            <UButton 
              type="button"
              color="error"
              icon="i-heroicons-trash-16-solid"
              variant="ghost"
              :class="BUTTON_GHOST_CLASS"
              @click="() => {showDeleteAccount = true}"
            >
              Delete Account
            </UButton>
          </div>
        </div>
      </StdContainer>
    </main>
    <div v-else-if="error && error.statusCode === 401" class="py-10">
      <h1 class="pb-2 text-xl text-center font-bold">You are not logged in.</h1>
      <div class="text-center">
        <UButton 
          type="button"
          icon="i-heroicons-home-16-solid"
          :class="BUTTON_SOLID_CLASS"
          to="/"
        >
          Back to Homepage
        </UButton>
      </div>
    </div>
    <div v-else-if="error">
      <LoadingError :refresh />
    </div>
  </div>
</template>