# backend/app/models/base.py
from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.extensions import db

class BaseModel(db.Model):
    """
    מחלקה אבסטרקטית שכל המודלים יירשו ממנה.
    מוסיפה אוטומטית ID מסוג UUID ותאריכי יצירה/עדכון.
    """
    __abstract__ = True

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """פונקציית עזר להמרה ל-JSON"""
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}