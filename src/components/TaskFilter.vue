<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { Author, AuthorId, Task } from '../store/task';
import { useOffsetPagination, watchDebounced, watchImmediate } from '@vueuse/core';


const dialogEl = useTemplateRef("authorFilterDialog")

const props = defineProps<{
  tasks: Task[]
  authors: Author[]
}>();

const emits = defineEmits<{
  'update:modelValue': [value: Task[]]
}>()

const searchText = ref('');
const authorFilter = ref<AuthorId[]>([]);

watchDebounced(() => [searchText.value, authorFilter.value, props.tasks], () => {
  const filteredTasks = props.tasks.filter((task) => {
    if (searchText.value.length > 0 && !task.title.toLowerCase().includes(searchText.value.toLowerCase())) {
      return false
    }
    if (authorFilter.value.length > 0 && !authorFilter.value.includes(task.author_id)) {
      return false
    }
    return true
  })
  emits('update:modelValue', filteredTasks)
}, { immediate: true, debounce: 250, maxWait: 1000 })


const { next, prev, isFirstPage, isLastPage, pageCount, currentPage, currentPageSize } = useOffsetPagination({
  total: () => props.authors.length,
  pageSize: 10,

})

const paginatedAuthors = computed(() => {
  return props.authors.slice((currentPage.value - 1) * currentPageSize.value, currentPage.value * currentPageSize.value)
})

const openDialog = () => {
  currentPage.value = 1
  dialogEl.value?.showModal()
}


</script>

<template>
  <div>
    <div>
      <label for="filter">Search:</label>
      <input type="text" id="filter" v-model="searchText" placeholder="Search task descriptions..."
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
    </div>
    <div>
      <label>Filter by author:</label>
      <div @click="openDialog()"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer">
        <template v-if="authorFilter.length == 0"><span class="italic text-gray-500">No authors being filtered, click to
            select.</span></template>
        <template v-else>
          <template v-for="authorId, i in authorFilter">
            <span class="italic">{{ props.authors.find((author) => author.id === authorId)?.display_name }}</span>
            <template v-if="i < authorFilter.length - 2">, </template>
            <template v-else-if="i < authorFilter.length - 1"> and </template>
          </template>
        </template>
      </div>
    </div>
    <dialog ref="authorFilterDialog"
      class="backdrop:bg-gray-50 backdrop:opacity-75 backdrop-blur-xl p-6 rounded-lg shadow-lg w-96">
      <ul>
        <li v-for="author in paginatedAuthors">
          <input type="checkbox" :value="author.id" v-model="authorFilter"/><span class="ml-2">{{ author.display_name }}</span>
        </li>
      </ul>

      <div class="flex justify-between mt-4">
        <button :disabled="isFirstPage" @click="prev"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-200">
          Previous
        </button>
        <button v-for="p in pageCount" :disabled="currentPage === p" @click="currentPage = p"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-200">
          {{ p }}
        </button>
        <button :disabled="isLastPage" @click="next"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-200">
          Next
        </button>
      </div>

      <div class="flex justify-end space-x-2 mt-4">
        <button type="button" @click="dialogEl?.close()"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Confirm
        </button>
      </div>
    </dialog>
  </div>
</template>
