# backend/app/config.py
import os
from dotenv import load_dotenv

# טעינת משתני סביבה מקובץ .env
load_dotenv()

class Config:
    """הגדרות בסיס לכל הסביבות"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard-to-guess-string'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # הגדרות אבטחה בסיסיות
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True

class DevelopmentConfig(Config):
    """הגדרות לסביבת פיתוח"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

class ProductionConfig(Config):
    """הגדרות לסביבת ייצור (Heroku/AWS/Render)"""
    DEBUG = False
    # בייצור נשתמש ב-DB מנוהל, ה-URL יגיע ממשתני הסביבה של השרת
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

# מילון שיעזור לנו לבחור קונפיגורציה בקלות
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}