<template>
  <header
    class="flex justify-between items-center h-14 shrink-0 px-4 sm:px-6 border-b -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800"
  >
    <h1 class="text-xl md:text-2xl font-semibold">{{ title }}</h1>

    <slot name="actions" />
  </header>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>
