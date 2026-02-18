# 🏢 Vaad-Screens - מערכת שילוט דיגיטלי חכמה לוועד הבית

**Vaad-Screens** היא מערכת Full-Stack מודרנית לניהול מסכי מידע בלובי של בנייני מגורים.
המערכת מחליפה את לוח המודעות הישן ומאפשרת לוועד הבית לפרסם הודעות, להציג מזג אוויר, זמני כניסת שבת ומבזקי חדשות בזמן אמת – הכל דרך ממשק ניהול נוח ונגיש.

---

## ✨ פיצ'רים מרכזיים

### 🖥️ מסך התצוגה (Kiosk Mode)
* **עיצוב מודרני:** ממשק Dark Mode המותאם למסכי טלוויזיה גדולים.
* **קרוסלת הודעות:** החלפה אוטומטית של הודעות כל 15 שניות (Pagination).
* **ווידג'ט שבת חכם:** זיהוי אוטומטי של סופ"ש והחלפת התצוגה לזמני כניסת/יציאת שבת ופרשת השבוע (מבוסס Hebcal).
* **מזג אוויר:** תצוגת טמפרטורה ומצב שמיים בזמן אמת לפי עיר (Open-Meteo).
* **טיקר חדשות:** פס גלילה תחתון עם מבזקים מערוצים מובילים (Ynet, N12, רוטר, כיכר השבת ועוד).
* **כתובת מותאמת:** הצגת שם הבניין/הרחוב בראש המסך.

### ⚙️ פאנל ניהול (Admin Dashboard)
* **אימות משתמשים:** כניסה מאובטחת באמצעות JWT.
* **ניהול הודעות (CRUD):** יצירה, עריכה ומחיקה של הודעות דיירים.
* **תיעדוף:** סימון הודעות דחופות (High Priority) בצבע אדום בולט.
* **הגדרות בניין:** בחירת עיר (למזג אוויר ושבת), בחירת מקור חדשות (RSS), והזנת כתובת הבניין.

---

## 🛠️ טכנולוגיות (Tech Stack)

### צד שרת (Backend)
* **שפה:** Python 3.10+
* **Framework:** Flask
* **Database:** SQLite / PostgreSQL (באמצעות SQLAlchemy)
* **Auth:** JWT (JSON Web Tokens)
* **Migrations:** Flask-Migrate

### צד לקוח (Frontend)
* **Framework:** React (Vite)
* **שפה:** TypeScript
* **עיצוב:** Tailwind CSS
* **אייקונים:** Lucide-React
* **State Management:** Zustand (עבור ניהול משתמשים והתחברות)
* **HTTP Client:** Axios

---

## 🚀 הוראות התקנה והרצה

### 1. שכפול המאגר (Clone)
פתח את הטרמינל והרץ:
```bash
git clone [https://github.com/your-username/Vaad-Screens.git](https://github.com/your-username/Vaad-Screens.git)
cd Vaad-Screens
2. התקנת צד שרת (Backend)
ניכנס לתיקיית השרת, ניצור סביבה וירטואלית ונתקין תלויות.

Bash
cd backend

# יצירת סביבה וירטואלית (Windows)
python -m venv venv
venv\Scripts\activate

# התקנת החבילות
pip install -r requirements.txt
הגדרת מסד הנתונים:
יש להריץ את המיגרציות כדי ליצור את הטבלאות (users, announcements, buildings).

Bash
flask db upgrade
יצירת משתמש אדמין ראשוני:
יש להריץ את הסקריפט (או הפקודה) ליצירת המשתמש הראשון (אם לא קיים סיד אוטומטי):
(באופן זמני ניתן להשתמש ב-Flask Shell)

Bash
flask shell
>>> from app.extensions import db
>>> from app.models.user import User
>>> u = User(email="admin@vaad.com", full_name="Admin", is_admin=True)
>>> u.set_password("123456")
>>> db.session.add(u)
>>> db.session.commit()
>>> exit()
הרצת השרת:

Bash
flask run
השרת ירוץ כעת על http://localhost:5000

3. התקנת צד לקוח (Frontend)
פתח טרמינל חדש (אל תסגור את השרת), ונווט לתיקיית הלקוח.

Bash
cd frontend

# התקנת חבילות Node
npm install

# הרצת סביבת הפיתוח
npm run dev
האפליקציה תרוץ כעת על http://localhost:5173

📱 מדריך למשתמש
פרטי התחברות (ברירת מחדל)
אימייל: admin@vaad.com

סיסמה: 123456

כתובות גישה
דאשבורד ניהול: http://localhost:5173/login

מסך תצוגה (Kiosk): http://localhost:5173/display
(מומלץ ללחוץ F11 לתצוגת מסך מלא בטלוויזיה)

📂 מבנה הפרויקט
Plaintext
Vaad-Screens/
├── backend/                # צד שרת (Python/Flask)
│   ├── app/
│   │   ├── api/            # נקודות קצה (Routes)
│   │   ├── models/         # טבלאות ה-DB
│   │   └── middleware/     # אימות ו-CORS
│   ├── migrations/         # היסטוריית שינויי DB
│   └── app.py              # נקודת כניסה ראשית
│
└── frontend/               # צד לקוח (React/TS)
    ├── src/
    │   ├── api/            # הגדרות Axios
    │   ├── components/     # רכיבים (טיקר, קרוסלה, מודל)
    │   ├── pages/          # מסכים (Dashboard, Display, Login)
    │   └── store/          # ניהול מצב (Zustand)
    └── tailwind.config.js  # הגדרות עיצוב

🔮 תוכניות להמשך (Roadmap)
[ ] העלאת תמונות רקע למסך הפתיחה.

[ ] תמיכה במספר בניינים (Multi-Tenant אמיתי).

[ ] חיבור לוואטסאפ לשליחת הודעות מהירה.

[ ] אפליקציית מובייל לדיירים.