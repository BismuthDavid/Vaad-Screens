# backend/app/api/announcements.py
from flask import Blueprint, request, jsonify, g
from app.models.announcement import Announcement
from app.extensions import db
from app.middleware.auth import token_required

announcements_bp = Blueprint('announcements', __name__)

@announcements_bp.route('/', methods=['GET'])
@token_required
def get_announcements():
    """שליפת כל ההודעות המשויכות לבניין של המשתמש המחובר"""
    
    #g.building_id מה-Token!
    # זה מונע דליפת מידע בין בניינים שונים
    announcements = Announcement.query.filter_by(
        building_id=g.building_id,
        is_active=True
    ).order_by(Announcement.created_at.desc()).all()
    
    return jsonify([a.to_dict() for a in announcements]), 200

@announcements_bp.route('/', methods=['POST'])
@token_required
def create_announcement():
    """יצירת הודעת ועד חדשה"""
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'message': 'Title and content are required'}), 400

    new_announcement = Announcement(
        title=data['title'],
        content=data['content'],
        priority=data.get('priority', 'NORMAL'),
        building_id=g.building_id # שיוך אוטומטי לבניין של המשתמש
    )
    
    db.session.add(new_announcement)
    db.session.commit()
    
    return jsonify(new_announcement.to_dict()), 201