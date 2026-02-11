# Installation & Setup Guide

> **For comprehensive setup details, see the [published journal article](https://link.springer.com/article/10.1007/s42979-026-04744-9).**

---

## Quick Start

### Requirements
- Python 3.8+
- 4GB RAM (8GB for training)
- Optional: NVIDIA GPU

### Installation

```bash
# Clone and setup
git clone https://github.com/yourusername/7-Emotion-Bangla-Speech-Recognition-Model.git
cd 7-Emotion-Bangla-Speech-Recognition-Model

# Create environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install backend dependencies
cd emotion-detection/backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../
npm install
```


### Verify Installation

```bash
python -c "import torch; print(torch.__version__)"
python -c "import librosa; print(librosa.__version__)"
```

---

## Running the Application

### Web Application

```bash
# Terminal 1: Backend
cd emotion-detection/backend
python app.py

# Terminal 2: Frontend  
cd emotion-detection
npm start
```

Open: [http://localhost:3000](http://localhost:3000)

---

## Raspberry Pi Deployment

```bash
ssh pi@raspberrypi.local
git clone <repo-url>
cd emotion-detection-raspi/backend
pip install -r requirements-pi.txt
python app.py
```

---

## Model Usage Example

```python
import torch
from backend.model import load_model, extract_features, predict_emotion

# Load pre-trained model (path relative to backend/)
model = load_model('Final_MultiScale_Realtime_Model.pth')

# Extract MFCC features from a 3-second 16kHz WAV file
features = extract_features('audio.wav')

# Predict emotion label
emotion = predict_emotion(model, features)
print("Predicted emotion:", emotion)
```

See: [Final CNN + BiLSTM.ipynb](../research/experiments/Final%20CNN%20%2B%20BiLSTM.ipynb)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| PyTorch import error | `pip install torch --index-url https://download.pytorch.org/whl/cpu` |
| CUDA not found | Use CPU mode or update GPU drivers |
| Port 5000 in use | `FLASK_PORT=5001 python app.py` |
| ffmpeg missing | `apt-get install ffmpeg` (Linux) or `brew install ffmpeg` (macOS) |
| Raspberry Pi slow | Reduce batch size or enable quantization |

---

## For Details

📖 **[Full Journal Article](https://link.springer.com/article/10.1007/s42979-026-04744-9)** - Complete methodology  
📚 **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design  
🏗️ **[RESEARCH.md](../RESEARCH.md)** - Research details  
💻 **[Final Model Notebook](../research/experiments/Final%20CNN%20%2B%20BiLSTM.ipynb)** - Full implementation

---

**Last Updated:** February 2026
