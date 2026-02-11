# Research Overview: Real-Time Bangla Speech Emotion Recognition

> **📖 For complete technical details, see the [published journal article](https://link.springer.com/article/10.1007/s42979-026-04744-9)** in *SN Computer Science*, Springer  

---

## Quick Summary

**Title:** Emotionally Aware Bangla Speech Systems: Real-Time SER with Adaptive Learning and LLM Integration

**Authors:** Mostakim Hossain, Md. Sakibul Alam Patwary, Md. Musfiq Hossain, Rashedur M. Rahman  
**Affiliation:** North South University, Dhaka, Bangladesh

**Key Result:** **82% accuracy** on real-time Bangla emotion recognition using CNN-BiLSTM, with <100ms inference latency, deployable on Raspberry Pi (~2.83W power)

---

## Main Contributions

1. **Real-time inference** - <100ms latency on Raspberry Pi 4B for practical deployment
2. **First multi-dataset Bangla SER system** with cross-dataset validation
3. **MFCC > complex features** - Simple 40-coefficient MFCC outperforms 166-feature combinations
4. **CNN-BiLSTM architecture** - Balances accuracy, efficiency, minimal overfitting
5. **Edge deployment verified** - Runs efficiently on Raspberry Pi 4B
6. **Incremental learning + LLM** - Emotion-adaptive responses with personalization


---

## Key Findings (Research Questions)

| Question | Answer | Key Insight |
|----------|--------|------------|
| **Multi-dataset helps?** | ✅ YES (+5% accuracy) | Diverse data improves generalization to unseen speakers |
| **MFCC-only sufficient?** | ✅ YES (+82% vs 61% for complex features) | Simplicity beats complexity on small datasets |
| **Does noise hurt?** | 🔴 YES (−16% accuracy drop) | Data quality > quantity; preprocessing essential |
| **BiLSTM vs Transformer?** | ✅ CNN-BiLSTM wins (+5% accuracy, lower overhead) | Better balance for edge deployment |

---

## Datasets Used

| Dataset | Samples | Quality | Notes |
|---------|---------|---------|-------|
| SUBESCO | 7,000 | Clean | Largest, high-quality dataset |
| BanglaSER | 1,800 | Clean | Actor-voiced, balanced |
| BANSpEmo | 792 | Clean | Coverage for rare emotions |
| KBES | 1,300 | Noisy | Real-world (TV shows) |
| BanglaMOOD | 2,200+ | Noisy | Private collection |
| **Final Model** | **9,259** | **Clean** | SUBESCO + BanglaSER + BANSpEmo |

**Key Takeaway:** Final model uses only clean datasets (9,259 samples) for 82% accuracy.

---

## Experimental Results

### Final Model: CNN-BiLSTM ✅ BEST

```
Architecture:
Input (94×40 MFCC) → Conv1D(64) → Conv1D(128) → BiLSTM(128)×2 → FC(64) → Output(7 emotions)
```

**Performance:**
- **Test Accuracy:** 82.18%
- **Overfitting Gap:** <10% (minimal)
- **Inference Time:** <100ms per sample
- **Power (Raspberry Pi):** 2.83W

**Per-Emotion F1 Scores:**
- Neutral: 0.95 ⭐
- Angry: 0.84
- Happy: 0.82
- Sad: 0.80
- Fear: 0.79
- Surprise: 0.76
- Disgust: 0.76

### Why CNN-BiLSTM Works

- **CNN:** Captures local spectral patterns efficiently
- **BiLSTM:** Models temporal evolution of emotions
- **Regularization:** Batch normalization + dropout with <10% train–validation gap
- **Efficient:** Lower parameters than Transformers, runs on Pi with <100ms latency
- **Practical:** Balanced approach between accuracy and resources

---

## Feature Engineering

### Final: MFCC-Only (40 Coefficients) ✅

- 20 static MFCC coefficients
- + First-order temporal dynamics (Δ)
- + Second-order temporal dynamics (Δ-Δ)
- **Result:** Simple, effective, low-compute

### Comparison with 166-Feature Approach ❌

Attempted 60+ handcrafted features (spectral, prosodic, harmonic, formant, etc.)
- **Result:** Only 61% accuracy vs 82% with MFCC
- **Lesson:** Overfitting on limited data; simpler is better

---

## Real-World Deployment

### Raspberry Pi 4B Validation ✅

| Metric | Value |
|--------|-------|
| **Inference Latency** | <100ms/sample |
| **Power Consumption (Inference)** | 2.83W |
| **Real-time Audio Processing** | ✅ Smooth |
| **Status** | ✅ Production-Ready |

**Significance:** Enables offline edge deployment without cloud dependency.

---

## Incremental Learning

**Method:** Continued training on existing model with new speaker data  
**Test Set:** 63 new samples (7 emotions × 3 speakers)  
**Results:**
- Model adapted to new data without catastrophic forgetting
- Improved classification for new speakers
- Enables long-term personalization

**Use Case:** System learns individual speaker patterns over time for better accuracy.

---

## Applications

1. **Virtual Counseling** - Emotion-aware therapeutic responses
2. **Customer Service** - Detect frustration; adapt support tone
3. **Education** - Monitor engagement; adjust teaching approach
4. **Mental Health** - Track emotional patterns; alert counselors
5. **IoT/Edge Devices** - Offline emotion recognition

---

## Comparison: All Experiments

| Experiment | Dataset | Model | Features | Accuracy | Status |
|------------|---------|-------|----------|----------|--------|
| **Exp 1** | Mixed (noisy) | CNN-Transformer | 80 | 97% train, 97% test | ❌ Overfits |
| **Exp 2** | Large (11K) | CNN-Transformer | 166 | 61% | ❌ Too complex |
| **Exp 3** | Clean only | CNN-Transformer | MFCC | 77% | ⚠️ Slight gap |
| **Exp 4** | Clean only | **CNN-BiLSTM** | **MFCC** | **82%** | ✅ **BEST** |
| **Exp 5** | + new samples | CNN-BiLSTM | MFCC | 82%+ | ✅ Adaptive |

---

## Key Lessons Learned

### ✅ What Works
- **Clean data > large noisy data** - Quality matters more than quantity
- **Multi-dataset training** - Improves generalization across speakers
- **MFCC-only features** - Simple, acoustic-aligned, low-compute
- **CNN-BiLSTM balance** - Hybrid = efficient + accurate
- **Dropout regularization** - Effective on small datasets

### ❌ What Doesn't Work
- Complex feature engineering (166 features)
- Transformers under resource constraints
- Mixing noise + clean without preprocessing
- Single-dataset training
- Over-regularization

---

## Limitations & Future Work

### Current Limitations
- Performance drops in real-world noise (requires preprocessing)
- Discrete 7-class system misses emotion nuances
- Limited to Bangla emotional expression patterns
- Similar-sounding emotions (surprise vs fear) still challenging

### Future Directions
1. **Larger corpus** - 10K+ diverse speakers and spontaneous speech
2. **Noise robustness** - Train with augmentation; integrate speech enhancement
3. **Dimensional emotions** - Valence-arousal continuous space instead of discrete
4. **Multi-modal fusion** - Combine audio with facial expressions
5. **Advanced learning** - Self-supervised (Wav2Vec 2.0), continual learning improvements
6. **Real-world validation** - Deploy in healthcare and education settings

---

## Publications & Status

📖 **Journal Article:** [SN Computer Science, Springer](https://link.springer.com/article/10.1007/s42979-026-04744-9)

**Status:** ✅ Peer-Reviewed | ✅ Production Ready | ✅ Open Research | ✅ Edge-Deployable

---

**For full methodology and detailed results:** See [journal article](https://link.springer.com/article/10.1007/s42979-026-04744-9) and [GitHub repository](https://github.com)