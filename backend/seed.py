# backend/seed.py
from app import create_app, db
from app.models import User, Building
from werkzeug.security import generate_password_hash

app = create_app('development')

def seed_database():
    """
    פונקציה לאתחול נתונים ראשוניים ב-DB.
    יוצרת בניין דיפולטיבי ומשתמש אדמין.
    """
    with app.app_context():
        # 1. בדיקה אם כבר קיים מידע כדי לא ליצור כפילויות
        if User.query.filter_by(email='admin@vaad.com').first():
            print("⚠️  Database already seeded. Skipping...")
            return

        print("🌱 Seeding database...")

        # 2. יצירת בניין לדוגמה
        demo_building = Building(
            name='הבניין לדוגמה',
            address='רחוב הרצל 1, תל אביב',
            city='Tel Aviv',
            settings={
                "theme": "dark", 
                "show_weather": True,
                "slide_duration": 15
            }
        )
        
        db.session.add(demo_building)
        db.session.flush() # מבצע שמירה זמנית כדי לקבל את ה-ID של הבניין

        # 3. יצירת משתמש אדמין (Super Admin)
        admin_user = User(
            email='admin@vaad.com',
            full_name='Admin User',
            role='SUPER_ADMIN',
            building_id=demo_building.id,
            # הצפנת הסיסמה - לעולם לא שומרים טקסט גלוי!
            password_hash=generate_password_hash('123456')
        )

        db.session.add(admin_user)
        
        # 4. שמירה סופית ב-DB
        db.session.commit()
        
        print(f"✅ Success! Created building: {demo_building.name}")
        print(f"✅ Created admin user: admin@vaad.com (password: 123456)")

if __name__ == '__main__':
    seed_database()