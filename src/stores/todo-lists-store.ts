import { defineStore } from "pinia";
import { TaskType } from "src/types/task-type";
import { TodoListsType, TodoListType } from "src/types/todo-lists-type";
import { ref } from "vue";

export const useTodoListsStore = defineStore("todo-lists", () => {
  const todoLists = ref<TodoListsType>(
    JSON.parse(localStorage.getItem("todo_lists")!) || []
  );

  // History stack to track changes for undo
  const history = ref<TodoListsType[]>([]);
  const action = ref("");
  const boxOpen = ref(false);

  const saveToHistory = (notOpenBox?: boolean) => {
    // Push a deep copy of the current state to history
    history.value.push(JSON.parse(JSON.stringify(todoLists.value)));

    if (notOpenBox) {
      return;
    }

    // Reset boxOpen to retrigger animation
    boxOpen.value = false;
    setTimeout(() => {
      boxOpen.value = true; // Reopen the box with the new item
    }, 0); // Timeout ensures DOM updates between closing and reopening
  };

  const revert = () => {
    if (history.value.length > 0) {
      const previousState = history.value.pop();
      if (previousState) {
        todoLists.value = previousState;
        saveLists(); // Save the reverted state to localStorage
        boxOpen.value = false;
      }
    }
  };

  const saveLists = () => {
    localStorage.setItem("todo_lists", JSON.stringify(todoLists.value));
  };

  const getCurrentTodoList = (listId: string) => {
    const list = todoLists.value.find((list) => list.id === listId);

    if (!list) return ref(null); // Return an empty ref if the todolist doesn't exist
    return ref(list); // Return the todolist as a ref
  };

  // Action to get a ref for tasks of a specific todolist
  const getTasksRef = (listId: string) => {
    const list = todoLists.value.find((list) => list.id === listId);
    if (!list) return ref([]); // Return an empty ref if the todolist doesn't exist
    return ref(list.tasks); // Return the tasks as a ref
  };

  const setTasks = (listId: string, newTasks: TaskType[]) => {
    const list = todoLists.value.find((list) => list.id === listId);

    if (list) {
      list.tasks = newTasks; // Replace tasks in the todolist
    }

    saveLists();
  };

  // Actions to manage todolists
  const addTodoList = (newList: TodoListType) => {
    todoLists.value.push(newList);
    saveLists();
  };

  const updateTodoList = (id: string, title: string) => {
    const updatedLists = todoLists.value.map((list) => {
      if (list.id === id) {
        return {
          ...list,
          title: title, // Update only the title of this list
        };
      }
      return list; // Leave other lists unchanged
    });

    action.value = "update-list";
    todoLists.value = updatedLists;
  };

  const removeTodoList = (id: string) => {
    const listExists = todoLists.value.some((list) => list.id === id);

    if (listExists) {
      saveToHistory();
      action.value = "remove-list";
      todoLists.value = todoLists.value.filter((list) => list.id !== id);
      saveLists();
    }
  };

  // Actions to manage tasks within a specific todolist
  const addTask = (listId: string, newTask: TaskType) => {
    const list = todoLists.value.find((list) => list.id === listId);

    if (list) {
      saveToHistory();
      action.value = "add-task";
      list.tasks.push(newTask);
      saveLists();
    }
  };

  // Action to update a task in the list
  const updateTask = (
    listId: string,
    taskId: string,
    title?: string,
    completed?: boolean
  ) => {
    if (!title || completed === undefined) return;

    const updatedLists = todoLists.value.map((list) => {
      if (list.id === listId) {
        const updatedTasks = list.tasks.map((taskItem) => {
          if (taskItem.id === taskId) {
            return {
              ...taskItem,
              title: title,
              completed: completed,
            };
          }
          return taskItem;
        });

        return {
          ...list,
          tasks: updatedTasks,
        };
      }
      return list;
    });

    action.value = "update-task";
    todoLists.value = updatedLists;
  };

  const removeTask = (listId: string, taskId: string) => {
    const list = todoLists.value.find((list) => list.id === listId);

    if (list) {
      const taskExists = list.tasks.some((task) => task.id === taskId);

      if (taskExists) {
        saveToHistory();
        action.value = "remove-task";
        list.tasks = list.tasks.filter((task) => task.id !== taskId);

        if (!list.tasks.length) {
          removeTodoList(listId); // Optionally remove empty lists
        }
        saveLists();
      }
    }
  };

  return {
    todoLists,
    history,
    action,
    boxOpen,
    revert,
    saveToHistory,
    getCurrentTodoList,
    getTasksRef,
    setTasks,
    saveLists,
    addTodoList,
    updateTodoList,
    removeTodoList,
    addTask,
    updateTask,
    removeTask,
  };
});
