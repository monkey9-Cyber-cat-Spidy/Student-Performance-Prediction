# Runbook & Setup Guide

This guide provides step-by-step instructions to get the Nexus ML environment running locally for development and testing.

## Prerequisites

Ensure you have the following installed on your system:
- **Python 3.9+**
- **Node.js 18+**
- **npm** (comes with Node.js)
- **Git**

---

## 1. Backend Setup (FastAPI)

The backend handles model inference and data processing.

1. **Create a Virtual Environment**:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```

2. **Install Dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

3. **Train the Initial Model** (Optional, if `.pkl` is missing):
   ```powershell
   python model/train.py
   ```

4. **Launch the API Server**:
   ```powershell
   uvicorn api.main:app --reload --port 8000
   ```
   *The API will be available at `http://localhost:8000`.*

---

## 2. Frontend Setup (React + Vite)

The frontend provides the interactive dashboard.

1. **Navigate to the frontend directory**:
   ```powershell
   cd frontend
   ```

2. **Install Packages**:
   ```powershell
   npm install
   ```

3. **Start the Development Server**:
   ```powershell
   npm run dev
   ```
   *The Dashboard will be live at `http://localhost:5173`.*

---

## 3. Training & Data Generation

If you need to generate new synthetic data or re-train the model with fresh data:

- **Generate Data**: Run `python model/generate_data.py`.
- **Re-train Model**: Run `python model/train.py`.

!!! check "Verification"
    After starting both servers, navigate to `http://localhost:8000/health`. If you see `{"status":"OK"}`, the backend is healthy and ready to receive requests from the React dashboard.

---

## Troubleshooting

### Connection Refused (ERR_CONNECTION_REFUSED)
If you see this error in your browser console:
1. **Check Backend Status**: Ensure the FastAPI server is running (`uvicorn api.main:app`).
2. **Environment Variables**: Check that `frontend/.env.development` points to the correct local port (default: 8000).
3. **Network**: Ensure no firewall is blocking local traffic on port 8000.

### Environment Variable System
We use a dynamic URL system for the frontend. If you need to change your backend endpoint:
- **Local Development**: Edit `frontend/.env.development`.
- **Production**: Edit `frontend/.env.production`.
- **Apply Changes**: You must RESTART the Vite dev server (`npm run dev`) or re-build the app for changes to take effect.

### CORS Errors
If the frontend cannot talk to the backend, ensure the `allow_origins` in `api/main.py` includes your local frontend URL or is set to `["*"]` for development.

### Missing Model
If you get a 404 or 500 error on the `/predict` endpoint, ensure `model/model.pkl` and `model/expected_features.json` exist. Run the training script to generate them.
