# Deployment Guide

Deploying Nexus ML requires setting up the FastAPI backend and the React frontend as independent services that communicate via REST.

## 1. Backend Deployment (Render)

Render is recommended for the FastAPI backend due to its excellent support for Python services and simple environment management.

### Pre-requisites
- A GitHub repository containing the project.
- A `requirements.txt` file in the root (already provided).

### Steps
1. Create a **New Service** -> **Web Service** on Render.
2. Connect your GitHub repository.
3. Configure settings:
    - **Language**: `Python 3`
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables**:
    - `PYTHON_VERSION`: `3.10.x` (or higher)

---

## 2. Frontend Deployment (Vercel)

Vercel is the gold standard for React deployment, offering rapid builds and edge delivery.

### Configuration
Update your `frontend/.env` (or set in Vercel UI) to point to your Render backend:
```env
VITE_API_BASE_URL=https://your-backend-app.onrender.com
```

### Steps
1. Create a **New Project** on Vercel.
2. Select your repository.
3. Configure the **Build Settings**:
    - **Framework Preset**: `Vite`
    - **Root Directory**: `frontend`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
4. Register the `VITE_API_BASE_URL` environment variable in the Vercel dashboard.

---

## 3. Deployment Topology

Nexus ML is optimized for **Global Orchestration**:

- **Frontend**: Serves static assets from Edge locations via Vercel.
- **Backend**: Processes high-dimensional inference on Render's containerized Python environment.
- **Communication**: Secure HTTPS requests between Vercel and Render, managed via CORS (Cross-Origin Resource Sharing).

> [!CAUTION]
> **CORS Security**: In the current `api/main.py`, CORS is set to `allow_origins=["*"]`. For production, update this to specifically allow only your Vercel deployment URL (e.g., `https://nexus-ml.vercel.app`).
