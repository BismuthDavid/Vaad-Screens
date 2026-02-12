# 🏢 Vaad-Screens - Smart Lobby Display System

מערכת SaaS לניהול והצגת תוכן על מסכים חכמים בלובי של בנייני מגורים. המערכת מאפשרת לוועדי בית לנהל הודעות, עדכונים ומידע רלוונטי לדיירים בזמן אמת דרך ממשק ניהול מרכזי.



[Image of SaaS Architecture Diagram]


## 🚀 המצב הנוכחי (Current Status)

המערכת נמצאת בשלבי הקמה ראשוניים (MVP - Infrastructure Phase). 
נכון לעכשיו, התשתיות הבאות כבר הוקמו:

- [x] **Backend Skeleton:** הקמת שרת Flask בפורמט Application Factory.
- [x] **Database:** חיבור למסד נתונים PostgreSQL הרץ בתוך Docker.
- [x] **Multi-Tenant Models:** הגדרת מודלים לבניינים ומשתמשים עם זיהוי UUID.
- [x] **Authentication:** מנגנון התחברות (Login) מבוסס JWT.
- [x] **Database Seed:** סקריפט להזנת נתונים ראשוניים למערכת.

---

## 🛠 טכנולוגיות (Tech Stack)

### Backend
* **Language:** Python 3.x
* **Framework:** Flask
* **ORM:** SQLAlchemy + Flask-Migrate
* **Database:** PostgreSQL (Dockerized)
* **Auth:** JWT (PyJWT)

### Frontend (מתוכנן)
* **Framework:** React + Vite
* **Styling:** Tailwind CSS + Material UI
* **State Management:** TanStack Query + Zustand

---

## 🎯 יעדים ותוכניות (Roadmap)

### שלב 1: ממשק ניהול (Admin Dashboard) - *בביצוע*
- [ ] פיתוח ה-Frontend ב-React.
- [ ] יצירת דף התחברות (Login Screen).
- [ ] ממשק CRUD לניהול הודעות ועד (Announcements).

### שלב 2: אפליקציית התצוגה (Display App)
- [ ] יצירת דף "מצב תצוגה" המותאם למסכים גדולים.
- [ ] שילוב Widgets: מזג אוויר, זמני תחבורה ציבורית, כניסת שבת.
- [ ] מנגנון רוטציה בין הודעות.

### שלב 3: פיצ'רים מתקדמים
- [ ] התראות פיקוד העורף בזמן אמת (API).
- [ ] ניהול חבילות ודואר.
- [ ] מנגנון Pairing למסכים חדשים (קוד זיווג).

---

## 💻 איך להריץ את הפרויקט (Development)

1. **הרמת ה-Database:**
   ```bash
   docker-compose up -d

הגדרת ה-Backend:
```

```Bash
cd backend
python -m venv venv
source venv/bin/activate  # או venv\Scripts\activate ב-Windows
pip install -r requirements.txt```

הרצת השרת:

```Bash
flask run```

איתחול נתונים (פעם ראשונה):

```Bash
python seed.py```

