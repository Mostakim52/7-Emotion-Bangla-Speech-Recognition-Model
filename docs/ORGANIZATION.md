# Repository Organization

> **For complete project details, see the [published journal article](https://link.springer.com/article/10.1007/s42979-026-04744-9).**

---

## Quick Overview

```
7-Emotion-Bangla-Speech-Recognition-Model/
├── README.md                    ← Start here
├── RESEARCH.md                  ← Research overview
│
├── emotion-detection/           ← Main Flask + React app (web version)
│   ├── backend/                 (Server, models)
│   └── src/                     (React frontend)
│
├── emotion-detection-raspi/     ← Raspberry Pi optimized version
│   ├── backend/
│   └── src/
│
├── research/
│   └── experiments/             ← Jupyter notebooks (all experiments)
│       └── Final CNN + BiLSTM.ipynb  (⭐ FINAL MODEL)
│
├── docs/
│   ├── SETUP.md                 ← Installation guide
│   ├── ARCHITECTURE.md          ← Model design
│   ├── RESULTS.md               ← Performance metrics
│   └── ORGANIZATION.md          ← This file
│
├── archived/                    ← Old notebooks, datasets & experiments
│   ├── old_notebooks/
│   ├── datasets/
│   └── deprecated/
│
└── images/                      ← Diagrams & visualizations
    ├── Project Workflow.png
    ├── Architecture.png
    ├── Confusion Matrix.png
    └── [others]
```

---

## Key Files Explained

### Documentation  
- **README.md** - Project overview, quick start
- **RESEARCH.md** - Research questions and findings  
- **docs/SETUP.md** - Installation and deployment  
- **docs/ARCHITECTURE.md** - Model specifications  
- **docs/RESULTS.md** - Performance summary

### Production Code  
- **emotion-detection/** - Web application (Flask + React)
- **emotion-detection-raspi/** - Raspberry Pi version
- **research/experiments/Final CNN + BiLSTM.ipynb** - Training code

### Supporting  
- **archived/datasets/** - Dataset information (BanglaMOOD versions)  
- **archived/** - Historical experiments  
- **images/** - Visual diagrams

---

## Which Folder Do I Need?

| Need                          | Go To |
|-------------------------------|-------|
| Deploy web app                | `deployments/emotion-detection/` |
| Deploy on Raspberry Pi        | `deployments/emotion-detection-raspi/` |
| Train model from scratch      | `research/experiments/` |
| Understand architecture       | `docs/ARCHITECTURE.md` |
| See results                   | `docs/RESULTS.md` |
| Install & setup               | `docs/SETUP.md` |

---

## For Details

📖 **[Full Journal Article](https://link.springer.com/article/10.1007/s42979-026-04744-9)** - Complete documentation

---

**Last Updated:** February 2026

```
emotion-detection/
├── backend/                           # Flask server
│   ├── app.py                         # Main Flask application
│   ├── model.py                       # CNN-BiLSTM model architecture
│   ├── realtimetest.py               # Real-time testing utilities
│   ├── requirements.txt               # Python dependencies
│   ├── __pycache__/                  # Compiled Python files
│   │
│   ├── Models (Pre-trained)
│   ├── bangla_emotion_model.pth      # Standard model
│   ├── bangla_emotion_model_incremental.pth  # For incremental learning
│   ├── Final_MultiScale_Realtime_Model.pth   # ⭐ FINAL/BEST MODEL
│   └── strict_excitement_detector.pth        # Specialized model
│   
│   └── cert/                         # SSL certificates
│
├── src/                              # React frontend
│   ├── App.js                        # Main React component
│   ├── App.css                       # Styling
│   ├── index.js                      # Entry point
│   ├── components/                   # React components
│   └── ...
│
├── public/
│   ├── index.html                   # HTML template
│   ├── manifest.json                # PWA manifest
│   └── robots.txt
│
├── package.json                     # Node.js dependencies
├── package-lock.json
└── README.md                        # Frontend-specific README
```

**What It Does:**
- Web-based emotion detection system
- Real-time audio capture and emotion classification
- Integration with LLM for emotion-aware responses
- Counseling session interface
- Incremental learning interface
- Testing interface for emotion detection

**How to Run:**
```bash
cd deployments/emotion-detection
cd backend && python app.py
# In another terminal:
npm start
```

### deployments/emotion-detection-raspi/
**Raspberry Pi optimized version of the above**

```
emotion-detection-raspi/
├── backend/
│   ├── app.py                       # Flask (Pi-optimized)
│   ├── model.py                     # Same model as main
│   ├── start_flask_app.sh           # Startup script for Pi
│   ├── Final_MultiScale_Realtime_Model.pth
│   ├── requirements-pi.txt          # Pi-specific dependencies
│   └── __pycache__/
│
├── src/                             # React frontend (same)
├── public/                          # Static files (same)
├── debug_react_start.sh             # Debug startup script
└── start_react_app.sh               # Production startup script
```

**What It Does:**
- Same functionality as main emotion-detection
- Optimized for Raspberry Pi 4B hardware
- Lower memory footprint
- Startup scripts for automated deployment

**How to Run:**
```bash
cd deployments/emotion-detection-raspi/backend
bash start_flask_app.sh
```

---

## 📁 research/ - Research Artifacts

Experimental notebooks and analysis from the research process.

### research/experiments/
**Jupyter notebooks showing each experiment step-by-step**

```
research/experiments/
├── Final CNN + BiLSTM.ipynb                    # ⭐ BEST MODEL CODE
│   └── Contains: Complete training code for final model
│
├── Real Time Final/
│   ├── BanglaMOOD + KUET.ipynb                # Multi-dataset experiment
│   ├── Final CNN + BiLSTM.ipynb               # Same as above
│   ├── SER_SOTA_Benchmark.ipynb               # Benchmark comparisons
│   ├── SER_SOTA_Benchmark (1).ipynb          
│   ├── SER_SOTA_Benchmark (2).ipynb
│   ├── SUBESCO + BanglaMOOD + KUET.ipynb     # Dataset combination study
│   └── SUBESCO + BANSpEmo + BanglaSER.ipynb  # Final dataset mix
│
├── CSE499 BanglaMOOD Pytorch v2.ipynb         # Early experiments (v2)
├── CSE499 BanglaMOOD Pytorch v3 Augmentation.ipynb  # v3 with augmentation
├── CSE499 BanglaMOOD Pytorch v4 257sample.ipynb     # v4 with 257 samples
├── CSE499 BanglaMOOD Pytorch v5 257sample Fix.ipynb # v5 fixes
├── CSE499 BanglaMOOD Pytorch.ipynb            # Original version
│
├── Pytorch Improvement-Copy1.ipynb            # Improvement iterations
├── Pytorch Improvement-Copy2.ipynb
├── Pytorch Improvement-Copy3.ipynb
├── Pytorch Improvement.ipynb
│
├── PytorchEditionFear86%.ipynb                # Specialized model
├── Remove background noise.ipynb              # Audio preprocessing
│
└── CSE499_Speech_Recognition - [Various versions]  # TensorFlow experiments
    ├── Pytorch Edition - Merged - AudioReduced.ipynb
    ├── Pytorch Edition - Merged - AudioReduced-Copy1.ipynb
    └── Tensorflow Edition - [Various versions]
```

**Purpose:**
- Document research journey
- Show model evolution
- Provide reproducible experiment code
- Educational value for understanding design choices

**Which notebooks to examine:**
- **Best Model:** `Final CNN + BiLSTM.ipynb`
- **Benchmarks:** `SER_SOTA_Benchmark*.ipynb`
- **Dataset Studies:** `SUBESCO + ... notebooks`

### research/datasets/
**Dataset information and preprocessed data references**

```
research/datasets/
├── BanglaMOOD v1/
│   └── Score.txt                    # Experiment 1 results
│
├── BanglaMOOD v2/
│   └── Scores.txt                   # Experiment 2 results
│
├── BanglaMOOD v3 685 samples each/
│   └── Score.txt                    # Version 3 (685 samples per emotion)
│
├── BanglaMOOD v4 257 samples each/
│   └── Score.txt                    # Version 4 (257 samples) - used in final
│
└── DATASET_INFO.md                  # Meta-information about all datasets
```

**Contents:**
- Dataset version history
- Sample counts per emotion
- Data splits (train/val/test)
- Preprocessing information

---

## 📁 docs/ - Technical Documentation

Detailed technical documentation for developers and researchers.

```
docs/
├── ARCHITECTURE.md                  # Model architecture details
│   └── Layer specifications, hyperparameters, design decisions
│
├── SETUP.md                        # Installation & setup guide
│   └── Prerequisites, installation steps, troubleshooting, Docker
│
├── RESULTS.md                      # Detailed experimental results
│   └── All 5 experiments with metrics, confusion matrices, visualizations
│
├── INCREMENTAL_LEARNING.md         # Incremental learning guide (if exists)
│   └── How to use incremental learning, API reference
│
└── API_REFERENCE.md                # Flask API endpoints (if exists)
    └── Available endpoints, request/response formats
```

---

## 📊 Output & Results Files

### At Root Level (Can Move to Archive)
- **output1.txt** - Original research journal summary
- **output2.txt** - Original ICCIT paper abstract

**These are now documented in:**
- RESEARCH.md (comprehensive)
- README.md (summary)

---

## .gitignore - Files to Exclude

Typical files to exclude from version control:

```
# Python
__pycache__/
*.py[cod]
*.egg-info/
.env
venv/
env/

# Node/npm
node_modules/
npm-debug.log
.npm

# Models (too large)
*.pth
*.h5
*.ckpt

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Jupyter
.ipynb_checkpoints/
*.ipynb_checkpoints

# Data (large)
data/
datasets/
*.wav
*.mp3
```

---

## How to Navigate This Repository

### 👤 For New Users / Visitors
1. Read: **README.md** (5 min overview)
2. Check: **RESEARCH.md** (understand the approach)
3. Try: **emotion-detection/** (run the app)

### 🔬 For Researchers
1. Read: **RESEARCH.md** (methodology)
2. Review: **docs/RESULTS.md** (experiment details)
3. Study: **docs/ARCHITECTURE.md** (technical details)
4. Examine: **research/experiments/Final CNN + BiLSTM.ipynb**

### 🛠️ For Developers
1. Setup: Follow **docs/SETUP.md**
2. Deploy: Use **emotion-detection/**
3. Reference: Check **docs/ARCHITECTURE.md** for model details
4. Test: Use **realtimetest.py** in backend

### 📚 For Students / Learning
1. Start: Git-clone, read README
2. Understand: RESEARCH.md (background)
3. Experiment: Jupyter notebooks in **research/experiments/**
4. Build: Use `emotion-detection/` as a template for your own systems

---

## Recommended Cleanup Actions

### Safe to Delete
These are duplicates or development artifacts that can be removed:

```
# Root level (move to archive/ folder instead)
- output1.txt          → Documented in RESEARCH.md
- output2.txt          → Documented in RESEARCH.md
- best_model.pth       → Use Final_MultiScale_Realtime_Model.pth
- best_modelPytorch.pth → Use Final_MultiScale_Realtime_Model.pth
- cnn-transformer.h5   → Deprecated TensorFlow model
- CSE499_Model.pth     → Old checkpoint

# Experiment notebooks with redundant versions
- CSE499 BanglaMOOD Pytorch v2-v5 series  → Keep only v5
- Pytorch Improvement-Copy[1-3].ipynb      → Keep only main version
- CSE499_Speech_Recognition (TensorFlow versions) → Keep reference, remove duplicates
```

### Recommended Folder to Create
```
archived/
├── output1.txt
├── output2.txt
├── old_models/
│   ├── best_model.pth
│   ├── best_modelPytorch.pth
│   ├── cnn-transformer.h5
│   └── CSE499_Model.pth
└── README.md  (explaining what's in here)
```

---

## Version Control Recommendations

### Branch Structure
```
main/master
  ├── stable (production code)
  │   └── demos & docs
  │
  └── develop
      └── experimental features
```

### Commit Messages Convention
```
[CATEGORY] Description

Categories:
- [DOCS] - Documentation updates
- [FEATURE] - New feature
- [FIX] - Bug fix
- [CLEANUP] - Code cleanup
- [EXPERIMENT] - Research notebook
- [DEPLOY] - Deployment updates
```

---

## File Size Guidelines

Keep repository manageable:

| Type | Limit | Action |
|------|-------|--------|
| Single file | <100MB | Track normally |
| Model files | >100MB | Use Git LFS or cloud storage |
| Dataset files | >1GB | Provide download links, not in repo |
| Notebook files | >50MB | Compress or link to cloud |

---

## Maintenance Checklist

- [ ] Update README if features change
- [ ] Keep RESEARCH.md synchronized with papers
- [ ] Test deployment before releasing
- [ ] Update docs/ when model changes
- [ ] Tag releases with version numbers
- [ ] Maintain archived/ folder for old files
- [ ] Update .gitignore as needed
- [ ] Review dependencies regularly

---

## Quick Reference: Key Files

| File | Purpose | Audience |
|------|---------|----------|
| README.md | Project overview | Everyone |
| RESEARCH.md | Research details | Researchers, students |
| docs/ARCHITECTURE.md | Technical details | Developers |
| docs/SETUP.md | Installation | Developers |
| docs/RESULTS.md | Experiment results | Researchers |
| emotion-detection/ | Production app | Users, developers |
| research/experiments/ | Experiment code | Researchers, students |

---

## Further Reading

- For more details on experiments: See RESEARCH.md
- For architecture questions: See docs/ARCHITECTURE.md
- For running the system: See docs/SETUP.md
- For detailed results: See docs/RESULTS.md

---


