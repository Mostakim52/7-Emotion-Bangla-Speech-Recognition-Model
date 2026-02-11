# Research & Experiments

This folder contains the final experimental notebooks that led to the production emotion recognition system.

## 📸 Visual Overview

![Real-Time Emotion Recognition](../../images/Real%20Time%20Bangla%20Emotion%20Recognition%20Page.png)

![Incremental Learning](../../images/Incremental%20Learning%20Page.png)

---

## ⭐ **Production Model** (START HERE)

### **Final CNN + BiLSTM.ipynb**
- **Status:** ✅ DEPLOYED IN PRODUCTION
- **Architecture:** Hybrid CNN + Bidirectional LSTM
- **Performance:** 82% accuracy
- **Used By:** `emotion-detection/backend/model.py`
- **Time to study:** 30-45 minutes

---

## 📊 **Benchmark Analysis**

### **SER_SOTA_Benchmark.ipynb** (PRIMARY)
- **Purpose:** State-of-the-art comparison
- **Shows:**
  - Comparison against other speech emotion recognition systems
  - Different architectures evaluated
  - Why CNN-BiLSTM performs best

---

## 🧪 **Dataset Exploration & Fusion**

### **BanglaMOOD + KUET.ipynb**
- Explores combined BanglaMOOD + KUET datasets
- Shows performance gains from dataset fusion

### **SUBESCO + BanglaMOOD + KUET.ipynb**
- Advanced multi-dataset training
- 3-dataset combination analysis

### **SUBESCO + BanSpemo + BanglaSER.ipynb**
- Alternative dataset combinations
- Cross-dataset evaluation

## How to Use These Files

### **For Reproduction**
→ Use: `Final CNN + BiLSTM.ipynb`
- Complete, clean, production-ready code
- 30-45 minutes to run end-to-end
- Achieves ~82% test accuracy (see `docs/RESULTS.md`)
- Step-by-step explanations

### **For Learning/Understanding**
→ Read: `Final CNN + BiLSTM.ipynb` + `SER_SOTA_Benchmark.ipynb`
- Clear code explanations
- Comparisons with other approaches
- Design decision rationale
- 60-90 minutes for full understanding

### **For Building on This Work**
→ Reference: `Final CNN + BiLSTM.ipynb` (architecture template)
- Use as foundation for extensions
- Clean, modular code structure
- All hyperparameters documented

## Installation & Running

```bash
# Install dependencies
pip install torch librosa numpy scipy matplotlib jupyter

# Run the notebook
jupyter notebook "Final CNN + BiLSTM.ipynb"

# Or run in Google Colab (free GPU)
# Upload notebook, run cells sequentially
```

## Performance Metrics

From `Final CNN + BiLSTM.ipynb` and `docs/RESULTS.md`:
- **Test Accuracy:** ~82% (see detailed metrics)
- **Architecture:** Hybrid CNN + Bidirectional LSTM  
- **Feature Type:** 40 MFCCs (40 Mel-frequency cepstral coefficients)
- **Emotions Detected:** 7 classes (Neutral, Happy, Sad, Angry, Fear, Disgust, Surprise)
- **Training Time:** ~20-30 minutes on GPU

## Key Insights

1. **Architecture Matters:** CNN captures spectral patterns, BiLSTM captures temporal dynamics
2. **Feature Engineering:** 40 MFCCs are optimal (more features hurt performance)
3. **Data Quality:** Clean audio > noisy audio (preprocessed data essential)
4. **Regularization:** Dropout 0.3 prevents overfitting on small datasets
5. **Minimal Gap:** Training-validation gap <10% shows good generalization

## File Reference

| Notebook | Purpose | Keep? |
|----------|---------|-------|
| `Final CNN + BiLSTM.ipynb` | Production model | ✅ PRODUCTION |
| `SER_SOTA_Benchmark.ipynb` | Comparison study | ✅ Reference |
| `SER_SOTA_Benchmark (1).ipynb` | Duplicate | - |
| `SER_SOTA_Benchmark (2).ipynb` | Duplicate | - |
| Dataset combination files | Exploration | ✅ Archive |

## Connected Files

- **Production Code:** See `emotion-detection/backend/model.py`
- **Model Weights:** See `emotion-detection/backend/*.pth` for deployed models  
- **Documentation:** See `../RESEARCH.md` for complete methodology
- **Architecture Details:** See `../docs/ARCHITECTURE.md`
- **Old Versions:** See `../archived/old_notebooks/` for development history

## Quick Links

- [Back to README](../README.md)
- [Research Methodology](../RESEARCH.md)
- [Architecture Details](../docs/ARCHITECTURE.md)  
- [Setup Instructions](../docs/SETUP.md)
- [Project Organization](../ORGANIZATION.md)
