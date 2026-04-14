import pandas as pd
import numpy as np
import os

def generate_student_data(num_samples=2000, output_path="model/student_data.csv"):
    np.random.seed(42)
    
    # Generate independent features
    study_hours = np.random.uniform(0, 10, num_samples)
    attendance = np.random.uniform(50, 100, num_samples) # Attendance usually 50-100%
    sleep_hours = np.random.uniform(4, 10, num_samples)
    previous_score = np.random.uniform(30, 100, num_samples)
    extracurricular = np.random.randint(0, 2, num_samples)
    
    # Calculate target variable with correlated logic
    # Base score
    base = 10
    
    # Weights
    score = (
        base + 
        (study_hours * 3.5) +          # Study hours highly correlated
        (attendance * 0.35) +          # Attendance matters a lot
        ((sleep_hours - 5) * 1.5) +    # Sleep helps
        (previous_score * 0.25) +      # Past performance indication
        (extracurricular * 3.0)        # Minor boost
    )
    
    # Add some noise to make it realistic
    noise = np.random.normal(0, 4, num_samples)
    score = score + noise
    
    # Clip to 0-100 logically
    score = np.clip(score, 0, 100)
    
    # Create DataFrame
    df = pd.DataFrame({
        'Study_Hours': np.round(study_hours, 1),
        'Attendance_Pct': np.round(attendance, 1),
        'Sleep_Hours': np.round(sleep_hours, 1),
        'Previous_Score': np.round(previous_score, 1),
        'Extracurricular': extracurricular,
        'Final_Score': np.round(score, 1)
    })
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    df.to_csv(output_path, index=False)
    print(f"Dataset with {num_samples} records saved to {output_path}")
    print(df.head())
    print("\nCorrelation matrix:")
    print(df.corr()['Final_Score'])

if __name__ == "__main__":
    generate_student_data()
