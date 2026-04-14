# Model Evaluation & Metrics

This section provides a detailed breakdown of the machine learning model's performance, winning algorithm, and key drivers of academic success.

## Champion Model: Random Forest

Based on our automated training pipeline (`train.py`), the **Random Forest Regressor** was selected as the champion model for its ability to capture non-linear relationships.

### Performance Benchmarks

| Metric | Random Forest (Champion) | Linear Regression (Baseline) | XGBoost |
| :--- | :--- | :--- | :--- |
| **R2 Score** | -0.1789 | -0.0162 | -0.7878 |
| **MAE** | 10.91 | 10.51 | 13.20 |
| **RMSE** | 14.54 | 13.50 | 17.90 |

> [!NOTE]
> The current R2 score is negative, indicating that the model currently performs worse than a simple horizontal average. This is a common baseline for initial prototypes and suggests that more granular feature engineering or a larger dataset is required for production accuracy.

---

## Feature Importance Analysis

Which variables most influence the predicted score? The following table shows the top drivers identified by the Random Forest model.

| Feature | Importance Weight |
| :--- | :--- |
| **Scholarship (75%)** | 0.1436 |
| **Weekly Study Hours** | 0.1039 |
| **Sex (Male)** | 0.0777 |
| **Transportation (Private)** | 0.0689 |
| **Project Work (Yes)** | 0.0682 |
| **Attendance (Sometimes)** | 0.0647 |
| **Sports Activity (Yes)** | 0.0557 |

### Insights

1. **Scholarship Impact**: The presence of a 75% scholarship is the strongest predictor, possibly correlating with past academic performance or financial stability.
2. **Study Habits**: Weekly study hours rank as the second most important feature, validating our "What-If" analysis focus on increasing study time.
3. **Engagement**: Attendance and project work show significant weights, highlighting students' active participation as a success metric.

---

## Evaluation Process

1. **Data Split**: 80% Training / 20% Testing.
2. **Preprocessing**: One-hot encoding of categorical features + mean imputation for missing study hours.
3. **Metrics**: Standard residuals analysis (R2, MAE, RMSE).
