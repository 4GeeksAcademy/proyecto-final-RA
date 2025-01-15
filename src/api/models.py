from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import enum

db = SQLAlchemy()

# Definir los tipos ENUM de manera segura
class ConditionEnum(enum.Enum):
    new = 'new'
    used = 'used'

class TransactionTypeEnum(enum.Enum):
    purchase = 'purchase'
    trade = 'trade'

class StatusEnum(enum.Enum):
    pending = 'pending'
    completed = 'completed'
    canceled = 'canceled'


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    is_active = db.Column(db.Boolean, nullable=True)

    # Relaciones
    records = db.relationship('Record', backref='owner', lazy=True)
    collections = db.relationship('Collection', backref='user', lazy=True)
    sell_list = db.relationship('SellList', backref='user', lazy=True)
    wish_list = db.relationship('WishList', backref='user', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)
    transactions_buyer = db.relationship('Transaction', foreign_keys='Transaction.buyer_id', backref='buyer', lazy=True)
    transactions_seller = db.relationship('Transaction', foreign_keys='Transaction.seller_id', backref='seller', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "is_active": self.is_active,
        }


class Record(db.Model):
    __tablename__ = 'records'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    artist = db.Column(db.String, nullable=False)
    genre = db.Column(db.String, nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    condition = db.Column(db.Enum(ConditionEnum, name='condition_enum', create_type=False), nullable=False)
    image_url = db.Column(db.String, nullable=True)
    description = db.Column(db.Text, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relaciones
    collections = db.relationship('Collection', backref='record', lazy=True)
    sell_list = db.relationship('SellList', backref='record', lazy=True)
    wish_list = db.relationship('WishList', backref='record', lazy=True)
    comments = db.relationship('Comment', backref='record', lazy=True)
    transactions = db.relationship('Transaction', backref='record', lazy=True)

    def __repr__(self):
        return f'<Record {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "artist": self.artist,
            "genre": self.genre,
            "price": str(self.price),
            "condition": self.condition,
            "image_url": self.image_url,
            "description": self.description,
        }


class Collection(db.Model):
    __tablename__ = 'collections'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)

    def __repr__(self):
        return f'<Collection {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "record_id": self.record_id,
        }


class SellList(db.Model):
    __tablename__ = 'sell_list'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)

    def __repr__(self):
        return f'<SellList {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "record_id": self.record_id,
        }


class WishList(db.Model):
    __tablename__ = 'wish_list'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)

    def __repr__(self):
        return f'<WishList {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "record_id": self.record_id,
        }


class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<Comment {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "record_id": self.record_id,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
        }


class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    record_id = db.Column(db.Integer, db.ForeignKey('records.id'), nullable=False)
    transaction_type = db.Column(db.Enum(TransactionTypeEnum, name='transaction_type_enum', create_type=False), nullable=False)
    status = db.Column(db.Enum(StatusEnum, name='status_enum', create_type=False), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<Transaction {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "buyer_id": self.buyer_id,
            "seller_id": self.seller_id,
            "record_id": self.record_id,
            "transaction_type": self.transaction_type,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
