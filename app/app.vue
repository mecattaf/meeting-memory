<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <div class="flex flex-col md:flex-row">
    <!-- The App Sidebar -->
    <AppSidebar :links="links" />

    <div class="flex flex-col flex-1">
      <!-- The App Header -->
      <AppHeader :title="title" />

      <!-- Main Page Content -->
      <main class="bg-gray-50 dark:bg-gray-950 flex-1">
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
