
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score
import joblib
import os

# Create model directory if it doesn't exist
os.makedirs('ml_engine/models', exist_ok=True)

def train_model():
    print("Loading data...")
    # Load dataset
    df = pd.read_csv('ml_engine/synthetic_ehr_data.csv')
    
    # Selecting features and target
    features = ['age', 'systolic_bp', 'diastolic_bp', 'bmi', 'hba1c', 'cholesterol', 'creatinine']
    target = 'multimorbidity_label'
    
    # Handle missing values (simple imputation with median for this MVP)
    # In a real scenario, use more sophisticated imputation
    for col in features:
        df[col] = df[col].fillna(df[col].median())
        
    X = df[features]
    y = df[target]
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X.values, y.values, test_size=0.2, random_state=42)
    
    # Standardization
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest
    print("Training Random Forest model...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train_scaled, y_train)
    
    # Predictions
    y_pred = clf.predict(X_test_scaled)
    y_prob = clf.predict_proba(X_test_scaled)[:, 1]
    
    # Evaluation
    print("\nModel Evaluation:")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print(f"ROC AUC: {roc_auc_score(y_test, y_prob):.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save artifacts
    print("Saving model and scaler...")
    joblib.dump(clf, 'ml_engine/models/rf_model.joblib')
    joblib.dump(scaler, 'ml_engine/models/scaler.joblib')
    print("Model training complete.")

if __name__ == "__main__":
    train_model()
