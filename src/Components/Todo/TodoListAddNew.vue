<template>
  <button
    @click="addNewList"
    class="w-full lg:w-auto cursor-pointer select-none inline-flex items-center justify-center px-2 py-2 gap-2 bg-transparent hover:bg-sky-200 rounded-md focus:outline-none"
  >
    <AddIcon class="w-5 h-5 flex-shrink-0 stroke-sky-600" />
    <span class="font-semibold text-sm text-sky-600">Add new list</span>
  </button>
</template>

<script setup lang="ts">
import AddIcon from "@svg/add.svg";
import { useTodoListsStore } from "@stores/todo-lists-store";
import { uuid } from "vue-uuid";
import { nextTick } from "vue";

const todoListsStore = useTodoListsStore();

const addNewList = () => {
  const newList = {
    id: uuid.v4(),
    title: "Title of todo list",
    tasks: [],
  };

  todoListsStore.addTodoList(newList);
  nextTick(() => {
    document.body.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  });
};
</script>
