# Real-Time Bangla Speech Emotion Recognition (BSER)
## Real-Time Hybrid CNN-BiLSTM Model with Incremental Learning for LLM Integration

![Status](https://img.shields.io/badge/status-published-brightgreen)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![PyTorch](https://img.shields.io/badge/pytorch-1.10%2B-orange)

### 🎯 Project Overview

This repository contains a complete **Real-Time Speech Emotion Recognition system for Bangla**, combining deep learning, efficient edge deployment, and adaptive incremental learning. The system achieves **82% accuracy** across 7 emotional categories with **real-time inference** (<100ms latency) while being lightweight enough to run on **Raspberry Pi 4B**.

**Key Innovation:** This is the **first real-time Bangla SER system** integrated with Large Language Models (LLMs) for emotionally adaptive responses, complete with an incremental learning pathway for sustained model adaptation.

---

## 📈 Key Achievements

✅ **Real-time inference** - <100ms latency for practical deployment  
✅ **82% accuracy** across 7 Bangla emotions (angry, happy, sad, neutral, fear, disgust, surprise)  
✅ **Multi-dataset approach** combining 5 publicly available Bangla datasets + custom BanglaMOOD collection  
✅ **Efficient MFCC features** proving that simple 40-coefficient MFCCs outperform 166-feature handcrafted sets  
✅ **Real-time deployment** on Raspberry Pi 4B (~2.83W power consumption)  
✅ **Incremental learning module** for continuous model adaptation without catastrophic forgetting  
✅ **LLM integration** for emotionally-aware conversational responses  
✅ **State-of-the-art results** for low-resource Bangla SER  

---

## 🏗️ System Architecture

![System Architecture](images/Project%20Workflow.png)

![Model Architecture](images/Hybrid%20CNN%20%2B%20BiLSTM%20architecture.png)

For detailed architecture specifications, see [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 📁 Repository Structure

```
├── README.md (this file)
├── RESEARCH.md (detailed research findings)
│
├── emotion-detection/                     (Flask + React web application)
│   ├── backend/                           (Flask server with model inference)
│   │   ├── app.py                         (Main Flask app)
│   │   ├── model.py                       (Model architecture)
│   │   ├── realtimetest.py                (Real-time testing)
│   │   └── *.pth                          (Pre-trained models, not in repo)
│   └── src/                               (React frontend)
│
├── emotion-detection-raspi/               (Raspberry Pi optimized version)
│   ├── backend/
│   │   ├── app.py
│   │   ├── model.py
│   │   └── start_flask_app.sh
│   └── src/                               (React frontend)
│
├── research/
│   └── experiments/                       (All experimental notebooks)
│       ├── Final CNN + BiLSTM.ipynb       (🏆 FINAL MODEL - USE THIS)
│       ├── SER_SOTA_Benchmark.ipynb
│       ├── BanglaMOOD + KUET.ipynb
│       └── [other experiments...]
│
├── archived/
│   └── datasets/                          (Historical BanglaMOOD versions)
│       ├── BanglaMOOD v1/
│       ├── BanglaMOOD v2/
│       ├── BanglaMOOD v3 685 samples each/
│       └── BanglaMOOD v4 257 samples each/
│
└── docs/
    ├── ARCHITECTURE.md                    (Detailed model architecture)
    ├── SETUP.md                           (Installation & setup guide)
    ├── RESULTS.md                         (Experimental results comparison)
    └── INCREMENTAL_LEARNING.md            (Incremental learning guide)
```

---

## 🚀 Quick Start

### Web Application (Flask + React)

```bash
# Install backend dependencies
cd emotion-detection/backend
pip install -r requirements.txt
python app.py

# In another terminal, install and run frontend
cd ../
npm install
npm start
```

### Raspberry Pi Deployment

```bash
cd emotion-detection-raspi/backend
bash start_flask_app.sh
```

### Use the Final Model in Your Code

```python
import torch
from backend.model import load_model, extract_features, predict_emotion

# Load model
model = load_model('Final_MultiScale_Realtime_Model.pth')

# Preprocess audio and make prediction
features = extract_features('audio.wav')
emotion = predict_emotion(model, features)
print("Predicted emotion:", emotion)
```

---

## 📊 Key Experiments

Systematic evaluation across 4 experiments showed that **CNN-BiLSTM with 40 MFCC features** achieves the best balance of accuracy (82%) and **real-time efficiency** (<100ms inference latency).

For detailed experimental results, see [RESEARCH.md](./RESEARCH.md) and [RESULTS.md](./docs/RESULTS.md)

---

## 🔄 Incremental Learning & 🗣️ LLM Integration

The system supports:
- **Incremental Learning:** Continuous model adaptation without catastrophic forgetting
- **LLM Integration:** Emotionally-aware conversational responses based on detected emotion

For implementation details, see [INCREMENTAL_LEARNING.md](./docs/INCREMENTAL_LEARNING.md)

---

## 📈 Performance Metrics

![Confusion Matrix](images/Hybrid%20CNN%20%2B%20BiLSTM%20Confusion%20Matrix.png)

**Real-Time Performance: <100ms inference latency | 82% Accuracy | Macro F1: 0.80 | Weighted F1: 0.82**

Detailed metrics available in [RESULTS.md](./docs/RESULTS.md)

---

## 💻 Deployment

**Raspberry Pi 4B:** ✅ Verified (inference <100ms, ~2.83W power consumption)

For setup instructions, see [SETUP.md](./docs/SETUP.md)

---

## 📚 Journal Publication

**"Emotionally Aware Bangla Speech Systems: Real-Time SER with Adaptive Learning and LLM Integration"**

📖 Published in *SN Computer Science*, Springer  
🔗 https://link.springer.com/article/10.1007/s42979-026-04744-9

For detailed findings, methodology, and research questions, see [RESEARCH.md](./RESEARCH.md)

---

## ✨ Highlights

✅ **Real-time inference** (<100ms latency) on Raspberry Pi 4B  
✅ First multi-dataset Bangla SER with LLM integration  
✅ Raspberry Pi deployment verified (~2.83W power)  
✅ Incremental learning for personalization  
✅ 82% accuracy across 7 emotions  
✅ Complete code & reproducible methodology  

---

## 🛠️ Technologies Used

- **Deep Learning:** PyTorch
- **Backend:** Flask
- **Frontend:** React.js
- **Audio Processing:** librosa, scipy
- **Edge Deployment:** Raspberry Pi OS
- **Feature Extraction:** MFCC, spectral analysis

---

## 📝 Citation

If you use this work, please cite:

```bibtex
@inproceedings{hossain2025bser,
  title={Bangla Speech Emotion Recognition using Hybrid CNN Bi-LSTM: An Efficient Tool for LLMs using Incremental Learning},
  author={Hossain, Mostakim and Patwary, Md. Sakibul Alam and Hossain, Md. Musfiq and Rahman, Rashedur M.},
  booktitle={2025 28th International Conference on Computer and Information Technology (ICCIT)},
  pages={1--8},
  year={2025},
  organization={IEEE},
  address={Cox's Bazar, Bangladesh}
}
```

---

## Contributors

<a href="https://github.com/Mostakim52">
  <img src="https://github.com/Mostakim52.png" width="80" height="80" alt="Mostakim Hossain" title="Mostakim Hossain" style="border-radius: 0;">
</a>
<a href="https://github.com/Crysis-Pixel">
  <img src="https://github.com/Crysis-Pixel.png" width="80" height="80" alt="Md. Sakibul Alam Patwary" title="Md. Sakibul Alam Patwary" style="border-radius: 0;">
</a>
<a href="https://github.com/Md-Musfiq-Hossain">
  <img src="https://github.com/Md-Musfiq-Hossain.png" width="80" height="80" alt="Md. Musfiq Hossain" title="Md. Musfiq Hossain" style="border-radius: 0;">
</a>

**Mostakim Hossain** | **Md. Sakibul Alam Patwary** | **Md. Musfiq Hossain**

---

**Rashedur M. Rahman**  
*Advisor & Corresponding Author*  
*Department of Electrical and Computer Engineering*  
*North South University, Dhaka, Bangladesh*

---

## 🔗 Related Links

- [RESEARCH.md](./RESEARCH.md) - Research overview and findings
- [SETUP.md](./docs/SETUP.md) - Installation guide
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Model architecture details
- [RESULTS.md](./docs/RESULTS.md) - Performance metrics
- [📖 Published Journal Article](https://link.springer.com/article/10.1007/s42979-026-04744-9) - Full research paper

---

**Last Updated:** February 2025  
**Status:** Production Ready ✅
