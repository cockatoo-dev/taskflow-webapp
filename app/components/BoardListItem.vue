<!-- Board list item on account page -->
<script setup lang="ts">
  const props = defineProps<{
    boardId: string,
    title: string,
    publicPerms: number,
    refresh: () => Promise<void>,
    deleteHandler: () => void
  }>()

  const showSettings = ref(false)
</script>

<template>
  <div>
    <BoardSettingsModal 
      v-model="showSettings" 
      :board-id 
      :title 
      :public-perms 
      is-owner 
      :refresh 
    />
    <div class="grid grid-cols-[1fr_auto]">
      <div class="pl-2 pr-1">
        <h3 class="line-clamp-1 overflow-elipsis">{{ title }}</h3>
        <div class="text-xs">Board code: {{ boardId }}</div>
      </div>
      <div class="flex flex-col justify-center">
        <div>
          <div class="block sm:hidden">
            <UDropdownMenu
              :items="[
                [{
                  label: 'Open Board',
                  icon: 'heroicons:arrow-right-16-solid',
                  color: 'primary',
                  to:`/board/${boardId}`
                }],
                [{
                  label: 'Board Settings',
                  icon: 'heroicons:wrench-16-solid',
                  color: 'primary',
                  onSelect: () => {showSettings = true}
                }],
                [{
                  label: 'Delete Board',
                  icon: 'heroicons:trash-16-solid',
                  color: 'error',
                  onSelect: props.deleteHandler
                }]
              ]"
              :content="{align:'end'}"
              :ui="DROPDOWN_UI"
            >
              <UButton 
                type="button"
                icon="heroicons:ellipsis-vertical-16-solid"
                variant="ghost"
                :class="BUTTON_GHOST_CLASS"
              >
                Options
              </UButton>
            </UDropdownMenu>
          </div>
          <div class="hidden sm:flex lg:hidden gap-2">
            <div>
              <UButton 
                icon="heroicons:arrow-right-16-solid"
                :class="BUTTON_SOLID_CLASS"
                :to="`/board/${boardId}`"
              >
                Open Board
              </UButton>
            </div>
            <div>
              <UDropdownMenu
                :items="[
                  [{
                    label: 'Board Settings',
                    icon: 'heroicons:wrench-16-solid',
                    color: 'primary',
                    onSelect: () => {showSettings = true}
                  }],
                  [{
                    label: 'Delete Board',
                    icon: 'heroicons:trash-16-solid',
                    color: 'error',
                    onSelect: props.deleteHandler
                  }]
                ]"
                :content="{align:'end'}"
                :ui="DROPDOWN_UI"
              >
                <UButton 
                  type="button"
                  icon="heroicons:ellipsis-vertical-16-solid"
                  variant="ghost"
                  :class="BUTTON_GHOST_CLASS"
                >
                  Options
                </UButton>
              </UDropdownMenu>
            </div>
          </div>
          <div class="hidden lg:flex gap-2">
            <div>
              <UButton 
                icon="heroicons:arrow-right-16-solid"
                :class="BUTTON_SOLID_CLASS"
                :to="`/board/${boardId}`"
              >
                Open Board
              </UButton>
            </div>
            <div>
              <UButton 
                type="button"
                icon="heroicons:wrench-16-solid"
                variant="ghost"
                :class="BUTTON_GHOST_CLASS"
                @click="() => {showSettings = true}"
              >
                Board Settings
              </UButton>
            </div>
            <div>
              <UButton 
                type="button"
                icon="heroicons:trash-16-solid"
                variant="ghost"
                color="error"
                :class="BUTTON_GHOST_CLASS"
                @click="deleteHandler"
              >
                Delete Board
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
