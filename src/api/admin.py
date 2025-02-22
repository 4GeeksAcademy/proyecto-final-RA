  
import os
from flask_admin import Admin
from .models import db, User, Record, SellList, WishList, Comment, Transaction, ExchangeList
from flask_admin.contrib.sqla import ModelView # type: ignore

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Record, db.session))
    admin.add_view(ModelView(SellList, db.session))
    admin.add_view(ModelView(WishList, db.session))
    admin.add_view(ModelView(Comment, db.session))
    admin.add_view(ModelView(Transaction, db.session))
    admin.add_view(ModelView(ExchangeList, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))