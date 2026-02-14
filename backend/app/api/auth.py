# backend/app/api/auth.py
from flask import Blueprint, request, jsonify, current_app
from app.models import User
from werkzeug.security import check_password_hash
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400

    user = User.query.filter_by(email=data.get('email')).first()

    if not user or not check_password_hash(user.password_hash, data.get('password')):
        return jsonify({'message': 'Invalid credentials'}), 401

    token_payload = {
        'sub': str(user.id),
        'role': user.role,
        'building_id': str(user.building_id) if user.building_id else None,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }

    token = jwt.encode(token_payload, current_app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({
        'token': token,
        'user': {
            'email': user.email,
            'full_name': user.full_name,
            'role': user.role,
            'building_id': user.building_id
        }
    }), 200