# Student Performance Prediction (Nexus ML)

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)](https://reactjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An end-to-end Machine Learning solution designed to predict student academic success and provide actionable behavioral recommendations via a "What-If" analysis engine.

---

## 🚀 Live Documentation

We maintain a comprehensive technical guide powered by **MkDocs Material**. For detailed architecture, runbooks, and evaluation metrics, please visit:

👉 **[Launch Technical Documentation Site](https://monkey9-cyber-cat-spidy.github.io/Student-Performance-Prediction/)**

---

## 🛠️ Project Structure

- **`/frontend`**: React + Vite dashboard for real-time inference visualization.
- **`/api`**: FastAPI backend serving the Scikit-Learn models.
- **`/model`**: Training pipeline, data cleaning, and model serialization.
- **`/Datasets`**: Raw and cleaned UCI Student Performance data.

---

## ⚡ Quick Start

### 1. Backend (API)
```bash
# Setup venv & install
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run server
uvicorn api.main:app --port 8000
```

### 2. Frontend (UI)
```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 Core Methodology

Nexus ML utilizes a **Random Forest** ensemble to analyze features such as study hours, attendance patterns, and scholarship levels. The system doesn't just provide a score; it calculates the **Score Delta** for hypothetical improvements, allowing students to see the direct mathematical impact of lifestyle changes.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
