# Archived Research & Development History

This folder contains historical development artifacts, experimental iterations, and previous versions of models and datasets. All content here has been superseded by more recent work in the main repository directories.

## Contents

### `/old_notebooks/`  
**Early experimental Jupyter notebooks from development iterations:**
- CSE499 series (v1-v5): Initial BanglaMOOD emotion recognition experiments
- Pytorch Improvement series: Various optimization attempts  
- TensorFlow Edition variants: Alternative framework implementations
- These notebooks document the research methodology and evolution of the emotion recognition system

### `/old_models/`  
**Previous PyTorch and Keras model checkpoints:**
- `best_model.pth` (23.95 MB): Early PyTorch model version
- `CSE499_Model.pth` (17.2 MB): Initial CSE499 project model
- `best_modelPytorch.pth` (0.7 MB): First PyTorch iteration
- `cnn-transformer.h5`: Keras/TensorFlow transformer model attempt

**Current active models** are located in `emotion-detection/backend/` and `emotion-detection-raspi/backend/`

### `/datasets/`  
**Historical dataset versions and variations:**
- `BanglaMOOD v1/` - Initial dataset (286 samples per emotion)
- `BanglaMOOD v2/` - Second iteration
- `BanglaMOOD v3/` - 685 samples per emotion version
- `BanglaMOOD v4/` - Final 257 samples per emotion version
- `.zip` archives of datasets for archival purposes

### `/deprecated/`  
**Outdated supporting files:**
- `output1.txt` / `output2.txt`: Original result logs (content migrated to RESEARCH.md)

## Why These Files Are Archived

This research project evolved through multiple iterations:
1. **Frameworks**: Started with TensorFlow, moved to PyTorch for better performance
2. **Dataset Versions**: Refined from 286→685→257 samples per emotion class
3. **Models**: Progressed from simple CNNs to CNN+BiLSTM hybrid architecture
4. **Architectures**: Experimented with transformers, attention mechanisms, and other approaches

The **current production models** (which achieved ~82% test accuracy) are the final result of this research journey (see `docs/RESULTS.md`).

## Accessing This History

- See [RESEARCH.md](../RESEARCH.md) for complete methodology and results summary
- See [ORGANIZATION.md](../docs/ORGANIZATION.md) for explanation of current repository structure
- The `research/experiments/` folder contains the successful final models and benchmarks

## Current Production Code

For the active emotion recognition system, refer to:
- **Main Application**: `emotion-detection/` (Flask backend + React frontend)
- **Raspberry Pi Version**: `emotion-detection-raspi/`
- **Documentation**: `README.md`, `INDEX.md`, `CONTRIBUTING.md`

---

*Last Updated: 2024*  
*Archive maintained for research reproducibility and historical reference*
