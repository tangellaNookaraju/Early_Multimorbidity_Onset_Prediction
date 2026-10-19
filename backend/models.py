from beanie import Document, Indexed
from pydantic import EmailStr, Field
from datetime import datetime, timezone
from typing import Optional, List, Dict
from enum import Enum


class UserRole(str, Enum):
    admin = "admin"
    doctor = "doctor"
    researcher = "researcher"


class User(Document):
    full_name: str
    email: EmailStr = Indexed(unique=True)
    hashed_password: str
    role: UserRole = UserRole.doctor
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "users"


class Patient(Document):
    name: str
    age: int
    gender: str
    bmi: float
    lifestyle_factors: Optional[Dict[str, str]] = None
    created_by: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "patients"


class HealthRecord(Document):
    patient_id: str = Indexed()
    visit_date: datetime
    blood_pressure: Dict[str, float]
    glucose: float
    cholesterol: float
    diagnosis: Optional[List[str]] = None
    medications: Optional[List[str]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "health_records"


class Prediction(Document):
    patient_id: str = Indexed()
    doctor_id: str = Indexed()
    risk_score: float
    predicted_diseases: List[str]
    time_to_onset: Optional[str] = None
    feature_importance: Optional[Dict[str, float]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "predictions"


class Report(Document):
    patient_id: str
    summary: str
    pdf_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "reports"


class UploadRecord(Document):
    filename: str
    uploaded_by: str
    file_size_bytes: int
    status: str = "Processed"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "upload_records"