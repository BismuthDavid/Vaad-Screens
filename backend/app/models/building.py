# backend/app/models/building.py
from app.models.base import BaseModel
from app.extensions import db

class Building(BaseModel):
    __tablename__ = 'buildings'

    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=True)
    
    # הגדרות תצוגה ברירת מחדל (נשמור כ-JSON)
    settings = db.Column(db.JSON, default=lambda: {
        "theme": "light",
        "show_weather": True,
        "slide_duration": 10
    })

    is_active = db.Column(db.Boolean, default=True)

    # הקשר (Relationship) למשתמשים - One to Many
    users = db.relationship('User', backref='building', lazy=True)

    def __repr__(self):
        return f'<Building {self.name}>'