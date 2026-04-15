# Unified Frontend (frontend)

This is the single frontend for the project.

It now includes:
- Mood assistant page (`/assistant`)
- Incremental learning page (`/learning`)
- Real-time emotion detection page (`/realtime-emotion`)

## Folder Roles

- Frontend: `emotion-detection/frontend/`
- Backend APIs and model inference: `emotion-detection/backend/`

The old `emotion-detection/src/` frontend is no longer required to run separately.

## Environment Variables

Create `.env` in this folder and set:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GENERATE_API_BASE_URL=http://localhost:7000
```

For Vercel + Hugging Face Spaces, set:

```env
VITE_API_BASE_URL=https://your-space.hf.space
VITE_GENERATE_API_BASE_URL=https://your-llm-service-url
```

## Run

```bash
npm install
npm start
npm run dev
```

## Build

```bash
npm run build
```
