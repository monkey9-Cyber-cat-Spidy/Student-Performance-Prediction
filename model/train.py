import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import json
import os

def evaluate_model(y_true, y_pred):
    return {
        "R2": float(r2_score(y_true, y_pred)),
        "MAE": float(mean_absolute_error(y_true, y_pred)),
        "RMSE": float(np.sqrt(mean_squared_error(y_true, y_pred)))
    }

def train_and_export():
    data_path = "model/real_student_data.csv"
    if not os.path.exists(data_path):
        print(f"Data not found at {data_path}. Please provide correct dataset.")
        return
        
    df = pd.read_csv(data_path)
    
    # 1. Clean Data & Map Grades
    grade_map = {
        'AA': 95, 'BA': 87, 'BB': 82, 'CB': 77, 
        'CC': 72, 'DC': 67, 'DD': 62, 'Fail': 50
    }
    df['Grade'] = df['Grade'].str.strip()
    df['Final_Score'] = df['Grade'].map(grade_map)
    df = df.dropna(subset=['Final_Score'])
    df = df.drop(columns=['Student_ID', 'Grade'])

    # 2. Fix anomalies
    df['Attendance'] = df['Attendance'].replace({'3': 'Sometimes'}) 
    df['Notes'] = df['Notes'].replace({'6': 'Yes'})
    df['Listening_in_Class'] = df['Listening_in_Class'].replace({'6': 'Yes'})
    
    # 3. Numeric conversions
    df['Weekly_Study_Hours'] = pd.to_numeric(df['Weekly_Study_Hours'], errors='coerce').fillna(0)

    # 4. Feature and Target Separation
    X_raw = df.drop(columns=['Final_Score'])
    y = df['Final_Score']
    
    # 5. One-Hot Encoding
    X = pd.get_dummies(X_raw, drop_first=True)
    
    # Export Expected feature columns for API
    expected_cols = X.columns.tolist()
    with open("model/expected_features.json", "w") as f:
        json.dump(expected_cols, f)
    print(f"Exported {len(expected_cols)} encoded feature names.")

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Models
    models = {
        "LinearRegression": LinearRegression(),
        "RandomForest": RandomForestRegressor(n_estimators=100, random_state=42),
        "XGBoost": XGBRegressor(n_estimators=100, random_state=42)
    }
    
    results = {}
    best_model_name = None
    best_model = None
    best_r2 = -float("inf")
    
    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        metrics = evaluate_model(y_test, preds)
        results[name] = metrics
        
        print(f"[{name}] R2: {metrics['R2']:.4f} | MAE: {metrics['MAE']:.4f} | RMSE: {metrics['RMSE']:.4f}")
        
        # We will prefer Random Forest or XGBoost as the 'main' model if R2 is good
        if name in ["RandomForest", "XGBoost"] and metrics['R2'] > best_r2:
            best_r2 = metrics['R2']
            best_model_name = name
            best_model = model

    print(f"\nWinner: {best_model_name}")
    
    # Feature Importances
    if hasattr(best_model, 'feature_importances_'):
        importances = best_model.feature_importances_
    else:
        importances = best_model.coef_
        
    feature_importance = {feature: float(imp) for feature, imp in zip(X.columns, importances)}
    # Sort
    feature_importance = dict(sorted(feature_importance.items(), key=lambda item: item[1], reverse=True))

    # Export Model
    model_path = "model/model.pkl"
    joblib.dump(best_model, model_path)
    print(f"Model saved to {model_path}")
    
    # Export Metrics
    metrics_data = {
        "best_model": best_model_name,
        "metrics": results[best_model_name],
        "all_models": results,
        "feature_importance": feature_importance
    }
    
    with open("model/model_metrics.json", "w") as f:
        json.dump(metrics_data, f, indent=4)
    print("Metrics saved to model/model_metrics.json")

if __name__ == "__main__":
    train_and_export()
