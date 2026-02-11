# System Architecture

> **For detailed technical specifications, see the [published journal article](https://link.springer.com/article/10.1007/s42979-026-04744-9).**

---

## Model Overview

![Architecture Diagram](../images/Hybrid%20CNN%20%2B%20BiLSTM%20architecture.png)

### Input Specification
- **Duration:** 3 seconds | **Sample Rate:** 16 kHz
- **Features:** 40 MFCC coefficients  
- **Input Shape:** 94 × 40 (time steps × features)

---

## CNN-BiLSTM Architecture

```
Input (94 × 40)
    ↓
Conv1D Block 1   [64 filters, kernel=5]
    ↓
Conv1D Block 2   [128 filters, kernel=5]
    ↓
BiLSTM Layer 1   [128 hidden units, bidirectional]
    ↓
BiLSTM Layer 2   [128 hidden units, bidirectional]
    ↓
Fully Connected  [64 units]
    ↓
Output           [7 emotions, softmax]
```

---

## Layer Specifications

| Layer | Type | Parameters | Output |
|-------|------|-----------|--------|
| Conv1D-1 | 64 filters, k=5 | 12,864 | (47, 64) |
| Conv1D-2 | 128 filters, k=5 | 40,960 | (23, 128) |
| BiLSTM-1 | 256 units (bi) | 394,240 | (23, 256) |
| BiLSTM-2 | 256 units (bi) | 394,240 | (256,) |
| FC | 64 units | 16,448 | (64,) |
| Output | 7 classes | 455 | (7,) |

**Total: ~860K parameters | Model Size: 2.5 MB**

---

## Training Setup

- **Optimizer:** Adam (lr=0.001)
- **Loss:** Cross-Entropy with Softmax
- **Batch Size:** 32
- **Epochs:** 70
- **Regularization:** Dropout (0.3)

---

## Key Design Decisions

✅ **Why CNN-BiLSTM?**
- CNN captures spectral patterns locally
- BiLSTM models temporal emotion evolution
- Balanced architecture prevents overfitting
- Efficient for edge deployment

✅ **Why 40 MFCC?**
- Proven effective for speech emotion
- Outperforms 166-feature handcrafted sets
- Computationally efficient
- Captures perceptual frequencies

✅ **Why This Size?**
- Optimal for ~9K training samples
- Minimal overfitting (<10% gap)
- Fast inference (<100ms on Raspberry Pi)
- Small model (2.5 MB)
