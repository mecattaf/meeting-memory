<template>
  <div
    class="h-screen w-full shrink-0 border-r border-gray-200 dark:border-gray-800"
  >
    <div class="flex items-center justify-between px-4 h-14">
      <ULink class="font-bold text-2xl md:text-3xl px-2.5" to="/">
        V<span class="text-primary">Notes</span>
      </ULink>
      <UButton
        icon="i-heroicons-x-mark-20-solid"
        color="gray"
        variant="ghost"
        class="md:hidden"
        @click="$emit('hideDrawer')"
      />
    </div>

    <UVerticalNavigation class="p-4" :links="links" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  links: { label: string; icon: string; to: string; click?: () => void }[];
}>();

defineEmits(['hideDrawer']);
</script>
