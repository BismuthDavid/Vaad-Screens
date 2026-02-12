# backend/wsgi.py
import os
from app import create_app

# קביעת הסביבה (אם לא מוגדר, ברירת מחדל היא פיתוח)
config_name = os.getenv('FLASK_CONFIG') or 'default'

app = create_app(config_name)

if __name__ == '__main__':
    app.run()