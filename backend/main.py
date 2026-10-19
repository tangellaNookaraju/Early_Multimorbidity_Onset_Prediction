from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, List
from beanie.operators import In
import joblib
import os
import uvicorn
import numpy as np
from datetime import timedelta

from database import init_db
import models
import auth

app = FastAPI(title="EMOPS API", description="Early Multimorbidity Onset Prediction System API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model and Scaler
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml_engine/models/rf_model.joblib')
SCALER_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml_engine/models/scaler.joblib')

model = None
scaler = None

@app.on_event("startup")
async def on_startup():
    global model, scaler
    # Initialize MongoDB
    try:
        await init_db()
        print("MongoDB initialized successfully.")
    except Exception as e:
        print(f"Error initializing MongoDB: {e}")

    # Load Model
    try:
        if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
            model = joblib.load(MODEL_PATH)
            scaler = joblib.load(SCALER_PATH)
            print("Model and Scaler loaded successfully.")
        else:
            print(f"Warning: Model not found at {MODEL_PATH}. Prediction endpoint will fail.")
    except Exception as e:
        print(f"Error loading model: {e}")

# Pydantic Schemas
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str
    bmi: float
    lifestyle_factors: Optional[Dict[str, str]] = None

class PatientData(BaseModel):
    patient_id: Optional[str] = None
    age: int
    systolic_bp: float
    diastolic_bp: float
    bmi: float
    hba1c: float
    cholesterol: float
    creatinine: float

@app.get("/")
def read_root():
    return {"message": "Welcome to EMOPS API"}

@app.get("/health")
def health_check():
    status = "healthy" if model is not None else "degraded (model not loaded)"
    return {"status": status}

# AUTH ROUTES
@app.post("/register", response_model=Token)
async def register(user: UserCreate):
    try:
        db_user = await models.User.find_one(models.User.email == user.email)
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        print(f"DEBUG: Attempting to register user: {user.email}")
        hashed_password = auth.get_password_hash(user.password)
        new_user = models.User(
            full_name=user.full_name,
            email=user.email,
            hashed_password=hashed_password,
            role="doctor" # Default role
        )
        await new_user.insert()
        print(f"DEBUG: User {user.email} registered successfully.")
        
        access_token = auth.create_access_token(data={"sub": new_user.email})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"CRITICAL ERROR in registration: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await models.User.find_one(models.User.email == form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me")
async def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return {
        "id": str(current_user.id),
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role
    }

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None

@app.put("/me")
async def update_me(update_data: UserUpdate, current_user: models.User = Depends(auth.get_current_user)):
    if update_data.full_name:
        current_user.full_name = update_data.full_name
    if update_data.email:
        # Check if email is already taken by someone else
        existing_user = await models.User.find_one(models.User.email == update_data.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already in use")
        current_user.email = update_data.email
    
    await current_user.save()
    return {
        "id": str(current_user.id),
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role
    }

# PATIENT ENDPOINTS
@app.post("/patients")
async def create_patient(patient: PatientCreate, current_user: models.User = Depends(auth.get_current_user)):
    new_patient = models.Patient(
        **patient.dict(),
        created_by=str(current_user.id)
    )
    await new_patient.insert()
    return new_patient

@app.get("/patients")
async def get_patients(current_user: models.User = Depends(auth.get_current_user)):
    patients = await models.Patient.find(models.Patient.created_by == str(current_user.id)).to_list()
    return patients

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: models.User = Depends(auth.get_current_user)):
    try:
        content = await file.read()
        size = len(content)
        
        record = models.UploadRecord(
            filename=file.filename,
            uploaded_by=str(current_user.id),
            file_size_bytes=size,
            status="Processed"
        )
        await record.insert()
        return {"message": "File uploaded successfully", "record_id": str(record.id), "filename": file.filename, "size": size}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/uploads")
async def get_uploads(current_user: models.User = Depends(auth.get_current_user)):
    records = await models.UploadRecord.find(models.UploadRecord.uploaded_by == str(current_user.id)).sort("-created_at").to_list()
    return records


@app.get("/analytics")
async def get_analytics(current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    predictions = await models.Prediction.all().to_list()
    total = len(predictions)
    high_risk = len([p for p in predictions if p.risk_score > 0.7])
    
    # Simple prevalence calculation
    prevalence = {}
    for p in predictions:
        for d in p.predicted_diseases:
            prevalence[d] = prevalence.get(d, 0) + 1
            
    return {
        "total_assessments": total,
        "high_risk_count": high_risk,
        "disease_prevalence": prevalence,
        "risk_distribution": {
            "High": high_risk,
            "Medium": len([p for p in predictions if 0.3 < p.risk_score <= 0.7]),
            "Low": len([p for p in predictions if p.risk_score <= 0.3])
        }
    }

@app.get("/predictions")
async def get_predictions(current_user: models.User = Depends(auth.get_current_user)):
    # Filter predictions by the doctor_id
    predictions = await models.Prediction.find(models.Prediction.doctor_id == str(current_user.id)).to_list()
    return predictions

@app.get("/analyses")
async def get_analyses(current_user: models.User = Depends(auth.get_current_user)):
    # Backward compatibility endpoint for dashboard, now filtered by doctor
    predictions = await models.Prediction.find(models.Prediction.doctor_id == str(current_user.id)).to_list()
    # Map Prediction to the format Dashboard expects (risk_level etc)
    results = []
    for p in predictions:
        results.append({
            "_id": str(p.id),
            "risk_score": p.risk_score,
            "risk_level": "High" if p.risk_score > 0.7 else "Medium" if p.risk_score > 0.3 else "Low",
            "created_at": p.created_at
        })
    return results

@app.post("/predict")
async def predict_risk(data: PatientData, current_user: models.User = Depends(auth.get_current_user)):
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        input_data = np.array([[
            data.age,
            data.systolic_bp,
            data.diastolic_bp,
            data.bmi,
            data.hba1c,
            data.cholesterol,
            data.creatinine
        ]])
        
        scaled_data = scaler.transform(input_data)
        probability = model.predict_proba(scaled_data)[0][1]
        prediction = model.predict(scaled_data)[0]
        
        risk_level = "High" if probability > 0.7 else "Medium" if probability > 0.3 else "Low"
        
        # Determine likely combinations (Simplified Logic)
        predicted_diseases = []
        if data.systolic_bp > 140: predicted_diseases.append("Hypertension")
        if data.hba1c > 6.5: predicted_diseases.append("Type 2 Diabetes")
        if data.creatinine > 1.5: predicted_diseases.append("Chronic Kidney Disease")

        # Save Prediction to MongoDB linked to the doctor
        prediction_doc = models.Prediction(
            patient_id=data.patient_id or "anonymous",
            doctor_id=str(current_user.id),
            risk_score=float(probability),
            predicted_diseases=predicted_diseases,
            feature_importance={
                "Age": float(data.age / 100),
                "BMI": float(data.bmi / 40),
                "HbA1c": float(data.hba1c / 10)
            }
        )
        await prediction_doc.insert()
        print(f"DEBUG: Saved prediction for doctor {current_user.email}")

        return {
            "prediction": int(prediction),
            "probability": float(probability),
            "risk_level": risk_level,
            "predicted_diseases": predicted_diseases
        }
    except Exception as e:
        print(f"ERROR in /predict: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
