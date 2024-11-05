export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;

  const form = await readFormData(event);
  const blob = form.get('audio') as Blob;
  if (!blob) {
    throw createError({
      statusCode: 400,
      message: 'Missing audio blob to transcribe',
    });
  }

  try {
    const response = await cloudflare.env.AI.run('@cf/openai/whisper', {
      audio: [...new Uint8Array(await blob.arrayBuffer())],
    });

    return response.text;
  } catch (err) {
    console.error('Error transcribing audio:', err);
    throw createError({
      statusCode: 500,
      message: 'Failed to transcribe audio. Please try again.',
    });
  }
});
