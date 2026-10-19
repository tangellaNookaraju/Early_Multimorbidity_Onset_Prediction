
import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

def generate_synthetic_data(num_patients=1000):
    """
    Generate synthetic EHR data for training the multimorbidity prediction model.
    """
    np.random.seed(42)
    random.seed(42)

    data = []
    
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2023, 1, 1)

    for patient_id in range(1, num_patients + 1):
        # Demographics
        age = np.random.randint(40, 90)
        gender = np.random.choice(['M', 'F'])
        
        # Generate longitudinal records
        num_visits = np.random.randint(5, 20)
        
        for _ in range(num_visits):
            visit_date = start_date + timedelta(days=np.random.randint(0, (end_date - start_date).days))
            
            # Vital Signs
            systolic_bp = np.random.normal(120, 15) + (age - 40) * 0.5
            diastolic_bp = np.random.normal(80, 10) + (age - 40) * 0.3
            bmi = np.random.normal(25, 5)
            
            # Lab Values
            hba1c = np.random.normal(5.5, 1.0) if np.random.rand() > 0.8 else np.nan
            cholesterol = np.random.normal(200, 40) if np.random.rand() > 0.7 else np.nan
            creatinine = np.random.normal(1.0, 0.3)
            
            # Chronic Conditions (Labels for training) -> Simplified for simulation
            has_hypertension = 1 if systolic_bp > 140 or diastolic_bp > 90 else 0
            has_diabetes = 1 if hba1c > 6.5 else 0
            has_kidney_disease = 1 if creatinine > 1.5 else 0
            
            multimorbidity_count = has_hypertension + has_diabetes + has_kidney_disease
            is_multimorbid = 1 if multimorbidity_count >= 2 else 0

            record = {
                'patient_id': patient_id,
                'visit_date': visit_date,
                'age': age,
                'gender': gender,
                'systolic_bp': systolic_bp,
                'diastolic_bp': diastolic_bp,
                'bmi': bmi,
                'hba1c': hba1c,
                'cholesterol': cholesterol,
                'creatinine': creatinine,
                'has_hypertension': has_hypertension,
                'has_diabetes': has_diabetes,
                'has_kidney_disease': has_kidney_disease,
                'multimorbidity_label': is_multimorbid
            }
            data.append(record)

    df = pd.DataFrame(data)
    df = df.sort_values(by=['patient_id', 'visit_date'])
    
    # Save to CSV
    output_path = 'ml_engine/synthetic_ehr_data.csv'
    df.to_csv(output_path, index=False)
    print(f"Synthetic data generated and saved to {output_path}")
    return df

if __name__ == "__main__":
    generate_synthetic_data()
