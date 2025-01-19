<script setup lang="ts">  
  const isVisible = defineModel<boolean>()
  const route = useRoute()
  const clipboard = useClipboard()

  const BASE_URL = 'BASE_URL'

  const copyLink = () => {
    clipboard.copy(`https://${BASE_URL}/board/${route.params.boardId}`)
  }
</script>

<template>
  <LargeModal v-model="isVisible">
    <div class="p-2 text-right">
      <UButton 
        color="red"
        label="Close"
        variant="ghost"
        icon="i-heroicons-x-mark-16-solid"
        :ui="BUTTON_UI_OBJECT"
        @click="() => {isVisible = false}"
      />
    </div>
    <div class="pl-4 pr-4 sm:pr-0 lg:pl-8 lg:pr-4">
      <div class="w-full">
        <div class="pb-2 text-center text-xl md:text-2xl">To open this board in your web browser,</div>
        <div class="block sm:grid sm:grid-cols-[60%_40%]">
          <div class="flex flex-col justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold p-2 sm:p-4 border-b sm:border-b-0 sm:border-r border-slate-300 dark:border-slate-700">
            <div class="leading-snug break-words">
              Go to 
              <span class="text-teal-600 dark:text-teal-400">{{ BASE_URL }}</span>
              and enter board code
              <span class="text-teal-600 dark:text-teal-400">{{ route.params.boardId }}</span>
            </div>
          </div>
          
          <div>
            <BoardQRCode :base-url="BASE_URL" />
            <div class="px-8 text-center text-lg md:text-xl sm:pt-0">or scan this QR code.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 text-center">
      <div class="break-words">
        You can also send this link to people: 
        <a 
          class="text-teal-600 dark:text-teal-400 hover:underline" 
          href='https://github.com/max8539/taskflow'
        >
          https://{{ BASE_URL }}/board/{{ route.params.boardId }}
        </a>
      </div>
      <div v-if="clipboard.isSupported" class="pt-1">
        <UButton 
          :label="clipboard.copied.value ? 'Copied Link' : 'Copy Link'"
          variant="ghost"
          :icon="clipboard.copied.value ? 'i-heroicons-clipboard-document-check-16-solid' :'i-heroicons-clipboard-document-16-solid'"
          :ui="BUTTON_UI_OBJECT"
          @click="copyLink"
        />
      </div>
    </div>
  </LargeModal>
</template>
