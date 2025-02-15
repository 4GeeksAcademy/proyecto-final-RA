from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import UserMixin

db = SQLAlchemy()

# MODELOS
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    # Relaciones
    records = db.relationship('Record', backref='owner', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)
    transactions_as_buyer = db.relationship('Transaction', foreign_keys='Transaction.buyer_id', backref='buyer', lazy=True)
    transactions_as_seller = db.relationship('Transaction', foreign_keys='Transaction.seller_id', backref='seller', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "is_active": self.is_active,
            "records": [record.id for record in self.records],
        }


class Record(db.Model):
    __tablename__ = 'records'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=True)
    label = db.Column(db.String(500), nullable=True)
    year = db.Column(db.String(255), nullable=True)
    genre = db.Column(db.String(255), nullable=True)
    style = db.Column(db.String(255), nullable=True)
    cover_image = db.Column(db.String(255), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relaciones
    comments = db.relationship('Comment', backref='record', lazy=True)
    transactions = db.relationship('Transaction', backref='record', lazy=True)

    def __repr__(self):
        return f'<Record {self.title}>'

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "label": self.label,
            "year": self.year,
            "genre": self.genre,
            "style": self.style,
            "cover_image": self.cover_image,
            "owner_id": self.owner_id,
        }


class SellList(db.Model):
    __tablename__ = 'sell_list'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'record_id', name='unique_sell_list'),  # Evita duplicados
    )
    user = db.relationship('User', backref='sell_list', lazy=True)

    record = db.relationship('Record', backref='sell_list', lazy=True)

    def __repr__(self):
        return f'<SellList {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": self.user.name,
            "user_email": self.user.email, 
            "record_id": self.record_id,
            "record_title": self.record.title, 
            "record_cover_image": self.record.cover_image,
            "record_label": self.record.label,
            "record_year": self.record.year,
            "record_genre": self.record.genre,
        }



class WishList(db.Model):
    __tablename__ = 'wish_list'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'record_id', name='unique_wish_list'),  # Evita duplicados
    )

    user = db.relationship('User', backref='wish_list', lazy=True)


    record = db.relationship('Record', backref='wish_list', lazy=True)

    def __repr__(self):
        return f'<WishList {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_name": self.user.name,
            "user_email": self.user.email,
            "record_id": self.record_id,
            "record_title": self.record.title,
            "record_cover_image": self.record.cover_image,
            "record_label": self.record.label,
            "record_year": self.record.year,
            "record_genre": self.record.genre,
        }


class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Referencia corregida
    content = db.Column(db.Text, nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)  # Referencia corregida

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user.name if self.user else "Anónimo",  # Devuelve el nombre del usuario
            "content": self.content,
            "record_id": self.record_id
        }





class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Transaction {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "buyer_id": self.buyer_id,
            "seller_id": self.seller_id,
            "record_id": self.record_id,
            "status": self.status.value,  # Elimina el campo transaction_type
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


    
class ExchangeList(db.Model):
    __tablename__ = 'exchangelist'
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    origin_disc_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=True)  # Disco que quiere obtener
    target_disc_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=True)  # Disco que ofrece a cambio
    status = db.Column(db.String(20), default="pending")  # Estados posibles: pending, accepted, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones
    requester = db.relationship("User", foreign_keys=[requester_id], backref="exchanges_requested")

    def __repr__(self):
        return f'<Exchange {self.id} - Status: {self.status}>'

    def serialize(self):
        return {
            "id": self.id,
            "requester_id": self.requester_id,
            "origin_disc_id": self.exchanges.origin_disc_id,
            "target_disc_id": self.target_disc_id,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
