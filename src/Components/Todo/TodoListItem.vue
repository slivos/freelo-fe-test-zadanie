<template>
  <div
    ref="listItemRef"
    class="flex flex-col gap-4 bg-sky-50 border border-sky-200 rounded-md p-2 relative overflow-hidden"
  >
    <div class="group flex items-center gap-3">
      <DragDropIcon
        class="todo-list-handle z-10 w-6 h-6 flex-shrink-0 cursor-grab active:cursor-grabbing outline-none stroke-gray-500"
      />

      <div v-if="!edit" class="flex gap-2 justify-between w-full">
        <div v-if="!edit" class="group flex gap-2 select-none">
          <span class="lg:text-xl font-bold text-sky-700 break-all">
            {{ item.title }}</span
          >

          <div
            v-tooltip="'Edit'"
            @click="openEdit"
            class="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity outline-none flex-shrink-0 cursor-pointer w-6 h-6 flex items-center justify-center"
          >
            <EditIcon class="w-4 h-4 stroke-gray-500" />
          </div>
        </div>

        <div
          v-if="!edit"
          @click="deleteList"
          v-tooltip="'Delete'"
          class="outline-none flex-shrink-0 cursor-pointer w-6 h-6 ms-auto flex items-center justify-center"
        >
          <TrashIcon class="w-4 h-4 stroke-red-400" />
        </div>
      </div>

      <textarea
        v-if="edit"
        ref="textarea"
        placeholder="Todo list title"
        v-model="item.title"
        @input="onInput"
        rows="1"
        class="appearance-none min-h-5 flex-grow lg:text-xl font-bold text-sky-700 resize-none overflow-hidden outline-none bg-transparent"
      />

      <div v-if="edit" class="flex flex-col sm:flex-row items-center gap-2">
        <button
          @click="editList"
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

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4 min-h-[30px]" ref="parent">
        <TodoItem
          v-for="task in tasks"
          :key="task.id"
          :item="task"
          :listId="props.item.id"
          @remove-todo="removeTask"
        />
      </div>

      <div>
        <TodoItemAddNew @click="addTask" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TodoListType } from "src/types/todo-lists-type";
import { nextTick, PropType, ref, watch } from "vue";
import EditIcon from "@svg/edit.svg";
import DragDropIcon from "@svg/drag-drop.svg";
import TrashIcon from "@svg/trash.svg";
import TodoItem from "./TodoItem.vue";
import { useTodoListsStore } from "@stores/todo-lists-store";
import TodoItemAddNew from "./TodoItemAddNew.vue";
import { animations } from "@formkit/drag-and-drop";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import type { ParentConfig } from "@formkit/drag-and-drop";
import { uuid } from "vue-uuid";
import { useAutoResize } from "@composables/useAutoResize";

const props = defineProps({
  item: {
    type: Object as PropType<TodoListType>,
    required: true,
  },
});

const todoListsStore = useTodoListsStore();
const { autoResize } = useAutoResize();

// const currentList = ref(todoListsStore.getCurrentTodoList(props.item.id).value);
const tasks = ref(todoListsStore.getTasksRef(props.item.id).value);
const textarea = ref<HTMLElement | null>(null);
const edit = ref(false);
const listItemRef = ref<HTMLElement>();

const config: Partial<ParentConfig<any>> = {
  group: "todoTasks",
  dragHandle: ".todo-task-handle",
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
  longPress: true,
  longPressClass: "border-2 border-emerald-400",
  longPressDuration: 100,
  plugins: [animations()],
};

// Use the drag-and-drop hook with the reactive tasks
const [parent, dragAndDropTasks] = useDragAndDrop(tasks.value, config);

const openEdit = () => {
  edit.value = true;
  nextTick(() => {
    autoResize(textarea.value);
    textarea.value?.focus();
  });

  todoListsStore.saveToHistory(true);
  todoListsStore.action = "update-list";
};

const editList = () => {
  edit.value = false;
  todoListsStore.boxOpen = true;
  todoListsStore.updateTodoList(props.item.id, props.item.title);
  todoListsStore.saveLists();
};

// Delete the current list
const deleteList = () => {
  todoListsStore.removeTodoList(props.item.id);
};

const onInput = () => {
  autoResize(textarea.value);
};

// Add a new task to the current list
const addTask = () => {
  const newTask = {
    id: uuid.v4(),
    title: "New Task",
    completed: false,
  };

  todoListsStore.addTask(props.item.id, newTask);

  nextTick(() => {
    document.body.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  });
};

const removeTask = (taskId: string) => {
  todoListsStore.removeTask(props.item.id, taskId);
};

watch(
  () => todoListsStore.todoLists,
  (newLists) => {
    if (newLists) {
      tasks.value = todoListsStore.getTasksRef(props.item.id).value;
      dragAndDropTasks.value = todoListsStore.getTasksRef(props.item.id).value;
    }
  },
  { deep: true }
);

watch(dragAndDropTasks, (newTasks) => {
  tasks.value = newTasks;

  todoListsStore.setTasks(props.item.id, newTasks);
});
</script>
