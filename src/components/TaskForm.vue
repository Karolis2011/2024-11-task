<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { Task, useTaskStore } from '../store/task';

const dialogEl = useTemplateRef("dialog")

type EditableTask = Omit<Task, 'id' | 'date_created'>

const tasks = useTaskStore()

const openDialog = () => {
  resetForm()
  dialogEl.value?.showModal()
}
const resetForm = () => {
  Object.assign(taskObject.value, getInitialTask())
}

const saveTask = () => {
  tasks.addNewTask(taskObject.value)
  dialogEl.value?.close()
  resetForm()
}

const getInitialTask = (): EditableTask => ({
  title: '',
  current_column: tasks.columns[0] ?? '',
  author_id: tasks.authors.keys().next().value ?? 0,
})
const taskObject = ref<EditableTask>(getInitialTask())


defineExpose({
  openDialog
})
</script>

<template>
  <dialog ref="dialog" class="backdrop:bg-gray-50 backdrop:opacity-75 backdrop-blur-xl p-6 rounded-lg shadow-lg w-96">
    <h2 class="text-lg font-semibold mb-4">Task Form</h2>

    <div class="mb-4">
      <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
      <input type="text" id="title" placeholder="Enter task title" v-model="taskObject.title"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
    </div>

    <div class="mb-4">
      <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
      <select id="status" v-model="taskObject.current_column"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        <option v-for="column in tasks.columns" :value="column">{{ column }}</option>
      </select>
    </div>

    <div class="mb-4">
      <label for="author" class="block text-sm font-medium text-gray-700">Author</label>
      <select id="author" v-model="taskObject.author_id"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        <option value="">Select author</option>
        <option v-for="[id, author] in tasks.authors" :value="id">{{ author.display_name }}</option>
      </select>
    </div>

    <div class="flex justify-end space-x-2">
      <button type="button" @click="dialogEl?.close()"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
        Cancel
      </button>
      <button type="button" @click="saveTask"
        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Create
      </button>
    </div>
  </dialog>
</template>
