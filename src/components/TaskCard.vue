<script setup lang="ts">
import { computed, inject, ref, StyleValue, useTemplateRef } from 'vue';
import { Task, useTaskStore } from '../store/task';
import { useDraggable, useElementBounding } from '@vueuse/core';
import { bestDropZoneKey, isDraggingKey } from '../keys';

const tasks = useTaskStore()
const props = defineProps<{
  task: Task
}>()

const cardEl = useTemplateRef("card")

const author = computed(() => tasks.authors.get(props.task.author_id))
const bestDropZone = inject(bestDropZoneKey)
const isDraggingGlobal = inject(isDraggingKey)
const { x, y, width, height } = useElementBounding(cardEl)
const initialSize = ref({ width: 0, height: 0, x: 0, y: 0 })
const { style, isDragging } = useDraggable(cardEl, {
  onStart: () => {
    Object.assign(initialSize.value, { width: width.value, height: height.value, x: x.value, y: y.value })
    if (isDraggingGlobal) {
      isDraggingGlobal.value = true
    }
  },
  onEnd: () => {
    if (bestDropZone?.value) {
      tasks.updateTaskColumn(props.task.id, bestDropZone.value.value.column)
      tasks.taskSortOrder.set(props.task.id, bestDropZone.value.value.sort)
    }
    if (isDraggingGlobal) {
      isDraggingGlobal.value = false
    }
  }
})
const fakeCardStyle = computed<StyleValue>(() => [{ height: initialSize.value.height + 'px', width: initialSize.value.width + 'px' }])
</script>

<template>
  <Teleport to="body" :disabled="!isDragging">
    <div ref="card" class="bg-slate-50 rounded p-2 cursor-grab select-none my-1" :class="{ 'cursor-grabbing': isDragging }"
      :style="[isDragging ? style : null, isDragging ? { position: 'fixed', width: initialSize.width + 'px' } : null]">
      <p>{{ task.title }}</p>
      <p class="text-sm"><span class="font-bold">{{ author?.display_name }}</span> at <span class="font-bold italic">{{
        task.date_created }}</span></p>
    </div>
  </Teleport>
  <div v-if="isDragging" class="rounded border-dashed border-2 border-orange-300" :style="fakeCardStyle"></div>
</template>
