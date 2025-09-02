<!-- Navbar displayed on all pages -->
<template>
  <div>
    <nav class=" bg-teal-500 h-12 w-full grid grid-cols-[auto_1fr]">
      <NuxtLink 
        to="/" 
        class="flex focus-visible:outline-2 focus-visible:outline-slate-100 dark:focus-visible:outline-slate-900" 
        aria-label="Link to homepage"
      >
        <div class="p-2">
          <img src="/logo-light.webp" alt="Taskflow logo" class="block dark:hidden h-8">
          <img src="/logo-dark.webp" alt="Taskflow logo" class="hidden dark:block h-8">
        </div>
        
        <div class="block text-slate-100 dark:text-slate-900 py-2 pr-2 text-2xl font-bold">
          Taskflow 
        </div>
      </NuxtLink>
      <div class="text-right py-1.5 pr-1">
        <NavBarLogin />
      </div>
    </nav>
  </div>
</template>
