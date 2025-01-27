import { TaskType } from "./task-type";

type TodoListsType = TodoListType[];

type TodoListType = {
  id: string;
  title: string;
  tasks: TaskType[];
};

export type { TodoListsType, TodoListType };
