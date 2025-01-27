<template>
  <div class="flex flex-col gap-4 items-center">
    <div class="flex items-center justify-center max-w-[540px] mx-auto">
      <picture>
        <source srcset="/images/no-results.webp" type="image/webp" />

        <img
          src="/images/no-results.png"
          alt="no results"
          width="540"
          height="540"
          decoding="async"
        />
      </picture>
    </div>

    <div class="flex flex-col items-center">
      <h2 class="text-2xl lg:text-3xl font-bold text-gray-500 text-center">
        No todo lists found! <br />
      </h2>
      <p class="text-gray-400 font-semibold text-lg text-center">
        Create your first todo list. Start by clicking on "Add new list"
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
