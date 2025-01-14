<script setup lang="ts">
  const props = defineProps<{
    boardId: string,
    title: string,
    publicPerms: number,
    refresh: () => void,
    deleteHandler: () => void
  }>()

  const showSettings = ref(false)
</script>

<template>
  <div>
    <BoardSettingsModal v-model="showSettings" :board-id :title :public-perms :refresh />
    <div class="grid grid-cols-[1fr_auto]">
      <h3 class="pl-4 pr-1 pt-1.5 line-clamp-1 overflow-elipsis">{{ title }}</h3>
      <div>
        <div class="block sm:hidden">
          <UDropdown
            :items="[
              [{
                label: 'Open Board',
                icon: 'i-heroicons-arrow-right-16-solid',
                to:`/board/${boardId}`
              }],
              [{
                label: 'Board Settings',
                icon: 'i-heroicons-wrench-16-solid',
                click: () => {showSettings = true}
              }],
              [{
                label: 'Delete Board',
                icon: 'i-heroicons-trash-16-solid',
                click: props.deleteHandler
              }]
            ]"
            :content="{align:'end'}"
            :ui="DROPDOWN_UI_OBJECT"
          >
            <UButton 
              type="button"
              label="Options"
              icon="i-heroicons-ellipsis-vertical-16-solid"
              variant="ghost"
              :ui="BUTTON_UI_OBJECT"
            />
          </UDropdown>
        </div>
        <div class="hidden sm:flex lg:hidden gap-2">
          <div>
            <UButton 
              label="Open Board"
              icon="i-heroicons-arrow-right-16-solid"
              :ui="BUTTON_UI_OBJECT"
              :to="`/board/${boardId}`"
            />
          </div>
          <div>
            <UDropdown
              :items="[
                [{
                  label: 'Board Settings',
                  icon: 'i-heroicons-wrench-16-solid',
                  click: () => {showSettings = true}
                }],
                [{
                  label: 'Delete Board',
                  icon: 'i-heroicons-trash-16-solid',
                  click: props.deleteHandler
                }]
              ]"
              :content="{align:'end'}"
              :ui="DROPDOWN_UI_OBJECT"
            >
              <UButton 
                type="button"
                label="Options"
                icon="i-heroicons-ellipsis-vertical-16-solid"
                variant="ghost"
                :ui="BUTTON_UI_OBJECT"
              />
            </UDropdown>
          </div>
        </div>
        <div class="hidden lg:flex gap-2">
          <div>
            <UButton 
              label="Open Board"
              icon="i-heroicons-arrow-right-16-solid"
              :ui="BUTTON_UI_OBJECT"
              :to="`/board/${boardId}`"
            />
          </div>
          <div>
            <UButton 
              type="button"
              label="Board Settings"
              icon="i-heroicons-wrench-16-solid"
              variant="ghost"
              :ui="BUTTON_UI_OBJECT"
              @click="() => {showSettings = true}"
            />
          </div>
          <div>
            <UButton 
              type="button"
              label="Delete Board"
              icon="i-heroicons-trash-16-solid"
              variant="ghost"
              color="red"
              :ui="BUTTON_UI_OBJECT"
              @click="deleteHandler"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>