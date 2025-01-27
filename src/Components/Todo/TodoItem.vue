<template>
  <div
    class="group p-1 flex items-center gap-3 rounded-md border bg-opacity-60 relative overflow-hidden"
    :class="{
      ' bg-gray-200  border-gray-500': item.completed,
      'bg-mint-green  border-emerald-300': !item.completed,
    }"
  >
    <DragDropIcon
      class="todo-task-handle z-10 w-5 h-5 flex-shrink-0 cursor-grab active:cursor-grabbing outline-none"
    />

    <div v-if="!edit" class="group flex items-center gap-2 select-none pr-14">
      <input
        type="checkbox"
        :checked="item.completed"
        v-model="item.completed"
        @change="setCompleted"
        class="relative peer cursor-pointer focus:outline-none shrink-0 appearance-none w-4 h-4 bg-gray-100 checked:bg-sky-300 border-2 border-gray-300 checked:border-sky-300 rounded"
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="absolute pointer-events-none w-4 h-4 hidden peer-checked:block"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>

      <span
        class="text-sm font-semibold text-gray-500 peer-checked:line-through break-all"
      >
        {{ item.title }}</span
      >
    </div>

    <div
      class="absolute right-1 top-2/4 -translate-y-2/4 flex gap-2 items-start"
    >
      <div
        v-if="!edit"
        v-tooltip="'Edit'"
        @click="openEdit"
        class="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity outline-none flex-shrink-0 cursor-pointer w-5 h-5 ms-auto flex items-center justify-center"
      >
        <EditIcon class="w-4 h-4 stroke-gray-500" />
      </div>

      <div
        v-if="!edit"
        @click="deleteItem"
        v-tooltip="'Delete'"
        class="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity outline-none flex-shrink-0 cursor-pointer w-5 h-5 flex items-center justify-center"
      >
        <TrashIcon class="w-4 h-4 stroke-red-400" />
      </div>
    </div>

    <textarea
      v-if="edit"
      ref="textarea"
      placeholder="Task title"
      v-model="item.title"
      @input="onInput"
      rows="1"
      class="appearance-none flex-grow text-sm font-semibold text-gray-500 resize-none overflow-hidden outline-none bg-transparent"
    />

    <div v-if="edit" class="flex flex-col sm:flex-row items-center gap-2">
      <button
        @click="editItem"
        class="px-4 py-1 text-xs text-sky-500 font-semibold rounded-md border border-sky-500 hover:text-white hover:bg-sky-500 hover:border-transparent focus:outline-none"
      >
        Save
      </button>

      <button
        @click="edit = false"
        class="px-4 py-1 text-xs text-gray-600 font-semibold rounded-md bg-transparent border border-transparent hover:border-gray-600 focus:outline-none"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import DragDropIcon from "@svg/drag-drop.svg";
import EditIcon from "@svg/edit.svg";
import { TaskType } from "src/types/task-type";
import { ref, PropType, nextTick } from "vue";
import { useTodoListsStore } from "@stores/todo-lists-store";
import TrashIcon from "@svg/trash.svg";
import { useAutoResize } from "@composables/useAutoResize";

const props = defineProps({
  item: {
    type: Object as PropType<TaskType>,
    required: true,
  },
  listId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["remove-todo"]);

const todoListsStore = useTodoListsStore();
const { autoResize } = useAutoResize();

const textarea = ref<HTMLElement | null>(null);
const edit = ref(false);

const openEdit = () => {
  edit.value = true;
  nextTick(() => {
    autoResize(textarea.value);
    textarea.value?.focus();
  });

  todoListsStore.saveToHistory(true);
  todoListsStore.action = "update-task";
};

const deleteItem = () => {
  emit("remove-todo", props.item.id);
};

const editItem = () => {
  edit.value = false;
  todoListsStore.boxOpen = true;
  todoListsStore.updateTask(
    props.listId,
    props.item.id,
    props.item.title,
    props.item.completed
  );
  todoListsStore.saveLists();
};

const onInput = () => {
  autoResize(textarea.value);
};

const setCompleted = (e: Event) => {
  const target = e.target as HTMLInputElement;

  todoListsStore.updateTask(
    props.listId,
    props.item.id,
    props.item.title,
    target.checked
  );
  todoListsStore.saveLists();
};
</script>
