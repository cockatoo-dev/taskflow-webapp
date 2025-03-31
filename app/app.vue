<script setup lang="ts">
  useHead({
    link: [{
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }]
  })
</script>

<template>
  <div class="min-w-[320px] font-sans text-base text-slate-800 dark:text-slate-200">
    <noscript class="block w-full p-2 bg-red-500 text-slate-100 dark:text-slate-900 text-center font-bold">
      This website requires JavaScript to be enabled. Please enable JavaScript in your web brower settings.
    </noscript>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
