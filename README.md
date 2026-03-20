# 🎬 CaptionAI — AI Video Caption Generator

An intelligent video captioning platform powered by **Groq Whisper Large v3** (FREE — no credit card needed). Automatically transcribes speech and lets you customize caption position, font, size, color and style — all in the browser.

---

## ✨ Features

- **FREE AI Transcription** — Groq Whisper Large v3 (7,200 min/day free, no credit card)
- **Custom Positioning** — Drag captions anywhere on the video with your mouse
- **9-point Position Presets** — Top/Middle/Bottom × Left/Center/Right quick placement
- **Full Style Control** — Font family, size, weight, color, background, text shadow, stroke, letter spacing, text transform
- **Interactive Timeline** — Drag caption blocks to adjust timing, resize to change duration
- **Live Preview** — See styled captions on the video in real-time
- **Multiple Export Formats** — SRT, WebVTT, JSON, Plain Text
- **Demo Mode** — Works without an API key (loads sample captions)
- **Local Storage** — Captions saved across browser sessions
- **Keyboard Shortcuts** — Space (play/pause), Arrow keys (frame step), Delete (remove caption)

---

## 🔑 Get Your FREE Groq API Key (2 minutes)

1. Go to **[console.groq.com](https://console.groq.com)**
2. Sign up (Google/GitHub/email — no credit card needed)
3. Click **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_...`)
5. Paste into the **Groq API Key** field in CaptionAI

**Free tier:** 7,200 minutes/day of audio transcription — plenty for personal and professional use.

---

## 🚀 Quick Start

### Option A: Frontend Only (Easiest — No Backend Needed)

1. Open `captionai.html` in any modern browser (Chrome, Firefox, Edge)
2. Upload a video
3. Paste your Groq API key in the top-left field
4. Click **✦ Transcribe**

> Without an API key, click **✦ Transcribe** anyway to load demo captions and explore the editor.

---

### Option B: With Backend Server

For larger files — the backend uses ffmpeg to compress audio before sending to Groq (stays under the 25MB limit).

#### Prerequisites
- Node.js 18+
- ffmpeg installed (`brew install ffmpeg` / `sudo apt install ffmpeg`)
- Free Groq API key from [console.groq.com](https://console.groq.com)

#### Setup

```bash
# 1. Go to backend folder
cd captionai-backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env — set GROQ_API_KEY=gsk_your-key-here

# 4. Start server
npm start
# or for development:
npm run dev
```

Server runs at: `http://localhost:3001`

---

## 📁 File Structure

```
captionai.html              ← Complete frontend (single file, open in browser)
captionai-backend/
  server.js                 ← Express backend (optional, for large files)
  package.json
  .env.example              ← Copy to .env and add your GROQ_API_KEY
README.md
```

---

## 🎮 How to Use

1. **Upload** — Drag & drop or click to upload your video (MP4, MOV, WebM, AVI)
2. **Transcribe** — Paste Groq key → click ✦ Transcribe → captions auto-generate
3. **Edit** — Click any caption to edit text; drag timeline blocks to adjust timing
4. **Style** — Set font, size, color, background from the right panel
5. **Position** — Use preset buttons (BC, TC, etc.) or drag captions directly on the video
6. **Export** — Click ⬇ Export → choose SRT / VTT / JSON / Text → Download

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `←` / `→` | Step 0.1 seconds |
| `Delete` | Remove selected caption |
| `Ctrl+Z` | Undo |

---

## 💡 Groq vs Other Providers

| Provider | Cost | Free Tier | Speed | Notes |
|----------|------|-----------|-------|-------|
| **Groq** ✅ | Free | 7200 min/day | ⚡ Fastest | No credit card needed |
| OpenAI | ~$0.006/min | None | Fast | Requires billing |
| Local Whisper | Free | Unlimited | Slow | Needs Python + GPU |
| Hugging Face | Free | Limited | Slow | Rate limited |

---

## 📄 License

MIT — Free to use and modify.


---

## ✨ Features

- **AI Transcription** — OpenAI Whisper API extracts accurate English captions with timestamps
- **Custom Positioning** — Drag captions anywhere on the video with your mouse
- **9-point Position Presets** — Top/Middle/Bottom × Left/Center/Right quick placement
- **Full Style Control** — Font family, size, weight, color, background, text shadow, stroke, letter spacing, text transform
- **Interactive Timeline** — Drag caption blocks to adjust timing, resize to change duration
- **Live Preview** — See styled captions on the video in real-time
- **Multiple Export Formats** — SRT, WebVTT, JSON, Plain Text
- **Demo Mode** — Works without an API key (loads sample captions)
- **Local Storage** — Captions saved across browser sessions
- **Keyboard Shortcuts** — Space (play/pause), Arrow keys (frame step), Delete (remove caption)

---

## 🚀 Quick Start

### Option A: Frontend Only (No Backend Needed)

1. Open `captionai.html` in any modern browser
2. Upload a video
3. Enter your OpenAI API key in the left panel
4. Click **✦ Transcribe**

> Without an API key, click **✦ Transcribe** anyway to load demo captions and explore the editor.

---

### Option B: With Backend Server

The backend handles audio extraction via ffmpeg and proxies the Whisper API call server-side.

#### Prerequisites
- Node.js 18+
- ffmpeg installed (`brew install ffmpeg` / `apt install ffmpeg`)
- OpenAI API key

#### Setup

```bash
# 1. Go to backend folder
cd captionai-backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 4. Start server
npm start
# or for development with auto-reload:
npm run dev
```

Server runs at: `http://localhost:3001`

#### Update Frontend to Use Backend

In `captionai.html`, find the `startTranscription()` function and change the fetch URL from:
```js
'https://api.openai.com/v1/audio/transcriptions'
```
to:
```js
'http://localhost:3001/api/transcribe'
```
Also remove the Authorization header (the backend handles authentication).

---

## 📁 File Structure

```
captionai.html              ← Complete frontend (single file)
captionai-backend/
  server.js                 ← Express backend
  package.json
  .env.example
  uploads/                  ← Temp uploads (auto-created)
  temp/                     ← Temp extracted audio (auto-created)
  public/                   ← Serve frontend from here (copy captionai.html)
README.md
```

---

## 🎮 How to Use

### Step 1 — Upload Video
- Drag & drop or click "Upload Video"
- Supports: MP4, MOV, WebM, AVI (up to 500MB)

### Step 2 — Transcribe
- Enter your OpenAI API key (left panel) OR skip for demo mode
- Click **✦ Transcribe** button
- Captions appear in the left panel and timeline

### Step 3 — Edit Captions
- Click any caption in the left list to select it
- Edit the text directly in the text area
- Drag caption blocks on the timeline to adjust timing
- Drag the right edge of a block to resize duration

### Step 4 — Style Captions
- Use the right panel to set font, size, color, background, shadow, etc.
- Toggle "Selected" vs "All Captions" to apply styles individually or globally
- Click a position preset (BC, TC, ML, etc.) or drag the caption on the video

### Step 5 — Export
- Click **⬇ Export** button
- Choose SRT / VTT / JSON / Plain Text
- Click Download

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `←` / `→` | Step 0.1 seconds |
| `Delete` | Remove selected caption |
| `Ctrl+Z` | Undo |

---

## 🔑 API Key Security

- When using **Option A** (frontend only), your API key is sent directly from the browser to OpenAI
- For production, use **Option B** (backend server) so the key stays server-side
- Never commit your `.env` file to git

---

## 🛠 Customization

### Adding More Fonts
In `captionai.html`, add to the `<select id="fontFamily">` dropdown and include the font in the Google Fonts `<link>` tag.

### Changing Default Style
Edit the `globalStyle` object in the `<script>` section.

### Adding Caption Animation
The `.caption-display` CSS class can be extended with CSS transitions/animations for fade-in effects.

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML/CSS/JS (zero dependencies) |
| Fonts | Google Fonts (Bebas Neue, DM Sans, JetBrains Mono, etc.) |
| Transcription | OpenAI Whisper API (`whisper-1`) |
| Backend | Node.js + Express |
| File Uploads | Multer |
| Audio Extraction | ffmpeg (server-side) |
| Storage | Browser localStorage |

---

## 🔮 Roadmap / Potential Enhancements

- [ ] FFmpeg.wasm for client-side audio extraction (no backend needed)
- [ ] Burned-in caption export (video with captions embedded)
- [ ] Multi-language transcription
- [ ] Word-level timestamps (Whisper word granularity)
- [ ] Caption animation presets (fade, slide, typewriter)
- [ ] Google Translate integration for subtitle translation
- [ ] Cloud save / shareable project links

---

## 📄 License

MIT — Free to use and modify.
