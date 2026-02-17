# backend/app/api/buildings.py
from flask import Blueprint, request, jsonify, g
from app.models.building import Building
from app.extensions import db
from app.middleware.auth import token_required

buildings_bp = Blueprint('buildings', __name__)

@buildings_bp.route('/settings', methods=['GET'])
@token_required
def get_settings():
    """שליפת הגדרות הבניין"""
    building = Building.query.get(g.building_id)
    if not building:
        return jsonify({'message': 'Building not found'}), 404
        
    return jsonify({
        'city': building.city or 'תל אביב',
        'news_feed': building.news_feed or 'rotter',
        'address': building.address or '' # 👇 חשיפת הכתובת
    }), 200

@buildings_bp.route('/settings', methods=['PUT'])
@token_required
def update_settings():
    """עדכון הגדרות הבניין"""
    data = request.get_json()
    building = Building.query.get(g.building_id)
    
    if not building:
        return jsonify({'message': 'Building not found'}), 404

    if 'city' in data:
        building.city = data['city']
    
    if 'news_feed' in data:
        building.news_feed = data['news_feed']
        
    # 👇 שמירת הכתובת אם נשלחה מהממשק
    if 'address' in data:
        building.address = data['address']

    db.session.commit()

    return jsonify({
        'message': 'Settings updated successfully', 
        'city': building.city,
        'news_feed': building.news_feed,
        'address': building.address
    }), 200