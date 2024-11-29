import { defineStore } from "pinia";
import { computed, MaybeRef, Ref, ref, toRef, watchEffect } from "vue";

export type Column = string
export type AuthorId = number
export type Author = {
  id: AuthorId,
  display_name: string,
}
export type TaskId = number
export type Task = {
  id: TaskId,
  title: string,
  author_id: number,
  date_created: string,
  current_column: Column,
}

type JSONFileStructure = {
  columns: Column[],
  authors: Author[],
  tasks: Task[],
}

export const useTaskStore = defineStore('task', () => {

  const columns = ref<Column[]>([])
  const authors = ref(new Map<AuthorId, Author>())
  const tasks = ref(new Map<TaskId, Task>())
  const taskSortOrder = ref(new Map<TaskId, number>())

  const loadTasks = async () => {
    const response = await fetch('frontend-task-data.json')
    const data: JSONFileStructure = await response.json()

    columns.value.push(...data.columns)
    data.authors.forEach(author => authors.value.set(author.id, author))
    data.tasks.forEach(task => tasks.value.set(task.id, task))
    tasks.value.forEach((task, taskId) => taskSortOrder.value.set(taskId, task.id))
  }

  const updateTaskColumn = async (taskId: TaskId, newColumn: Column) => {
    const task = tasks.value.get(taskId)
    if (task && columns.value.includes(newColumn) && task.current_column !== newColumn) {
      // Do api call here to set task column and if it succeeds, update the store
      await Promise.resolve()
      task.current_column = newColumn
    }
  }

  const addNewTask = async (task: Omit<Task, 'id' | 'date_created'>) => {
    const newTask: Task = {
      ...task,
      // We would not assign id here, as it would be done on backend
      id: [...tasks.value.keys()].reduce((max, key) => Math.max(max, key), 0) + 1,
      date_created: new Date().toISOString().split('T')[0],
    }
    // Call to API to create new task
    await Promise.resolve()
    tasks.value.set(newTask.id, newTask)
    taskSortOrder.value.set(newTask.id, newTask.id)
  }

  const taskList = computed(() => [...tasks.value.values()])
  const authorList = computed(() => [...authors.value.values()])

  return { columns, authors, tasks, taskSortOrder, loadTasks, updateTaskColumn, addNewTask, taskList, authorList }
})

export const useSortedTaskColumns = (tasks: MaybeRef<Task[]>): Ref<Map<Column, Task[]>> => {
  const taskColumns = ref(new Map<Column, Task[]>())
  const taskStore = useTaskStore()
  watchEffect(() => {
    taskColumns.value.clear()
    taskStore.columns.forEach(column => taskColumns.value.set(column, []))

    const tasksRef = toRef(tasks)
    tasksRef.value.forEach(task => {
      const column = task.current_column
      taskColumns.value.get(column)?.push(task)
    })
    taskColumns.value.forEach((tasks) => {
      tasks.sort((a, b) => taskStore.taskSortOrder.get(a.id)! - taskStore.taskSortOrder.get(b.id)!)
    })
  })
  return taskColumns
}
