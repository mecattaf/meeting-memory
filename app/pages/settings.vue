<template>
  <UCard>
    <template #header>
      <div>
        <h2 class="text-base md:text-lg font-semibold leading-6">
          Post Processing
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure automatic post-processing of recording transcriptions using
          AI models. Changes will be saved automatically.
        </p>
      </div>
    </template>

    <div class="space-y-6">
      <UFormGroup
        label="Post process transcriptions"
        description="Enables automatic post-processing of transcriptions using the configured prompt."
        :ui="{ container: 'mt-2' }"
      >
        <template #hint>
          <UToggle v-model="settings.postProcessingEnabled" />
        </template>
      </UFormGroup>

      <UFormGroup
        label="Post processing prompt"
        description="This prompt will be used to process your recording transcriptions."
        :ui="{ container: 'mt-2' }"
      >
        <UTextarea
          v-model="settings.postProcessingPrompt"
          :disabled="!settings.postProcessingEnabled"
          :rows="5"
          placeholder="Enter your prompt here..."
          class="w-full"
        />
      </UFormGroup>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { useStorageAsync } from '@vueuse/core';

interface Settings {
  postProcessingEnabled: boolean;
  postProcessingPrompt: string;
}

const defaultPostProcessingPrompt = `The following text is a transcription of an audio recording. Please review the text and make any necessary corrections to ensure the accuracy of the transcription. Pay close attention to:

1. Spelling and grammar errors
2. Missed or incorrect words
3. Punctuation errors
4. Formatting issues

The goal is to produce a clean, error-free transcript that accurately represents the original audio recording.`;

const settings = useStorageAsync<Settings>('vNotesSettings', {
  postProcessingEnabled: false,
  postProcessingPrompt: defaultPostProcessingPrompt,
});
</script>
