<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <div class="h-screen flex flex-col md:flex-row">
    <!-- The App Sidebar -->
    <AppSidebar :links="links" />

    <div class="flex-1 h-full min-w-0 bg-gray-50 dark:bg-gray-950">
      <!-- The App Header -->
      <AppHeader :title="title">
        <template #actions v-if="route.path === '/'">
          <UButton icon="i-heroicons-plus" @click="navigateTo('/new')">
            New Note
          </UButton>
        </template>
      </AppHeader>

      <!-- Main Page Content -->
      <main class="p-4 sm:p-6 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <NuxtPage />
      </main>
    </div>
  </div>
  <UNotifications />
</template>

<script setup lang="ts">
const links = [
  { label: 'Notes', icon: 'i-heroicons-document-text', to: '/' },
  { label: 'Settings', icon: 'i-heroicons-cog', to: '/settings' },
];

const route = useRoute();
const title = computed(() => {
  const activeLink = links.find((l) => l.to === route.path);
  if (activeLink) {
    return activeLink.label;
  }

  return '';
});
</script>
