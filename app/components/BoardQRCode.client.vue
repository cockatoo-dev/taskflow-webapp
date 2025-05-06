<!-- QR Code component for borrd invite modal -->
<script setup lang="ts">
  import QRCode from 'qrcode';

  // QR code colours
  // https://tailwindcss.com/docs/colors
  const WHITE = '#ffffff'
  const SLATE_900 = '#0f172a'
  const SLATE_200 = '#e2e8f0'
  const SLATE_800 = '#1e293b'

  const route = useRoute()
  const isDark = useDark()
  const imgDataUrl = ref('')

  // Genereae QR code, update when dark mode changes
  watch([isDark], async () => {
    if (isDark.value) {
      imgDataUrl.value = await QRCode.toDataURL(`https://${BASE_URL}/board/${route.params.boardId}`, {
        color: {light: SLATE_900, dark: SLATE_200},
        type: 'image/webp',
        width: 360,
      })
    } else {
      imgDataUrl.value = await QRCode.toDataURL(`https://${BASE_URL}/board/${route.params.boardId}`, {
        color: {light: WHITE, dark: SLATE_800},
        type: 'image/webp',
        width: 360
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
