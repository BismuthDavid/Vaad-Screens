# backend/app/api/buildings.py
from flask import Blueprint, request, jsonify, g
from app.models.building import Building
from app.extensions import db
from app.middleware.auth import token_required

buildings_bp = Blueprint('buildings', __name__)

@buildings_bp.route('/settings', methods=['GET'])
@token_required
def get_settings():
    """שליפת הגדרות הבניין (כמו עיר מגורים)"""
    building = Building.query.get(g.building_id)
    if not building:
        return jsonify({'message': 'Building not found'}), 404
        
    return jsonify({
        'city': building.city or 'תל אביב'
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
        db.session.commit()

    return jsonify({'message': 'Settings updated successfully', 'city': building.city}), 200