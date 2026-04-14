from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import json
import os
import pandas as pd

app = FastAPI(title="Student Performance Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model paths
MODEL_PATH = "../model/model.pkl"
METRICS_PATH = "../model/model_metrics.json"
EXPECTED_FEATURES_PATH = "../model/expected_features.json"

class StudentMetrics(BaseModel):
    Student_Age: str
    Sex: str
    High_School_Type: str
    Scholarship: str
    Additional_Work: str
    Sports_activity: str
    Transportation: str
    Weekly_Study_Hours: float
    Attendance: str
    Reading: str
    Notes: str
    Listening_in_Class: str
    Project_work: str

@app.get("/health")
def health_check():
    return {"status": "OK"}

@app.get("/model-info")
def get_model_info():
    if not os.path.exists(METRICS_PATH):
        raise HTTPException(status_code=404, detail="Model metrics not found.")
    with open(METRICS_PATH, "r") as f:
        metrics = json.load(f)
    return metrics

@app.post("/predict")
def predict_performance(data: StudentMetrics):
    if not os.path.exists(MODEL_PATH) or not os.path.exists(EXPECTED_FEATURES_PATH):
        raise HTTPException(status_code=500, detail="Model or features not found.")
        
    model = joblib.load(MODEL_PATH)
    
    with open(EXPECTED_FEATURES_PATH, "r") as f:
        expected_features = json.load(f)
        
    # Zero out all features
    input_features = {f: 0.0 for f in expected_features}
    
    input_features["Weekly_Study_Hours"] = data.Weekly_Study_Hours
    
    def set_dummy(col_prefix, val):
        key = f"{col_prefix}_{val}"
        if key in input_features:
            input_features[key] = 1.0

    set_dummy("Student_Age", data.Student_Age)
    set_dummy("Sex", data.Sex)
    set_dummy("High_School_Type", data.High_School_Type)
    set_dummy("Scholarship", data.Scholarship)
    set_dummy("Additional_Work", data.Additional_Work)
    set_dummy("Sports_activity", data.Sports_activity)
    set_dummy("Transportation", data.Transportation)
    set_dummy("Attendance", data.Attendance)
    set_dummy("Reading", data.Reading)
    set_dummy("Notes", data.Notes)
    set_dummy("Listening_in_Class", data.Listening_in_Class)
    set_dummy("Project_work", data.Project_work)
    
    # Convert input to DataFrame exactly matching the model's training columns
    input_df = pd.DataFrame([input_features])[expected_features]
    
    pred = model.predict(input_df)[0]
    
    return {
        "status": "success",
        "predicted_score": float(pred)
    }
