# Nexus ML: Student Performance Trajectory Engine

Nexus ML is a React-powered dashboard and FastAPI backend pipeline that predicts academic success using machine learning. It was designed to proactively identify trajectories using the **UCI Students Performance Dataset**.

Below are sample code blocks documenting the core architectural engines of this project.

## 1. The "What-If" Inference Engine (React)

Instead of just predicting a single score, the React frontend runs multiple parallel "hypothetical" predictions in the background using `Promise.all`. This allows the AI to recommend actionable advice by mathematically determining which variable change (e.g., studying more vs. perfect attendance) yields the highest point jump.

```javascript
// Inside Dashboard.jsx
// Core prediction based on true inputs
const corePred = await fetchPrediction(formData);

// Hypothetical futuristic states
const hypStudy = { ...formData, Weekly_Study_Hours: Math.min(formData.Weekly_Study_Hours + 5, 40) };
const hypAtt = { ...formData, Attendance: "Always" };
const hypSch = { ...formData, Scholarship: "100%" };

// Execute parallel inferences against the Random Forest backend
const [predStudy, predAtt, predSch] = await Promise.all([
  fetchPrediction(hypStudy),
  formData.Attendance !== "Always" ? fetchPrediction(hypAtt) : Promise.resolve(corePred),
  formData.Scholarship !== "100%" ? fetchPrediction(hypSch) : Promise.resolve(corePred)
]);

const studyDelta = predStudy - corePred;
const attDelta = predAtt - corePred;

// Dynamically generate the insight
if (attDelta > studyDelta && attDelta > 1.0) {
  setAiInsight(`Focus on class! Switching attendance to 'Always' boosts your score by +${attDelta.toFixed(1)} pts.`);
} else if (studyDelta > 1.0) {
  setAiInsight(`Hit the books! 5 more study hours/week adds +${studyDelta.toFixed(1)} pts to your score.`);
}
```

## 2. API Model Input Encoding Layer (FastAPI)

Since machine learning models (like Random Forest) cannot process raw strings like `"State"` high school or `"Bus"` transit, the FastAPI layer dynamically one-hot encodes JSON text strings from the React app into the exact 1/0 binary format the `.pkl` model inherently expects.

```python
# Inside api/main.py
@app.post("/predict")
def predict_performance(student: StudentFeatures):
    # 1. Transform Pydantic Base Model to Python Dict
    data = student.model_dump()
    
    # 2. Initialize a zero-matrix for all expected numerical features
    encoded_features = {feature: 0 for feature in expected_features}
    
    # 3. Handle base numeric integer variables easily
    encoded_features['Weekly_Study_Hours'] = data['Weekly_Study_Hours']
    
    # 4. Perform dynamic target mapping for categorical dropdown strings
    for key, val in data.items():
        if key == 'Weekly_Study_Hours':
            continue
            
        # Match naming convention established by pandas get_dummies during training
        dummy_col = f"{key}_{val}"
        
        # Ensure our generated string exists in the model's vocabulary
        if dummy_col in encoded_features:
            encoded_features[dummy_col] = 1

    # 5. Convert to Pandas DataFrame for native Scikit-Learn inference
    input_df = pd.DataFrame([encoded_features])
    prediction = float(model.predict(input_df)[0])
    
    return {"predicted_score": prediction}
```

## 3. High-Fidelity UI Value Mapping

The ML Pipeline was engineered to understand complex Letter Grades (AA, BA, CB) but the dashboard is designed around a visually engaging 0-100 ring gauge. We map the outputs smoothly in the frontend for user comprehension.

```javascript
// Smooth translation mapping function returning a contextual letter grade
const getLetterGrade = (score) => {
  if (score >= 90) return "AA";
  if (score >= 85) return "BA";
  if (score >= 80) return "BB";
  if (score >= 75) return "CB";
  if (score >= 70) return "CC";
  if (score >= 65) return "DC";
  if (score >= 60) return "DD";
  return "Fail"; // Flagged for immediate academic intervention
}

// React render component showcasing trajectory
<div className="px-3 py-1 bg-black/60 rounded-lg border border-white/10 font-mono text-xl font-bold text-white drop-shadow-md">
   Grade: {getLetterGrade(prediction)}
</div>
```
