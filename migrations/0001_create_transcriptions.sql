CREATE TABLE IF NOT EXISTS transcriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_key TEXT NOT NULL,
  transcription TEXT NOT NULL,
  created_at TEXT NOT NULL
); 