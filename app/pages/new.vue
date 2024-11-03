<template>
  <UModal v-model="isOpen" fullscreen>
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'grow',
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl md:text-2xl font-semibold leading-6">
            Create note
          </h2>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="closeModal"
          />
        </div>
      </template>

      <NewNote />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(true);

const router = useRouter();
const closeModal = () => {
  isOpen.value = false;
  console.log('window.history.length', window.history.length);
  if (router.getRoutes().length > 2) {
    router.back();
  } else {
    navigateTo({
      path: '/',
      replace: true,
    });
  }
};
</script>
