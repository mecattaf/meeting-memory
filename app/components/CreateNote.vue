<template>
  <div class="flex flex-col">
    <div class="flex flex-col h-full md:flex-row md:gap-x-6">
      <div class="flex-1 flex flex-col">
        <div class="md:hidden mb-4">
          <RecordingsList
            :recordings="recordings"
            @delete="deleteRecording"
            class="max-h-40 overflow-y-auto"
          />
        </div>

        <UCard
          :ui="{ base: 'h-full flex flex-col', body: { base: 'flex-grow' } }"
        >
          <template #header>
            <h3
              class="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300"
            >
              Note transcript
            </h3>
          </template>
          <UTextarea
            v-model="note"
            placeholder="Type your note or use voice recording..."
            size="lg"
            autofocus
            :disabled="loading || isTranscribing || state.isRecording"
            :rows="12"
            :maxrows="20"
          />
        </UCard>
      </div>

      <UCard
        class="hidden md:flex md:flex-col md:h-full w-96 shrink-0"
        :ui="{ body: { base: 'flex-grow' } }"
      >
        <template #header>
          <h3
            class="text-base md:text-lg font-medium text-gray-600 dark:text-gray-300"
          >
            Note recordings
          </h3>

          <UTooltip
            :text="state.isRecording ? 'Stop Recording' : 'Start Recording'"
          >
            <UButton
              :icon="
                state.isRecording
                  ? 'i-heroicons-stop-circle'
                  : 'i-heroicons-microphone'
              "
              :color="state.isRecording ? 'red' : 'primary'"
              :loading="isTranscribing"
              @click="toggleRecording"
            />
          </UTooltip>
        </template>

        <AudioVisualizer
          v-if="state.isRecording"
          class="w-full h-16 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2"
          :audio-data="state.audioData"
          :data-update-trigger="state.updateTrigger"
        />

        <div
          v-else-if="isTranscribing"
          class="flex items-center justify-center h-16 gap-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2 text-gray-500 dark:text-gray-400"
        >
          <UIcon
            name="i-heroicons-arrow-path-20-solid"
            class="w-6 h-6 animate-spin"
          />
          Transcribing...
        </div>

        <RecordingsList :recordings="recordings" @delete="deleteRecording" />

        <div
          v-if="!recordings.length"
          class="h-full flex items-center justify-center text-gray-500 dark:text-gray-400"
        >
          No recordings...
        </div>
      </UCard>
    </div>
    <UDivider class="my-4 sm:my-6" />
    <div class="flex justify-end gap-x-4">
      <UButton
        icon="i-heroicons-trash"
        color="gray"
        size="lg"
        variant="ghost"
        :disabled="loading"
        @click="clearNote"
      >
        Clear
      </UButton>
      <UButton
        icon="i-heroicons-cloud-arrow-up"
        size="lg"
        :loading="loading"
        :disabled="!note.trim() && !state.isRecording"
        @click="saveNote"
      >
        Save
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Recording } from '~~/types';

const note = ref('');
const loading = ref(false);
const isTranscribing = ref(false);
const { state, startRecording, stopRecording } = useMediaRecorder();
const recordings = ref<Recording[]>([]);

const handleRecordingStart = async () => {
  try {
    await startRecording();
  } catch (err) {
    console.error('Error accessing microphone:', err);
    useToast().add({
      title: 'Error',
      description: 'Could not access microphone. Please check permissions.',
      color: 'red',
    });
  }
};

const handleRecordingStop = async () => {
  let blob: Blob | undefined;

  try {
    blob = await stopRecording();
  } catch (err) {
    console.error('Error stopping recording:', err);
    useToast().add({
      title: 'Error',
      description: 'Failed to record audio. Please try again.',
      color: 'red',
    });
  }

  if (blob) {
    try {
      const transcription = await transcribeAudio(blob);

      console.log('transcription:', transcription);

      note.value += note.value ? '\n\n' : '';
      note.value += transcription ?? '';

      recordings.value.unshift({
        url: URL.createObjectURL(blob),
        blob,
        id: `${Date.now()}`,
      });
    } catch (err) {
      console.error('Error transcribing audio:', err);
      useToast().add({
        title: 'Error',
        description: 'Failed to transcribe audio. Please try again.',
        color: 'red',
      });
    }
  }
};

const toggleRecording = () => {
  if (state.value.isRecording) {
    handleRecordingStop();
  } else {
    handleRecordingStart();
  }
};

const transcribeAudio = async (blob: Blob) => {
  try {
    isTranscribing.value = true;
    const formData = new FormData();
    formData.append('audio', blob);

    return await $fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });
  } finally {
    isTranscribing.value = false;
  }
};

const clearNote = () => {
  note.value = '';
  recordings.value = [];
};

const saveNote = async () => {
  if (!note.value.trim()) return;

  loading.value = true;

  const noteToSave: { text: string; audioUrls?: string[] } = {
    text: note.value.trim(),
  };

  try {
    if (recordings.value.length) {
      noteToSave.audioUrls = await uploadRecordings();
    }

    await $fetch('/api/notes', {
      method: 'POST',
      body: noteToSave,
    });

    useToast().add({
      title: 'Success',
      description: 'Note saved successfully',
      color: 'green',
    });

    note.value = '';
  } catch (err) {
    console.error('Error saving note:', err);
    useToast().add({
      title: 'Error',
      description: 'Failed to save note',
      color: 'red',
    });
  } finally {
    loading.value = false;
  }
};

const deleteRecording = (recording: Recording) => {
  recordings.value = recordings.value.filter((r) => r.id !== recording.id);
};

const uploadRecordings = async () => {
  if (!recordings.value.length) return;

  const formData = new FormData();
  recordings.value.forEach((recording) => {
    console.log('blob type:', recording.blob.type);
    formData.append('files', recording.blob, recording.id + '.webm');
  });

  const res = await $fetch('/api/upload', {
    method: 'PUT',
    body: formData,
  });

  return res.map((r: any) => {
    return r.key;
  });
};
</script>
