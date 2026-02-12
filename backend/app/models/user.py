# backend/app/models/user.py
from app.models.base import BaseModel
from app.extensions import db
from sqlalchemy.dialects.postgresql import UUID

class User(BaseModel):
    __tablename__ = 'users'

    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=True)
    
    # תפקידים: SUPER_ADMIN (אנחנו), ADMIN (ועד), VIEWER (דייר)
    role = db.Column(db.String(20), default='ADMIN', nullable=False)

    # המפתח הזר (Foreign Key) שמקשר לבניין
    building_id = db.Column(UUID(as_uuid=True), db.ForeignKey('buildings.id'), nullable=True)

    def __repr__(self):
        return f'<User {self.email}>'