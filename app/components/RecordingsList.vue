<template>
  <div class="space-y-2">
    <div
      v-for="recording in recordings"
      :key="recording.id"
      class="flex items-center gap-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      <audio :src="recording.url" controls class="w-full h-10" />

      <UTooltip text="Remove recording">
        <UButton
          icon="i-heroicons-trash"
          color="red"
          variant="ghost"
          size="sm"
          @click="$emit('delete', recording)"
        />
      </UTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recording } from '~~/types';

defineProps<{ recordings: Recording[] }>();

defineEmits<{
  (e: 'delete', recording: Recording): void;
}>();
</script>
