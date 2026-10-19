import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import models

MONGODB_URL = os.getenv(
    "MONGODB_URL",
    "mongodb://127.0.0.1:27017/?directConnection=true"
)

DATABASE_NAME = "emops_db"

async def init_db():
    try:
        client = AsyncIOMotorClient(MONGODB_URL)

        # Check connection
        await client.admin.command("ping")

        await init_beanie(
            database=client[DATABASE_NAME],
            document_models=[
                models.User,
                models.Patient,
                models.HealthRecord,
                models.Prediction,
                models.Report,
                models.UploadRecord,
            ]
        )

        print("Connected to MongoDB Atlas successfully")

    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        raise e