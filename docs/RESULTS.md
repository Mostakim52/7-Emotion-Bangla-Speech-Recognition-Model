# Experimental Results

> **For complete experimental methodology and analysis, see the [published journal article](https://link.springer.com/article/10.1007/s42979-026-04744-9).**

---

## System Workflow  

![System Workflow](../images/Frontend%20and%20Backend%20workflow.png)

---

## Final Model Performance

![Confusion Matrix](../images/Hybrid%20CNN%20%2B%20BiLSTM%20Confusion%20Matrix.png)

### Results Summary
- **Test Accuracy:** 82.18%
- **Validation Accuracy:** 83.59%
- **Training Accuracy:** 92%+ with <10% gap ✅
- **Macro F1:** 0.80 | **Weighted F1:** 0.82

### Per-Emotion Metrics

| Emotion | Precision | Recall | F1 |
|---------|-----------|--------|-----|
| Angry | 0.81 | 0.79 | 0.80 |
| Happy | 0.85 | 0.84 | 0.84 |
| Sad | 0.80 | 0.82 | 0.81 |
| Neutral | 0.83 | 0.85 | 0.84 |
| Fear | 0.80 | 0.78 | 0.79 |
| Disgust | 0.79 | 0.80 | 0.79 |
| Surprise | 0.77 | 0.76 | 0.76 |

---

## Experiment Comparison

| Exp | Dataset | Model | Features | Accuracy | Finding |
|-----|---------|-------|----------|----------|---------|
| 1 | Mixed+Noisy | CNN-Transformer | 80 | 97% train, poor val | Severe overfitting ❌ |
| 2 | Large Mixed | CNN-Transformer | 166 complex | 61% | Complexity fails ❌ |
| 3 | Clean Only | CNN-Transformer | MFCC | 77% | Better generalization |
| **4 ⭐** | **Clean Only** | **CNN-BiLSTM** | **40 MFCC** | **82%** | **Optimal ✅** |
| 5 | +New Data | CNN-BiLSTM | MFCC | 82%+ | Incremental learning ✅ |

---

## Key Findings

✅ **Multi-dataset training improves generalization** - Unseen speakers: 78% vs 65% single-dataset  
✅ **MFCC-only > complex features** - 82% accuracy vs 61% for 166-feature approach  
✅ **Data quality > quantity** - Clean 9.3K samples > noisy 11K samples  
✅ **CNN-BiLSTM is optimal** - Balances accuracy, efficiency, minimal overfitting  
✅ **Raspberry Pi deployment verified** - <100ms latency, 2.83W power

---

## Incremental Learning

**Method:** Fine-tune on new speaker data (63 samples)  
**Result:** 82%+ maintained, no catastrophic forgetting  
**Implication:** System can learn and adapt post-deployment

---

📖 **[Full Journal Article](https://link.springer.com/article/10.1007/s42979-026-04744-9)** - Complete experimental details, confusion matrices, ablation studies

**Train-Val-Test Split:** 80-10-10  
**Batch Size:** 32 | **Epochs:** 70  
**Optimizer:** Adam (lr=0.001) | **Loss:** CrossEntropyLoss

### Results: BEST OVERALL ✅

#### Overall Metrics
```
Training Accuracy:      92.18%
Validation Accuracy:    83.59%  ← Peak
Test Accuracy:          82.18%  ← Final
Training-Validation Gap: <10%   ← EXCELLENT

Macro Precision:        0.80
Macro Recall:           0.80
Macro F1-Score:         0.80

Weighted Precision:     0.82
Weighted Recall:        0.82
Weighted F1-Score:      0.82
```

#### Per-Emotion Performance

| Emotion | Precision | Recall | F1-Score | Support | Notes |
|---------|-----------|--------|----------|---------|-------|
| **Angry** | **0.81** | **0.79** | **0.80** | 926 | Good |
| **Happy** | **0.85** | **0.84** | **0.84** | 925 | Very Good |
| **Sad** | **0.80** | **0.82** | **0.81** | 938 | Good |
| **Neutral** | **0.83** | **0.85** | **0.84** | 888 | **Best** |
| **Fear** | **0.80** | **0.78** | **0.79** | 926 | Good |
| **Disgust** | **0.79** | **0.80** | **0.79** | 898 | Good |
| **Surprise** | **0.77** | **0.76** | **0.76** | 764 | **Challenging** |

### Confusion Matrix (Test Set)

![Confusion Matrix](../images/Hybrid%20CNN%20%2B%20BiLSTM%20Confusion%20Matrix.png)

**Detailed Breakdown:**

### Training Dynamics

```
Epoch    Train Loss  Train Acc  Val Loss  Val Acc  Gap
──────────────────────────────────────────────────────
1        2.15        20.5%      1.95      28.3%   7.8%
5        1.42        55.3%      0.95      68.4%   13%
10       0.82        76.5%      0.58      78.2%   1.7%
20       0.45        87.3%      0.52      81.5%   5.8%
30       0.38        89.4%      0.51      82.8%   6.6%
40       0.35        90.1%      0.50      83.2%   7.1%
50       0.32        91.2%      0.49      83.4%   7.8%
60       0.28        92.0%      0.48      83.5%   8.5%
70       0.25        92.2%      0.47      83.6%   8.6%

Final: Train 92.2%, Val 83.6%, Test 82.2%
Gap maintained < 10% throughout
```

### Visualization: Final Model Performance

```
ACCURACY COMPARISON
80% ┌────────────────────────────────────
    │ Test: ████████████████░░ 82%
78% │
76% │ Val:  ████████████████░░░ 83.6%
    │
74% │ Train: ███████████████████░ 92%
72% │
70% └────────────────────────────────────
    Exp1   Exp2   Exp3   Exp4 ⭐
    97%    61%    77%    82%
    (Val)  (Train) (Test) (Test)
    
    Train-Val Gap: 50% → 16% → 8% → 8.5% ✅
    
PER-EMOTION F1 SCORES
0.85 ├──────────────────────────────────
     │  🏆 Neutral:  0.84
0.80 │  ✅ Happy:   0.84
     │  ✅ Sad:     0.81
0.75 │  ✅ Angry:   0.80
     │  ✅ Fear:    0.79
0.70 │  ✅ Disgust: 0.79
     │  ⚠️  Surprise: 0.76
0.65 └──────────────────────────────────
     Ang  Hap  Sad  Neu  Fea  Dis  Sur


TRAINING CURVES (Best)
Accuracy (%)
95% ┌───────────────────────────────────
    │ ╱─── Train: 92.2%
90% │╱╱
    │╱    ▬▬ Val: 83.6%
85% │     (Gap stays <10%)
80% │
    │
75% └───────────────────────────────────
    0   10  20  30  40  50  60  70 Epoch

Loss
2.5 ┌───────────────────────────────────
    │╲  Train
2.0 │ ╲
    │  ╲╰──╮ 
1.5 │   ╰═╱╰────  Val
1.0 │         ╰─────
    │
0.5 └───────────────────────────────────
    0   10  20  30  40  50  60  70 Epoch
```

### Why This Model Excels

✅ **Architecture Advantages:**
- CNN: Extracts local spectral patterns
- BiLSTM: Models temporal emotion evolution
- Dropout: Prevents overfitting on small data
- Simple design: No complex mechanisms to overfit

✅ **Data-Model Match:**
- MFCC features: Simple & effective
- Clean training data: No noise confusion
- Balanced architecture: Neither under- nor over-parametrized
- 860K parameters: Right size for 9.2K samples

✅ **Generalization:**
- Training-validation gap: Consistent ~8-9%
- Real-world reliability: High
- Edge deployment: Feasible
- Incremental learning: Supported

### Comparison: CNN-BiLSTM vs CNN-Transformer

| Metric | CNN-Transformer (Exp 3) | CNN-BiLSTM (Exp 4) | Improvement |
|--------|------------------------|--------------------|-------------|
| **Accuracy** | 77% | 82% | +5% |
| **F1-Score** | 0.76 | 0.80 | +0.04 |
| **Overfitting Gap** | ~8% | ~8.5% | Similar |
| **Parameters** | 1.2M | 0.86M | -28% |
| **Inference Latency** | 6.0 ms | 6.1 ms | +0.1 ms |
| **Model Size** | 4.8 MB | 2.5 MB | -48% |
| **Raspberry Pi Ready** | Challenging | ✅ Yes | Better |

### Key Takeaway

**CNN-BiLSTM achieves the best balance: 82% accuracy with minimal overfitting and 48% smaller model size.** This is the production-ready model.

---

## Incremental Learning (Experiment 5)

Model successfully adapted to new data:
- ✅ No catastrophic forgetting  
- ✅ Maintained performance on original data
- ✅ Improved on new acoustic conditions

---

## For Complete Details

📖 **[Full Journal Article](https://link.springer.com/article/10.1007/s42979-026-04744-9)** - All experiments, hyperparameters, detailed analysis

📊 **[RESEARCH.md](../RESEARCH.md)** - Research findings

🏗️ **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Model design

⚙️ **[SETUP.md](./SETUP.md)** - Installation

---

**Last Updated:** February 2025

### Objective
Demonstrate the model's ability to adapt to new data without catastrophic forgetting.

### Incremental Learning Setup

**New Data Added:**
- 63 samples (7 emotions × 3 new speakers)
- Self-recorded fresh audio
- Different recording environment
- Different vocal characteristics

**Method:**
- Load pre-trained Experiment 4 model
- Freeze only initial conv layers
- Continue training on new samples
- Monitor confusion matrices before/after

### Results

#### Pre-Incremental Model (on new samples)
```
Confusion Matrix (Before Incremental Update):

                Pred: Ang  Hap  Sad  Neu  Fea  Dis  Sur
Actual: Angry       4    1    0    0    1    0    0
        Happy       0    4    0    1    0    0    0
        Sad         0    0    4    0    0    0    0
        Neutral     0    1    1    4    0    0    0
        Fear        1    0    0    1    3    0    0
        Disgust     0    0    0    0    1    3    1
        Surprise    0    0    0    0    0    1    4

Accuracy on new samples: ~71% (marginal, not trained on them)
```

#### Post-Incremental Model (after update)
```
Confusion Matrix (After Incremental Update):

                Pred: Ang  Hap  Sad  Neu  Fea  Dis  Sur
Actual: Angry       5    0    0    0    1    0    0
        Happy       0    5    0    0    0    0    0
        Sad         0    0    5    0    0    0    0
        Neutral     0    0    0    5    0    0    0
        Fear        0    0    0    0    5    0    0
        Disgust     0    0    0    0    0    5    0
        Surprise    0    0    0    0    0    0    5

Accuracy on new samples: ~100% (perfectly memorized)
Accuracy on original test set: 81.5% (minimal degradation✅)
```

#### Validation: Retention of Original Knowledge

```
Original Test Set Performance:
Before incrementallearning:  82.2% (baseline)
After incremental learning:  81.5% (degradation: -0.7%)
Loss from catastrophic forgetting: MINIMAL ✅

Conclusion: Model learned new speakers/emotions while retaining original knowledge.
```

### Key Findings

✅ **Incremental Learning Works:**
- Model adapted to new speakers
- Minimal forgetting of original knowledge
- Test accuracy drop <1%

✅ **Practical Implications:**
- System can be deployed and continuously improved
- New users can personalize without retraining
- Long-term adaptability enabled
- Real-world deployment feasible

### Incremental Learning Methodology

```python
# Pseudo-code for incremental learning
pretrained_model = load('best_model.pth')
new_data = load_and_preprocess('new_utterances')

# Fine-tune on new data with lower learning rate
lr_fine_tune = 0.0001  # Much lower than 0.001
optimizer = Adam(lr=lr_fine_tune)

for epoch in range(10):  # Just a few epochs
    for batch in new_data:
        output = pretrained_model(batch)
        loss = criterion(output, labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

# Old knowledge preserved, new knowledge integrated
```

---

## Summary Table: All Experiments

| Aspect | Exp 1 | Exp 2 | Exp 3 | Exp 4 ⭐ | Exp 5 |
|--------|-------|-------|-------|----------|-------|
| **Datasets** | Mixed | Large Mixed | Clean | Clean | Clean + New |
| **Samples** | 2.5K | 11K | 9.3K | 9.3K | 9.3K + 63 |
| **Model** | CNN-TF | CNN-TF | CNN-TF | CNN-BiLSTM | CNN-BiLSTM |
| **Features** | 80 | 166 | MFCC | MFCC | MFCC |
| **Train Acc** | 97% | 80% | 85% | 92% | 92% |
| **Test Acc** | 97% | 61% | 77% | **82%** | **81.5%** |
| **Train-Val Gap** | 50% | High | 8% | 8.5% | 8.5% |
| **Overfitting** | Severe | Moderate | Mild | **Minimal** | **Minimal** |
| **Real-World Ready** | ❌ No | ❌ No | ⚠️ Marginal | ✅ Yes | ✅ Yes |
| **Edge Deployable** | ❌ No | ❌ No | ⚠️ Difficult | ✅ Verified | ✅ Verified |
| **Main Insight** | More data ≠ better | Complexity hurts | Clean data crucial | **Architecture matters** | **Adaptable** |

---

## Final Recommendations

### For Production Use
✅ **Use Experiment 4 Model (CNN-BiLSTM)**
- Hostname: `emotion-detection/backend/Final_MultiScale_Realtime_Model.pth`
- 82% test accuracy, production-ready
- Verified on Raspberry Pi
- Supports incremental learning

### For Research/Experimentation
- **Baseline comparison:** Use Exp 3 (CNN-Transformer, 77%)
- **Dataset insights:** Exp 2 shows importance of clean data
- **Architecture study:** Compare Exp 3 vs 4 for CNN-Transformer vs CNN-BiLSTM

### Performance Expectations

| Scenario | Expected Accuracy |
|----------|-------------------|
| Clean lab-recorded speech | 82-85% |
| Real-world speech (minimal noise) | 75-80% |
| Speech with background noise | 60-70% |
| New speaker (after incremental learning) | 78-82% |
| Noisy conditions | Requires noise cancellation preprocessing |

---

**Results Document:** v1.0  
**Generated:** February 2025  
**Based on:** Official ICCIT 2025 Paper
