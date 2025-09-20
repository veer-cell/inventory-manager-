import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Database configuration - using SQLite for simplicity
    DATABASE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pharmacy_inventory.db')