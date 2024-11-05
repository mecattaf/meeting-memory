export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;

  const { text, audioUrls } = await readBody(event);
  if (!text) {
    throw createError({
      statusCode: 400,
      message: 'Missing note text',
    });
  }

  try {
    await cloudflare.env.DB.prepare(
      'INSERT INTO notes (text, audio_urls) VALUES (?1, ?2)'
    )
      .bind(text, audioUrls ? JSON.stringify(audioUrls) : null)
      .run();

    return setResponseStatus(event, 201);
  } catch (err) {
    console.error('Error creating note:', err);
    throw createError({
      statusCode: 500,
      message: 'Failed to create note. Please try again.',
    });
  }
});
