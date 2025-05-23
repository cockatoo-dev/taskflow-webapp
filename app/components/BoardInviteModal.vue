<!-- Board invite modal (show information for others to find your board)-->
<script setup lang="ts">  
  const isVisible = defineModel<boolean>()
  const route = useRoute()
  const clipboard = useClipboard()

  

  // Copy board link to clipboard
  const copyLink = () => {
    clipboard.copy(`https://${BASE_URL}/board/${route.params.boardId}`)
  }
</script>

<template>
  <LargeModal 
    v-model="isVisible"
    title="Invite other people to your board."
    :description="`Use board code ${route.params.boardId}, or go to https://${BASE_URL}/board/${route.params.boardId}`"
  >
    <div class="p-2 text-right">
      <UButton 
        color="neutral"
        variant="ghost"
        icon="heroicons:x-mark-16-solid"
        :class="BUTTON_GHOST_CLASS"
        @click="() => {isVisible = false}"
      >
        Close
      </UButton>
    </div>
    <div class="pl-4 pr-4 sm:pr-0 lg:pl-8 lg:pr-4">
      <div class="w-full">
        <div class="pb-2 text-center text-xl md:text-2xl">To open this board in your web browser,</div>
        <div class="block sm:grid sm:grid-cols-[60%_40%]">
          <div class="flex flex-col justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold p-2 sm:p-4 border-b sm:border-b-0 sm:border-r sm:border-slate-300 sm:dark:border-slate-700">
            <div class="leading-snug break-words">
              Go to 
              <span class="text-teal-600 dark:text-teal-400">{{ BASE_URL }}</span>
              and enter board code
              <span class="text-teal-600 dark:text-teal-400">{{ route.params.boardId }}</span>
            </div>
          </div>
          <div>
            <BoardQRCode />
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
          :href="`https://${BASE_URL}/board/${route.params.boardId}`"
        >
          https://{{ BASE_URL }}/board/{{ route.params.boardId }}
        </a>
      </div>
      <div v-if="clipboard.isSupported" class="pt-1">
        <UButton 
          variant="ghost"
          :icon="clipboard.copied.value ? 'heroicons:clipboard-document-check-16-solid' :'heroicons:clipboard-document-16-solid'"
          :class="BUTTON_GHOST_CLASS"
          @click="copyLink"
        >
          {{ clipboard.copied.value ? 'Copied Link' : 'Copy Link'}}
        </UButton>
      </div>
    </div>
  </LargeModal>
</template>
