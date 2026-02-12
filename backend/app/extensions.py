# backend/app/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# אנחנו רק יוצרים את האובייקטים, אבל לא מחברים אותם לאפליקציה עדיין
db = SQLAlchemy()
migrate = Migrate()