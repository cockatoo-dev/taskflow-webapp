<script setup lang="ts">
  import QRCode  from 'qrcode';
  const props = defineProps<{
    baseUrl: string
  }>()

  // https://tailwindcss.com/docs/customizing-colors
  const WHITE = '#ffffff'
  const BLACK = '#000000'
  const SLATE_200 = '#e2e8f0'
  const SLATE_800 = '#1e293b'

  const isDark = useDark()
  const imgDataUrl = ref('')

  watch([props, isDark], async () => {
    if (!props.baseUrl) {
      return
    }
    if (isDark.value) {
      imgDataUrl.value = await QRCode.toDataURL('https://github.com/max8539/taskflow', {
        color: {light: BLACK, dark: SLATE_200}
      })
    } else {
      imgDataUrl.value = await QRCode.toDataURL('https://github.com/max8539/taskflow', {
        color: {light: WHITE, dark: SLATE_800}
      })
    }
  }, {immediate: true})
</script>

<template>
  <img 
    class="block w-full max-w-[360px] mx-auto" 
    :src="imgDataUrl"
    alt="QR code which directs people to this board."
  >
</template>
