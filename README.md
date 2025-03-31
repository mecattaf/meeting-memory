**Product Roadmap: Meetings Memory | Cloudflare-Based Meeting Transcription & Diarization Tool**

**1\. Product Vision & Goals**

**Primary Goal**: Provide an automated, high-accuracy transcription service for meetings, coupled with robust speaker diarization to identify who said what.

**Key Objectives**:

1. Achieve near-human-level transcription quality leveraging **Whisper large** or **WhisperX**.  
2. Provide accurate speaker labeling using **Pyannote (thourgh WisperX or as standalone)** or a fallback diarization solution.  
3. Implement fully on **Cloudflare’s serverless stack** (Workers (Python Beta) , R2, D1, possibly with GPU)  
4. Advanced text processing (clean-up, punctuation) via an LLM (e.g., Llama) hosted on Workers AI  
5. Keep the user flow frictionless: user uploads meeting file \-\> final transcript (with speakers) is returned automatically.

**2\. Scope & Requirements**

**2.1. Input & Processing**

* **Source Files**: MP4 or audio-only (e.g. WAV/MP3).  
* **Data Ingestion**: Upload directly to R2 via Wrangler or a Worker endpoint (REST API)  
* **Audio Extraction**: If MP4 is uploaded, extract audio in Worker using FFmpeg WebAssembly or a Python Worker runtime (if permitted).

**Transcription**:

* **Whisper** or **WhisperX** on Cloudflare.  
  * If **WhisperX** is used, test running in Workers AI with Beta Python Workers environment (if GPU is available)

**Speaker Diarization**:

* **WhisperX** is the ideal solution, as it performs both speech and diarization automatically  
* **Separate Whisper \+ Pyannote** is second best (requires GPU for best performance, potentially CPU fallback).

* If GPU or Beta Python environment is unavailable/unreliable (if Pytorch can’t run correctly), fallback to a simpler approach:  
  * Partial Pyannote pipeline (like VAD \+ embedding)  
  * Use of LLMs for intelligent context reconstruction and assistance in diarization (correct logical errors and assign missing speakers)

**LLM Post-processing**:

* **Llama** (7B-13B) or any open-source model on Workers AI to improve punctuation, fix minor ASR errors, handle partial diarization if needed.

**2.2. Output & Data Storage**

	**Transcript Format**:

* Detailed diarization (segment-level or word-level with speaker labels).  
*  Potential Word timings (if WhisperX is used).  
* **R2** : Store the entire transcript file (TXT/SRT) for easy download or backup.

	**APIs**:

* **Upload**: Allows user to push file or triggers an event from R2.  
* **Results**: Retrieve final diarized transcript.

**2.3. Implementation Constraints & Considerations**

* **Cloudflare Worker Timeouts**:  
  * For large files, chunk the audio to avoid timeouts.  
* **GPU Usage**:  
  * Pyannote & full Whisper large typically require GPU for real-time or near-real-time speeds.  
  * If GPU is not consistently available in Workers Beta, the pipeline must handle CPU fallback, albeit slower.  
* **Python Workers**:  
  * Beta feature. Evaluate whether dependencies can be installed (especially Pythorch) for Pyannote & WhisperX.  
  * Potential memory constraints or cold starts to be considered.

---

**3\. Roadmap Phases & Milestones**

**Phase 1: Core Pipeline Proof-of-Concept**

1. **Set Up Project Repos & Wrangler**  
* Create or configure the GitHub repo with a Cloudflare Worker template.  
* Define environment in wrangler.toml (R2, D1, AI)


2. **Basic Transcription with Whisper**  
* Deploy a Cloudflare Worker that:  
  * Takes a short audio file from R2 (or as direct upload).  
  * Calls **Workers AI** with the built-in Whisper model (@cf/openai/whisper-large-v3-turbo).  
  * Returns raw transcript.

	**Success Criteria**: Transcribe a 1–5 minute audio snippet with decent accuracy.

3. **Store Transcripts in R2**

	Create a minimal JSON schema:

* meetings (id, status, transcript\_text, created\_at, updated\_at)  
* Speech and assigned speaker

(Optional) Provide an endpoint to retrieve the data.

**Target Duration**: \~1 week to get a stable POC with successful transcription & DB integration.

---

**Phase 2: Enhanced Diarization & Audio Handling**

1. **Audio Extraction**  
* Implement **FFmpeg WebAssembly** or a Python Worker to demux audio from MP4.  
  * Store extracted audio in memory or R2 (if big).  
      
2. **WhisperX Integration**

Evaluate running **WhisperX** in a Python Worker with GPU access (beta).

	If feasible:

* Confirm the environment can install PyTorch, whisperx, etc.  
* If not feasible (or too slow on CPU):  
  * Remain with standard Whisper on Workers AI.  
      
3. **Diarization with Pyannote**

	If **WhisperX** is integrated, it automatically uses Pyannote for diarization (requires setting environment variables & installing pyannote).

* Alternatively, run Pyannote alone in the Worker if we can.  
* If GPU is not readily available, test CPU-based diarization performance on short test clips.  
* If speed is unsatisfactory, fallback to simpler pipeline \+ LLM context correction.  
    
4. **Segmented Storage**  
* Create Json with schema of speech analyzed  
* Transcripts (id, meeting\_id, speaker\_label, start\_time, end\_time, text\_segment)

**Target Duration**: \~3-4 weeks of R\&D to handle complexities of Python environment, GPU, and integration of Pyannote/WhisperX.

---

**Phase 3: LLM Post-Processing & Chunking**

1. **LLM Integration**

	•	Use a Llama-based model on Workers AI to correct final transcripts.

	•	Ensure we chunk transcripts if they exceed token limits.

	•	Reassemble corrected segments into a final text.

2. **Chunking for Long Audio**

	•	For multi-hour recordings, chunk the audio to smaller segments (e.g. 5 min).

	•	Transcribe them in parallel or sequentially to avoid Worker timeouts.

	•	Merge final transcript segments based on timestamps.

**Target Duration**: \~1 week to refine chunking approach and integrate LLM post-processing with robust error handling.

---

**4\. Detailed Deliverables**

1. **Code Repository**:  
* Contains Worker scripts (uploadWorker.js / processingWorker.js or a single module Worker with multiple event handlers).  
* Python Worker code, plus instructions for installing Pyannote, WhisperX.  
    
2. **Documentation**:  
* Setup guide: how to configure R2, D1, queue, GPU or CPU environment.  
* Usage guide: how to run Wrangler commands, test endpoints locally, deploy to dev & prod.  
    
3. **API Endpoints**:

	•	**POST /upload**: Accept file, store in R2.

	•	**GET /transcript/:meetingId**: Return final transcript JSON or text.

	

---

**5\. Risks & Mitigations**

1. **WhisperX** / **Pyannote GPU Dependency**  
* **Risk**: GPU might not be consistently available or environment might be unstable in beta.  
* **Mitigation**: Have a fallback diarization approach or run partial steps on CPU, with reduced performance.


2. **WhisperX Complexity**

	•  **Risk**: Installing large libraries (PyTorch, etc.) in the Python Worker might exceed memory or time constraints.

	• **Mitigation**: Evaluate smaller or quantized versions of models, or fallback to standard Whisper on Workers AI.

---

**6\. Key Success Metrics**

1. **Accuracy**:  
* Word Error Rate (WER) for transcriptions vs. reference data.  
* Speaker attribution accuracy for diarization (DER – Diarization Error Rate).


2. **Performance**:  
* Average processing time per hour of audio.  
* Time to get final transcript from upload to completion.  
    
3. **Reliability**:  
* Failure rate (due to Worker timeouts or model errors).  
* Percentage of jobs that finish successfully on first try.

![][image1]

(Mermaid Graph Code)  
**graph** LR

%% Ingestion  
**subgraph** Ingestion  
   A(\[User uploads video/audio\]) **\--\>**|HTTP PUT/POST| B(\[Worker: Upload Endpoint\])  
   B **\--\>**|Store file| C(\[R2 Bucket\])  
   C **\--\>**|Object Created event| D(\[Queue or direct Worker call\])  
**end**

%% Processing  
**subgraph** Processing  
   D **\--\>** E(\[Extract Audio if needed\])  
   E **\--\>** F(\[Transcribe with Whisper or WhisperX\])  
   F **\--\>** G(\[Diarization\<br/\>Pyannote or Embeddings\])  
   G **\--\>** H(\[LLM Post-processing\<br/\>LLaMA or similar\])  
   H **\--\>** I(\[Final Transcript:\<br/\>Diarized & Corrected\])  
**end**

%% Storage  
**subgraph** Storage  
   I **\--\>** K(\[R2\<br/\> Transcript File\])  
   K **\--\>** L(\[API Endpoint\<br/\>for Transcript Access\])  
   L **\--\>** M(\[End User / Client\])  
**end**

%% Styling  
style A,B,C,D,E,F,G,H,I,J,K,L,M fill:\#f9f9f9,stroke:\#333,stroke\-width:1px,rx:10,ry:10

[image1]: <data:image/png;base64,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>
