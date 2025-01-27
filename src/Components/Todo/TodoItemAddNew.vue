<template>
  <button
    class="w-full lg:w-auto cursor-pointer select-none inline-flex items-center justify-center px-2 py-2 gap-2 bg-transparent hover:bg-mint-green rounded-md focus:outline-none"
  >
    <AddIcon class="w-5 h-5 flex-shrink-0 stroke-emerald-500" />
    <span class="font-semibold text-sm text-emerald-500">Add new task</span>
  </button>
</template>

<script setup lang="ts">
import AddIcon from "@svg/add.svg";
</script>
