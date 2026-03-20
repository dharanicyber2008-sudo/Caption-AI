/**
 * CaptionAI — Backend Server
 * Node.js + Express + Groq Whisper Large v3 (FREE)
 *
 * Setup:
 *   npm install
 *   cp .env.example .env   (add your GROQ_API_KEY)
 *   node server.js
 *
 * Get your FREE Groq API key at: https://console.groq.com
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Groq is 100% OpenAI-API compatible — we just change the base URL
const { default: OpenAI } = require('openai');
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

// ─── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── File Upload (multer) ──────────────────────────────────────
// Groq Whisper supports files up to 25MB
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB (Groq limit)
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4','video/quicktime','video/webm','video/avi',
                     'audio/mpeg','audio/wav','audio/mp4','audio/ogg'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(mp4|mov|webm|avi|mp3|wav|m4a|ogg)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  }
});

// Ensure directories exist
['uploads', 'temp', 'public'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ─── ROUTES ───────────────────────────────────────────────────

/**
 * POST /api/transcribe
 * Accepts video or audio file, extracts audio if needed,
 * sends to Groq Whisper Large v3 API (FREE), returns timestamped segments.
 */
app.post('/api/transcribe', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured in .env' });
  }

  const inputPath = req.file.path;
  let audioPath = inputPath;
  let extractedAudio = false;

  try {
    console.log(`[transcribe] File received: ${req.file.originalname} (${(req.file.size/1024/1024).toFixed(1)}MB)`);

    // Extract audio from video using ffmpeg (if video file)
    if (req.file.mimetype.startsWith('video/') || req.file.originalname.match(/\.(mp4|mov|webm|avi)$/i)) {
      audioPath = path.join('temp', `audio_${Date.now()}.mp3`);
      console.log('[transcribe] Extracting audio with ffmpeg…');
      try {
        // Compress to 16kHz mono MP3 — optimal for Whisper & stays under 25MB
        execSync(`ffmpeg -i "${inputPath}" -vn -acodec mp3 -ab 64k -ar 16000 -ac 1 "${audioPath}" -y 2>/dev/null`);
        extractedAudio = true;
        const sizeMB = fs.statSync(audioPath).size / 1024 / 1024;
        console.log(`[transcribe] Audio extracted: ${sizeMB.toFixed(1)}MB`);
        if (sizeMB > 24) throw new Error('Audio too large for Groq (>25MB). Use a shorter video clip.');
      } catch (ffmpegErr) {
        if (ffmpegErr.message.includes('too large')) throw ffmpegErr;
        console.warn('[transcribe] ffmpeg failed, using original file:', ffmpegErr.message);
        audioPath = inputPath;
      }
    }

    // Send to Groq Whisper Large v3
    console.log('[transcribe] Sending to Groq Whisper Large v3…');
    const audioStream = fs.createReadStream(audioPath);

    const transcription = await groq.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-large-v3',   // Groq's free Whisper model
      response_format: 'verbose_json',
      language: 'en',
      temperature: 0
    });

    console.log(`[transcribe] Received ${transcription.segments?.length || 0} segments`);

    const segments = (transcription.segments || []).map((seg, i) => ({
      id: i,
      start: parseFloat((seg.start || 0).toFixed(3)),
      end: parseFloat((seg.end || seg.start + 2).toFixed(3)),
      text: seg.text.trim()
    }));

    res.json({
      text: transcription.text,
      language: transcription.language || 'en',
      duration: transcription.duration,
      segments,
      provider: 'groq'
    });

  } catch (err) {
    console.error('[transcribe] Error:', err.message);
    res.status(500).json({ error: 'Transcription failed', detail: err.message });
  } finally {
    try { fs.unlinkSync(inputPath); } catch(e) {}
    if (extractedAudio && audioPath !== inputPath) {
      try { fs.unlinkSync(audioPath); } catch(e) {}
    }
  }
});

/**
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    provider: 'Groq (Free)',
    model: 'whisper-large-v3',
    groq_key: !!process.env.GROQ_API_KEY,
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/export/srt
 */
app.post('/api/export/srt', express.json(), (req, res) => {
  const { captions } = req.body;
  if (!captions?.length) return res.status(400).json({ error: 'Invalid captions' });

  const fmt = s => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = Math.floor(s%60), ms = Math.round((s%1)*1000);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')},${String(ms).padStart(3,'0')}`;
  };

  let srt = '';
  captions.forEach((cap, i) => { srt += `${i+1}\n${fmt(cap.start)} --> ${fmt(cap.end)}\n${cap.text}\n\n`; });
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename="captions.srt"');
  res.send(srt);
});

/**
 * POST /api/export/vtt
 */
app.post('/api/export/vtt', express.json(), (req, res) => {
  const { captions } = req.body;
  if (!captions?.length) return res.status(400).json({ error: 'Invalid captions' });

  const fmt = s => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = Math.floor(s%60), ms = Math.round((s%1)*1000);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(ms).padStart(3,'0')}`;
  };

  let vtt = 'WEBVTT\n\n';
  captions.forEach((cap, i) => { vtt += `${i+1}\n${fmt(cap.start)} --> ${fmt(cap.end)}\n${cap.text}\n\n`; });
  res.setHeader('Content-Type', 'text/vtt');
  res.setHeader('Content-Disposition', 'attachment; filename="captions.vtt"');
  res.send(vtt);
});

// ─── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎬 CaptionAI Backend (Groq) running at http://localhost:${PORT}`);
  console.log(`   Provider:   Groq Whisper Large v3 (FREE — 7200 min/day)`);
  console.log(`   Groq Key:   ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing — add GROQ_API_KEY to .env'}`);
  console.log(`   Get key at: https://console.groq.com`);
  console.log(`   Health:     http://localhost:${PORT}/api/health\n`);
});
