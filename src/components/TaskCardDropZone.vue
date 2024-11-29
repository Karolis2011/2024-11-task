<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, toRefs, useTemplateRef } from 'vue';
import { bestDropZoneKey, dropZoneListKey, isDraggingKey } from '../keys';
import { refThrottled, useMouseInElement } from '@vueuse/core';
import { Column } from '../store/task';

const props = defineProps<{
  column: Column,
  sort: number
}>()
const { column, sort } = toRefs(props)

const selfEl = useTemplateRef("self")
const { x, y, elementPositionX, elementPositionY, elementHeight, elementWidth } = useMouseInElement(selfEl)

const distance = refThrottled(computed(() =>
  (elementPositionX.value + elementWidth.value / 2 - x.value) ** 2 +
  (elementPositionY.value + elementHeight.value / 2 - y.value) ** 2
), 250)

const selfPublic = ref({
  column: column,
  sort: sort,
  distance: distance
})

const dropZoneList = inject(dropZoneListKey)
const bestDropZone = inject(bestDropZoneKey)
const isDragging = inject(isDraggingKey)
const isBestDropZone = computed(() => bestDropZone?.value?.value === selfPublic.value)
onMounted(() => {
  dropZoneList?.value.push(selfPublic)
})

onUnmounted(() => {
  if (dropZoneList?.value) {
    dropZoneList.value = dropZoneList.value.filter((dropZone) => dropZone !== selfPublic)
  }
})
</script>

<template>
  <div ref="self" :class="{'transition-[height]': true, 'h-0 bg-transparent': !isBestDropZone, 'h-8 bg-green-100': isBestDropZone && isDragging,}">
  </div>
</template>
