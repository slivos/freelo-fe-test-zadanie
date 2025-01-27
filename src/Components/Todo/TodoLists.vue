<template>
  <section class="pt-6 sm:pt-10 pb-14">
    <header
      class="mb-6 lg:mb-10 bg-sky-200 bg-opacity-90 border border-sky-400 rounded-md p-4"
    >
      <h2 class="text-3xl md:text-4xl font-bold text-sky-500">Tasks</h2>

      <p class="mt-1 text-lg text-gray-500">Stay organized and inspired ✨</p>
    </header>

    <div class="flex flex-col sm:flex-row gap-4 justify-between mb-6">
      <div class="order-1 sm:order-none" v-if="!filteredLists.length">
        <TodoListAddNew />
      </div>

      <label
        v-if="filteredLists.length"
        class="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 ms-auto"
        for="search"
      >
        <span class="font-semibold text-sm">Search todo</span>
        <input
          id="search"
          type="text"
          placeholder="Search todo name"
          v-model.trim="search"
          class="py-1 px-3 font-semibold focus:outline-none appearance-none bg-gray-50 border-2 border-gray-200 focus:border-sky-300 rounded"
        />
      </label>
    </div>

    <div
      class="flex flex-col gap-4 bg-gray-50 p-4 rounded-md"
      :class="{
        'p-8 lg:p-12': !filteredLists.length,
      }"
    >
      <div
        v-show="filteredLists.length"
        class="flex flex-col gap-4"
        ref="parent"
      >
        <TodoListItem
          v-for="list in filteredLists"
          :key="list.id"
          :item="list"
          :class="{ hidden: list.hidden }"
        />
      </div>

      <div v-if="filteredLists.length && !allHidden">
        <TodoListAddNew />
      </div>

      <TodoNoResults v-show="allHidden" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useTodoListsStore } from "@stores/todo-lists-store";
import TodoListItem from "./TodoListItem.vue";
import TodoListAddNew from "./TodoListAddNew.vue";
import { animations } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import type { ParentConfig } from "@formkit/drag-and-drop";
import { ref, computed, watch } from "vue";
import TodoNoResults from "./TodoNoResults.vue";

const todoListsStore = useTodoListsStore();

const search = ref("");
let isListVisible: boolean = false;

const filteredLists = computed(() =>
  todoListsStore.todoLists.map((list) => {
    const term = search.value.toLowerCase().trim();
    isListVisible = !term || list.title.toLowerCase().includes(term);

    // Check visibility of tasks within each list
    const visibleTasks = list.tasks.map((task) => {
      return {
        ...task,
        hidden: term && !task.title.toLowerCase().includes(term), // Hide tasks not matching the search
      };
    });

    return {
      ...list,
      hidden: !isListVisible && visibleTasks.every((task) => task.hidden), // Hide list if no tasks match
      tasks: visibleTasks,
    };
  })
);

// Check if all results are hidden
const allHidden = computed(() => {
  // Return true if all lists are hidden (based on their tasks visibility)
  return filteredLists.value.every((list) => list.hidden);
});

const config: Partial<ParentConfig<any>> = {
  group: "todoLists",
  dropZoneClass: "bg-opacity-0",
  dragHandle: ".todo-list-handle",
  handleNodeDragenter: () => {
    if (parent.value) {
      Array.from(parent.value.children).forEach((child) => {
        const childEl = child as HTMLElement;

        childEl.draggable = true;
      });
    }
  },
  onTransfer: () => {
    if (parent.value) {
      Array.from(parent.value.children).forEach((child) => {
        const childEl = child as HTMLElement;

        childEl.draggable = true;
      });
    }
  },
  plugins: [animations()],
};

const [parent, lists] = useDragAndDrop(todoListsStore.todoLists, config);

watch(
  () => todoListsStore.todoLists,
  (newLists) => {
    if (newLists) {
      lists.value = newLists;
    }
  }
);

// Watch for the drag-and-drop list changes and update the store accordingly
watch(lists, (newLists) => {
  todoListsStore.todoLists = newLists;
  todoListsStore.saveLists(); // Persist changes
});
</script>
