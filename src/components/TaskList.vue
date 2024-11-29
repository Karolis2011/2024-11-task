<script setup lang="ts">
import { Column, Task, useTaskStore } from '../store/task';
import TaskCard from './TaskCard.vue';
import TaskCardDropZone from './TaskCardDropZone.vue';

const taskStore = useTaskStore()
const props = defineProps<{
  column: Column,
  tasks: Task[]
}>()

const getSort = (i: number) => {
  if (i === -1) {
    const nextSort = props.tasks[0] ? taskStore.taskSortOrder.get(props.tasks[0].id) ?? 0 : 0
    return nextSort - 1
  }
  const currentSort = taskStore.taskSortOrder.get(props.tasks[i].id) ?? 0
  const nextTaskId = props.tasks[i + 1]?.id
  const nextSort = nextTaskId ? taskStore.taskSortOrder.get(nextTaskId) ?? 0 : currentSort + 1
  return (currentSort + nextSort) / 2
}

</script>

<template>
  <div class="bg-slate-200 m-2 p-2 rounded" ref="mainDiv">
    <h3 class="mb-3 text-xl font-bold">{{ column }}</h3>
    <div class="flex flex-col">
      <TaskCardDropZone :column="column" :sort="getSort(-1)" />
      <template v-for="task, i in tasks">
        <TaskCard :task="task" />
        <TaskCardDropZone :column="column" :sort="getSort(i)" />
      </template>
    </div>
  </div>
</template>
