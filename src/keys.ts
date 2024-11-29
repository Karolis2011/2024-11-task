import { InjectionKey, Ref } from "vue";

export type TaskDropZoneInterface = Ref<{
  column: string;
  sort: number;
  distance: number;
}>
export const dropZoneListKey = Symbol('dropZoneList') as InjectionKey<Ref<TaskDropZoneInterface[]>>;
export const bestDropZoneKey = Symbol('bestDropZone') as InjectionKey<Ref<TaskDropZoneInterface | null>>;
export const isDraggingKey = Symbol('isDragging') as InjectionKey<Ref<boolean>>;
