<template>
  <UModal v-model="isOpen" fullscreen>
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        body: {
          base: 'flex-grow overflow-hidden',
        },
      }"
    >
      <template #header>
        <h2 class="text-xl md:text-2xl font-semibold leading-6">Create note</h2>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          @click="closeModal"
        />
      </template>

      <CreateNote class="max-w-7xl mx-auto h-full" @created="closeModal" />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(true);

const router = useRouter();
const closeModal = () => {
  isOpen.value = false;

  if (window.history.length > 2) {
    router.back();
  } else {
    navigateTo({
      path: '/',
      replace: true,
    });
  }
};
</script>
