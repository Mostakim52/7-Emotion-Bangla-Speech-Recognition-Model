# Incremental Learning Guide

This document explains how to use the incremental learning capability of the Real-Time Bangla Speech Emotion Recognition system.

For full experimental details, see `docs/RESULTS.md` (Experiment 5) and the journal article.

---

## Concept Overview

- **Base model**: CNN–BiLSTM trained on clean multi-dataset mix (SUBESCO, BanglaSER, BANSpEmo), ~82% test accuracy.
- **Goal**: Adapt the model to **new speakers and environments** without catastrophic forgetting.
- **Approach**: Fine-tune the existing model on small batches of labeled new utterances using a **low learning rate**.

Key findings (from Experiment 5):

- New-speaker accuracy improved to ~100% on the small incremental set.
- Original test-set accuracy dropped by **<1%** (from 82.2% to ~81.5%).
- No catastrophic forgetting was observed.

---

## API Endpoints (Backend)

The Flask backend in `emotion-detection/backend/app.py` exposes:

- `POST /detect-emotion`  
  Predicts emotion for an uploaded WebM audio clip.

- `POST /incremental-train`  
  Performs **one incremental update step** on a single labeled audio sample.

- `POST /switch-model`  
  Switches between the **original** model and the **incrementally trained** model.

### Supported Emotions

Both inference and incremental learning use the same label set:

```text
["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]
```

---

## Using `/incremental-train`

### Request format

- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `audio`: WebM audio file recorded at ~16 kHz, ~3 seconds
  - `emotion`: One of the 7 emotion strings above

Example (pseudo-code using `curl` style arguments):

```bash
curl -X POST "https://localhost:5000/incremental-train" \
  -F "audio=@sample.webm" \
  -F "emotion=Happy"
```

### What the server does

Inside `incremental_train` in `app.py`:

1. Saves the uploaded WebM file to `temp_input_incremental.webm`.
2. Uses `ffmpeg` to convert it to `temp_output_incremental.wav`.
3. Extracts MFCC features via `extract_features(...)` (same config as training).
4. Pads/truncates to 94 frames to match training time steps.
5. Loads the **original** model from `bangla_emotion_model.pth`.
6. Runs **one optimization step** using:
   - Loss: CrossEntropyLoss
   - Optimizer: Adam with `lr=0.0001` (very small)
7. Saves the updated weights to `bangla_emotion_model_incremental.pth`.

The endpoint returns JSON:

```json
{
  "success": true,
  "message": "Model updated with new sample. Emotion: Happy",
  "loss": 0.23
}
```

> Note: In the current implementation, each call fine-tunes **from the original model**, not from the previously incremental model. If you want true continual training, you can change the code to start from `INCREMENTAL_MODEL_PATH` instead of `ORIGINAL_MODEL_PATH`.

---

## Switching Between Models

Use `POST /switch-model` to control which weights are used by `/detect-emotion`.

### Request body

```json
{ "model_type": "original" }
```

or

```json
{ "model_type": "incremental" }
```

- `"original"` → loads `bangla_emotion_model.pth`
- `"incremental"` → loads `bangla_emotion_model_incremental.pth` (must exist)

Example:

```bash
curl -X POST "https://localhost:5000/switch-model" \
  -H "Content-Type: application/json" \
  -d "{\"model_type\": \"incremental\"}"
```

Response:

```json
{
  "success": true,
  "message": "Switched to incremental model"
}
```

---

## Best Practices

- **Collect high-quality labels**  
  Incremental updates assume the emotion labels you send are correct. Mislabels will degrade performance.

- **Use small learning rate**  
  The code already uses `lr=0.0001`. If you modify it, keep the learning rate low to avoid overfitting and forgetting.

- **Limit updates per session**  
  Apply a few high-quality updates rather than many noisy ones.

- **Monitor performance**  
  Periodically evaluate on a held-out validation set before and after incremental updates (see methodology in `docs/RESULTS.md`).

- **Persist models carefully**  
  - Back up `bangla_emotion_model.pth` before extensive incremental training.
  - Store incremental variants with clear version names and metadata (who trained it, on what data).

---

## Summary

- Incremental learning is implemented as a **lightweight fine-tuning step** on top of the base CNN–BiLSTM model.
- It is exposed via `/incremental-train` and controlled via `/switch-model`.
- Experiments show that the model can adapt to new speakers while maintaining **~82% test accuracy** on the original data.

Use this feature when you want your deployed system to **learn from real users over time** without full retraining.

