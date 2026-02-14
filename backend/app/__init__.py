# backend/app/__init__.py
from flask import Flask
from app.config import config
from app.extensions import db, migrate

def create_app(config_name='default'):
    """
    יישום תבנית Application Factory לאתחול האפליקציה.
    הפונקציה מאפשרת יצירת מופעים מבודדים עבור סביבות שונות (פיתוח, ייצור, טסטים),
    ומטפלת בטעינת תצורות, אתחול תוספים ורישום ראוטרים.
    """
    app = Flask(__name__)
    
    # טעינת תצורת האפליקציה (Configuration) בהתאם לסביבת הריצה המוגדרת
    app.config.from_object(config[config_name])

    # אתחול תוספי מערכת (Extensions) מול מופע האפליקציה הנוכחי
    db.init_app(app)
    migrate.init_app(app, db)

    # ייבוא מודלים באופן מפורש לטובת זיהוי ע"י מערכת המיגרציות (Flask-Migrate / Alembic)
    from app import models

    # רישום ראוטרים (Blueprints) - הגדרת נתיבי ה-API של המערכת
    from app.api.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from app.api.announcements import announcements_bp
    app.register_blueprint(announcements_bp, url_prefix='/api/announcements')

    # נקודת קצה לבדיקת שפיות ותקינות השירות (Health Check) - משמש למוניטורינג ותשתיות ענן
    @app.route('/health')
    def health_check():
        return {'status': 'ok', 'service': 'building-saas-backend'}

    return app