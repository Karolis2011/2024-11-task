<script setup lang="ts">
import { provide, Ref, ref, useTemplateRef } from 'vue';
import TaskList from './components/TaskList.vue';
import { Task, useSortedTaskColumns, useTaskStore } from './store/task'
import { bestDropZoneKey, dropZoneListKey, isDraggingKey, TaskDropZoneInterface } from './keys';
import TaskForm from './components/TaskForm.vue';
import { useIntervalFn, watchImmediate } from '@vueuse/core';
import TaskFilter from './components/TaskFilter.vue';

const tasks = useTaskStore()

const formRef = useTemplateRef("form")
const taskCardDropZones = ref<TaskDropZoneInterface[]>([])
const bestDropZone = ref<TaskDropZoneInterface | null>(null)
const { pause: pauseBestDropZoneCalc, resume: resumeBestZoneCalc } = useIntervalFn(() => {
  bestDropZone.value = taskCardDropZones.value.reduce((acc, dropZone) => {
    if (!acc || dropZone.value.distance < acc.value.distance) {
      return dropZone
    }
    return acc
  }, null as TaskDropZoneInterface | null) as TaskDropZoneInterface | null
}, 250, { immediate: false })
const isDragging = ref(false)
watchImmediate(() => isDragging.value, (newVal) => {
  if (newVal) {
    resumeBestZoneCalc()
  } else {
    pauseBestDropZoneCalc()
  }
})
provide(dropZoneListKey, taskCardDropZones)
provide(bestDropZoneKey, bestDropZone as Ref<TaskDropZoneInterface | null>)
provide(isDraggingKey, isDragging)

const filteredTasks = ref([] as Task[])
const taskColumns = useSortedTaskColumns(filteredTasks)
</script>

<template>
  <div>
    <template v-if="tasks.columns.length == 0">
      <button @click="() => tasks.loadTasks()"
        class="m-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Load
        tasks</button>
    </template>
    <template v-else>
      <button @click="() => formRef?.openDialog()"
        class="m-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add new task</button>
      <TaskFilter :tasks="tasks.taskList" :authors="tasks.authorList" v-model="filteredTasks" class="p-2" />
      <div class="flex">
        <TaskList class="flex-1" v-for="taskColumn in taskColumns" :column="taskColumn[0]" :tasks="taskColumn[1]" />
      </div>
    </template>
    <TaskForm ref="form" />

  </div>
</template>

<style lang="css">
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
