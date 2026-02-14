# backend/app/models/announcement.py
from app.models.base import BaseModel
from app.extensions import db
from sqlalchemy.dialects.postgresql import UUID

class Announcement(BaseModel):
    __tablename__ = 'announcements'

    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20), default='NORMAL') # NORMAL, HIGH, EMERGENCY
    
    # מתי להציג ומתי להסיר מהמסך
    display_from = db.Column(db.DateTime, nullable=True)
    display_until = db.Column(db.DateTime, nullable=True)
    
    is_active = db.Column(db.Boolean, default=True)

    # שיוך לבניין הספציפי
    building_id = db.Column(UUID(as_uuid=True), db.ForeignKey('buildings.id'), nullable=False, index=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'title': self.title,
            'content': self.content,
            'priority': self.priority,
            'is_active': self.is_active,
            'building_id': str(self.building_id),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }