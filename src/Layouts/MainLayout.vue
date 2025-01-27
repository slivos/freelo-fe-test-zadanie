<template>
  <div class="flex flex-col min-h-screen bg-white">
    <!-- Main Content -->
    <main class="flex-grow relative">
      <div
        class="container max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <slot />
      </div>
    </main>
  </div>
</template>
