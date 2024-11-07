import type { Note } from '~~/types';

export default defineEventHandler(async (event) => {
  const { cloudflare } = event.context;

  const res = await cloudflare.env.DB.prepare(
    `SELECT 
      id, 
      text, 
      audio_urls AS audioUrls,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM notes
    ORDER BY created_at DESC
    LIMIT 50;`
  ).all<Omit<Note, 'audioUrls'> & { audioUrls: string | null }>();

  return res.results.map((note) => ({
    ...note,
    audioUrls: note.audioUrls ? JSON.parse(note.audioUrls) : undefined,
  }));
});
