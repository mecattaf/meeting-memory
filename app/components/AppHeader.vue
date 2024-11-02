<template>
  <header
    class="flex items-center h-14 px-4 bg-gray-50/75 dark:bg-gray-950/75 backdrop-blur border-b -mb-px sticky top-0 z-50 border-gray-200 dark:border-gray-800"
  >
    <h1 class="text-xl md:text-2xl">{{ title }}</h1>
  </header>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>
