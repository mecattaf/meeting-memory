<template>
  <div
    class="h-screen w-64 shrink-0 border-r border-gray-200 dark:border-gray-800"
  >
    <div class="flex items-center px-4 h-14">
      <ULink class="font-bold text-2xl md:text-3xl px-2.5" to="/">
        V<span class="text-primary">Notes</span>
      </ULink>
    </div>

    <UVerticalNavigation class="p-4" :links="links" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ links: { label: string; icon: string; to: string }[] }>();
</script>
