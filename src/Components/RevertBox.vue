<template>
  <div
    class="w-[calc(100%-32px)] max-w-[calc(100%-32px)] sm:min-w-[220px] sm:w-auto flex flex-col items-center lg:items-start gap-3 fixed top-4 lg:bottom-4 lg:top-auto left-4 bg-orange-200 bg-opacity-90 border border-orange-300 rounded-md p-2 pt-6 opacity-0 translate-x-[calc(-100%-16px)] z-20"
    :class="{
      'animate-fadeInOut': todoListsStore.boxOpen,
      '[animation-play-state:paused]': pause,
    }"
    @animationend="todoListsStore.boxOpen = false"
    @mouseenter="onMouseEnter"
    @mouseleave="pause = false"
  >
    <button
      class="absolute top-1 right-1 w-5 h-5 cursor-pointer select-none inline-flex items-center justify-center focus:outline-none"
      @click="todoListsStore.boxOpen = false"
    >
      <CloseIcon class="w-4 h-4 flex-shrink-0 stroke-orange-500" />
    </button>

    <h3 class="text-sm font-semibold text-gray-500 text-center lg:text-left">
      Want to {{ title }}?
    </h3>

    <button
      class="w-full cursor-pointer select-none inline-flex items-center justify-center px-2 py-2 gap-2 bg-orange-100 hover:bg-transparent rounded-md focus:outline-none"
      @click="todoListsStore.revert()"
    >
      <ArrowLeftIcon class="w-4 h-4 flex-shrink-0 stroke-orange-500" />
      <span class="font-semibold text-xs text-orange-500">Revert change</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTodoListsStore } from "@stores/todo-lists-store";
import ArrowLeftIcon from "@svg/arrow-left.svg";
import CloseIcon from "@svg/close.svg";
import { computed, ref } from "vue";

const todoListsStore = useTodoListsStore();

const pause = ref(false);

const title = computed(() => {
  if (todoListsStore.action === "update-list") {
    return "edit list";
  }

  if (todoListsStore.action === "remove-list") {
    return "remove list";
  }

  if (todoListsStore.action === "add-task") {
    return "add new task";
  }

  if (todoListsStore.action === "update-task") {
    return "edit task";
  }

  if (todoListsStore.action === "remove-task") {
    return "remove task";
  }
});

const onMouseEnter = () => {
  pause.value = true;
  todoListsStore.boxOpen = true;
};
</script>
