# emotion-detection

This directory is organized with separate backend and frontend apps:

- backend/: Flask + model inference APIs
- frontend/: Unified web frontend (assistant, incremental learning, realtime emotion)

## Run frontend

```bash
cd frontend
npm install
npm start
```

## Run backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```
# Bangla SER Frontend

> Repository organization update:
> - Use `mood-app/` as the single frontend.
> - Use `emotion-detection/backend/` for backend/model APIs.
> - The frontend in `emotion-detection/src/` is kept as legacy reference and does not need to be run separately.

React frontend for the 7-class Bangla Speech Emotion Recognition system.

This frontend records audio in the browser, sends it to the backend API, and displays predicted emotion labels in near real time.

## Required Backend URL

Set the backend base URL using `REACT_APP_API_BASE_URL`.

Examples:
- Local backend: `http://localhost:5000`
- Hugging Face Spaces backend: `https://your-space-name.hf.space`

The app uses this base URL for:
- `POST /detect-emotion`
- `POST /switch-model`

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in this folder:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

3. Start dev server:

```bash
npm start
```

Optional HTTPS local start (requires both cert files to exist):

```bash
npm run start:https
```

## Production Build

```bash
npm run build
```

## Vercel Deployment

Configure this environment variable in your Vercel project:

- `REACT_APP_API_BASE_URL=https://your-space-name.hf.space`

Then deploy normally. CRA reads `REACT_APP_*` variables at build time.

## Scripts

- `npm start`: Run dev server over HTTP
- `npm run start:https`: Run dev server over HTTPS using local cert files
- `npm run build`: Create production build
- `npm test`: Run tests

## Notes

- Browser microphone permission is required.
- CORS must be enabled in your backend for your Vercel domain.
- If using Hugging Face Spaces, ensure endpoints match exactly:
	- `/detect-emotion`
	- `/switch-model`
