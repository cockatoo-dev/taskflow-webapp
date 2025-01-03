<script setup lang="ts">
  import QRCode from 'qrcode'
  
  const isVisible = defineModel<boolean>()
  const route = useRoute()

  // https://tailwindcss.com/docs/customizing-colors
  const WHITE = '#ffffff'
  const BLACK = '#000000'
  const SLATE_200 = '#e2e8f0'
  const SLATE_800 = '#1e293b'
  const BASE_URL = 'BASE_URL'
  
  const lightQRCode = ref('')
  const darkQRCode = ref('')

  onMounted(async () => {
    lightQRCode.value = await QRCode.toDataURL('https://github.com/max8539/taskflow', {
      color: {light: WHITE, dark: SLATE_800}
    })
    darkQRCode.value = await QRCode.toDataURL('https://github.com/max8539/taskflow', {
      color: {light: BLACK, dark: SLATE_200}
    })
  })
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
        <div class="pb-2 text-center text-xl">To open this board in your web browser,</div>
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
            <div class="px-8 text-center text-lg font-bold pt-2 sm:pt-0">or scan this QR code</div>
            <img 
              class="block dark:hidden w-full max-w-[360px] mx-auto" 
              :src="lightQRCode"
              alt="QR code which directs people to this board."
            >
            <img 
              class="hidden dark:block w-full max-w-[360px] mx-auto" 
              :src="darkQRCode"
              alt="QR code which directs people to this board."
            >
          </div>
        </div>
      </div>
    </div>
    <div class="p-4">
      <div class="break-words">
        You can also send this link to people: 
        <a 
          class="text-teal-600 dark:text-teal-400 hover:underline" 
          href='https://github.com/max8539/taskflow'
        >
          https://{{ BASE_URL }}/board/{{ route.params.boardId }}
        </a>
      </div>
    </div>
  </LargeModal>
</template>