# backend/app/__init__.py
from flask import Flask
from app.config import config
from app.extensions import db, migrate

def create_app(config_name='default'):
    """
    פונקציית המפעל (Factory) שיוצרת את האפליקציה.
    מאפשרת ליצור מופעים שונים עבור פיתוח, טסטים וייצור.
    """
    app = Flask(__name__)
    
    # טעינת הקונפיגורציה המתאימה
    app.config.from_object(config[config_name])

    # אתחול התוספים (Extensions)
    db.init_app(app)
    migrate.init_app(app, db)

    from app import models

    # בדיקת שפיות (Health Check Route)
    @app.route('/health')
    def health_check():
        return {'status': 'ok', 'service': 'building-saas-backend'}

    return app