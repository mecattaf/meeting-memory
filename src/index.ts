interface Env {
  R2: R2Bucket;
  AI: any;
  DB: D1Database;
}

interface R2Event {
  type: string;
  object: R2Object | null;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response('Worker is running');
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // Handle scheduled tasks if needed
  },

  async r2(event: R2Event, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('R2 event received:', event);
    
    if (event.type === 'object-created') {
      const object = event.object;
      if (!object) {
        console.error('No object in event');
        return;
      }

      try {
        console.log('Processing file:', object.key);
        
        // Get the audio file from R2
        const audioData = await env.R2.get(object.key);
        if (!audioData) {
          console.error('Failed to get audio data');
          return;
        }

        // Convert the audio data to the format expected by the AI model
        const audioBuffer = await audioData.arrayBuffer();
        const audioArray = [...new Uint8Array(audioBuffer)];

        console.log('Starting transcription...');
        
        // Transcribe the audio using Cloudflare AI
        const transcription = await env.AI.run('@cf/openai/whisper', {
          audio: audioArray,
        });

        console.log('Transcription completed:', transcription);

        if (transcription.text) {
          // Store the transcription in the database
          await env.DB.prepare(
            'INSERT INTO transcriptions (file_key, transcription, created_at) VALUES (?, ?, ?)'
          )
            .bind(object.key, transcription.text, new Date().toISOString())
            .run();
            
          console.log('Transcription stored in database');
        }
      } catch (error) {
        console.error('Error processing audio file:', error);
      }
    }
  },
}; 