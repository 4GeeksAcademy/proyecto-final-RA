"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import requests
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Record, SellList, WishList, Comment, ExchangeList, Transaction
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_login import current_user
from sqlalchemy.orm import aliased
import logging
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

CORS(api)

logging.basicConfig(filename="error.log", level=logging.ERROR, format="%(asctime)s - %(levelname)s - %(message)s")

from requests_oauthlib import OAuth1

DISCOGS_CONSUMER_KEY = 'kmEbvrXuklqaKnWubyqy'
DISCOGS_CONSUMER_SECRET = 'LWhxEIMhJHQrPQTIqhpOZhzCRJeccZAV'
ACCESS_TOKEN = 'ALJYHaInXueBuAgvKlnOnLojhaUPxgdsTJqzeOJv'
TOKEN_SECRET = 'XEGBwLwVNBQQqbXNxZxeLcgABTBqGGyDcaYYNFBM'
BASE_URL = 'https://api.discogs.com/'

@api.route('/search', methods=['GET'])
@jwt_required()
def search_discogs():
    query = request.args.get('q')
    search_type = request.args.get('type', 'release')
    
    oauth = OAuth1(
        DISCOGS_CONSUMER_KEY,
        DISCOGS_CONSUMER_SECRET,
        ACCESS_TOKEN,
        TOKEN_SECRET
    )
    
    url = f"{BASE_URL}/database/search"
    params = {'q': query, 'type': search_type} 
    if search_type == 'artist':
        params['artist'] = query 
    elif search_type == 'label':
        params['label'] = query 
    elif search_type == 'genre':
        params['genre'] = query

    try:
        response = requests.get(url, auth=oauth, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

# -------------------------------------------------------------------------------------------------------

@api.route('/add_record', methods=['POST'])
@jwt_required()
def add_record():
    try:
        data = request.get_json()

     
        required_fields = ['title', 'label', 'year', 'genre', 'style', 'cover_image']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Falta el campo: {field}"}), 400

      
        user_id = get_jwt_identity()

      
        new_record = Record(
            title=data.get('title'),
            label=data.get('label'),
            year=data.get('year'),
            genre=data.get('genre'),
            style=data.get('style'),
            cover_image=data.get('cover_image'),
            owner_id=user_id 
        )

       
        db.session.add(new_record)
        db.session.commit()

        return jsonify({
            "message": "Disco agregado exitosamente",
            "record": new_record.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al agregar disco: {str(e)}"}), 500




# /////////////////////////////////////////////////////////////////////////////////////////////////////////////




@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/users', methods=['GET'])
def get_users():
    try:
    
        users = User.query.all()
  
        result = [user.serialize() for user in users]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


from sqlalchemy.exc import SQLAlchemyError

@api.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        
        return jsonify(user.serialize()), 200

    except SQLAlchemyError as e:

        return jsonify({"error": f"Error en la base de datos: {str(e)}"}), 500
    
    except Exception as e:
    
        return jsonify({"error": f"Error inesperado: {str(e)}"}), 500



@api.route('/register', methods=['POST'])
def register():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        
        if not email or not password:
            raise Exception('Faltan datos: email o contraseña')
        
        check_user = User.query.filter_by(email=email).first()
        if check_user:
            return jsonify({"msg": "Ya existe un usuario con este correo, intenta iniciar sesión"}), 400
        
        hashed_password = generate_password_hash(password)

        new_user = User(email=email, password=hashed_password, is_active=True)
        db.session.add(new_user)
        db.session.commit()
        
        access_token = create_access_token(identity=str(new_user.id))
        return jsonify({"msg": "Usuario registrado con éxito", "token": access_token}), 201

    except Exception as error:
        return jsonify({"error": str(error)}), 400

@api.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)

        if not email or not password:
            raise Exception('Faltan datos: email o contraseña')
        
        check_user = User.query.filter_by(email=email).first()

        if not check_user:
            return jsonify({"msg": "Usuario no encontrado"}), 404


        if not check_password_hash(check_user.password, password):
            return jsonify({"msg": "Contraseña incorrecta"}), 401

        access_token = create_access_token(identity=str(check_user.id))
        return jsonify({"msg": "Inicio de sesión exitoso", 'token': access_token}), 200
    
    except Exception as error:
        return jsonify({'error': str(error)}), 400


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    try:
        id = get_jwt_identity()
        user = User.query.get(id)

        if not user:
            return jsonify({"msg": "algo ha ido mal"}), 404
        
        return jsonify({"user": user.serialize()}), 200
    except Exception as error:
        return jsonify({'error': str(error)}), 400




    
# -----------------------------------------------------------------------------------------------





# -----------------------------------------------------------------------------------------------
@api.route('/edit_user', methods=['PUT'])
@jwt_required()
def edit_user():
    try:
        id = get_jwt_identity()
        user = User.query.get(id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        data = request.get_json()

        if not data:
            return jsonify({"msg": "No se han proporcionado datos para actualizar"}), 400

        

        if "name" in data:
            user.name = data["name"]

        if "email" in data:
            existing_user = User.query.filter_by(email=data["email"]).first()
            if existing_user and existing_user.id != id:
                return jsonify({"msg": "El correo electrónico ya está en uso"}), 400
            user.email = data["email"]

        if "is_active" in data:
            user.is_active = data["is_active"]

        if "password" in data:
            user.password = data["password"]

    
        db.session.commit()

        return jsonify({"msg": "Usuario actualizado con éxito"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

    # ----------------------------------------------------------------------------------------------------------

from sqlalchemy import or_

from sqlalchemy import or_

@api.route('/records', methods=['GET'])
@jwt_required()
def get_records():
    try:
        id = get_jwt_identity() 


        subquery = db.session.query(ExchangeList.origin_disc_id).filter(ExchangeList.requester_id == id).subquery()

        records = Record.query.filter(
            or_(
            Record.owner_id == id,
            Record.id.in_(
            db.session.query(ExchangeList.origin_disc_id).filter(ExchangeList.requester_id == id)
        )
    )
).all()

    
        serialized_records = [record.serialize() for record in records]
        return jsonify(serialized_records), 200

    except Exception as e:
        return jsonify({"error": "Error al obtener los registros", "message": str(e)}), 500





@api.route('/records/<int:record_id>', methods=['DELETE'])
@jwt_required()
def delete_record(record_id):
    try:

        SellList.query.filter_by(record_id=record_id).delete()
        WishList.query.filter_by(record_id=record_id).delete()

        record = Record.query.get(record_id)
        if not record:
            return jsonify({"error": "Disco no encontrado."}), 404

        db.session.delete(record)
        db.session.commit()
        
        return jsonify({"msg": "Disco y comentarios eliminados correctamente."}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al eliminar: {str(e)}"}), 500


@api.route('/sell_list', methods=['POST'])
@jwt_required() 
def add_to_sell_list():
    try:
   
        data = request.get_json()
        record_id = data.get('record_id')

        if not record_id:
            return jsonify({'error': 'record_id es requerido'}), 400
        
   
        user_id = get_jwt_identity()

  
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'El usuario no existe'}), 404
        
     
        record = Record.query.get(record_id)
        if not record:
            return jsonify({'error': 'El disco no existe'}), 404
        
      
        new_sell_list_item = SellList(user_id=user_id, record_id=record_id)
        

        db.session.add(new_sell_list_item)
        db.session.commit()
        
        return jsonify({'message': 'Disco agregado a la lista de venta', 'id': new_sell_list_item.id}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Error al agregar el disco: {str(e)}'}), 500



@api.route('/sell_lista', methods=['GET'])
@jwt_required()
def get_sell_list():
    try:
        id = get_jwt_identity()
        sell_list_discs = SellList.query.filter_by(user_id=id).all()

        if not sell_list_discs:
            return jsonify({'sellList': [], 'message': 'No hay discos en venta'}), 200

        sell_list = [disc.serialize() for disc in sell_list_discs]
        return jsonify({'sellList': sell_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/get_all_sell', methods=['GET'])
@jwt_required()
def get_sell_lists():
    try:
        exchange_list_alias = aliased(ExchangeList)

        sell_list_discs = SellList.query.filter(
            ~SellList.id.in_(
                db.session.query(exchange_list_alias.origin_disc_id)
                .union(
                    db.session.query(exchange_list_alias.target_disc_id)
                )
            )
        ).all()

        sell_list = []
        for disc in sell_list_discs:
            user = get_user_by_id(disc.user_id) 
            sell_list.append({
                **disc.serialize(),  
                "username": user.email if user else "Unknown" 
            })

        return jsonify({'sellList': sell_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


from flask_jwt_extended import get_jwt_identity
from sqlalchemy import or_

@api.route('/get_all_sell_list', methods=['GET'])
@jwt_required()
def get_all_sell_list():
    try:
        user_id = get_jwt_identity() 
        
    
        pending_exchange_subquery = db.session.query(ExchangeList.origin_disc_id).filter(
            ExchangeList.status == "pending"
        ).subquery()

    
        query = SellList.query.filter(~SellList.record_id.in_(pending_exchange_subquery))
        
    
        if user_id:
            query = query.filter(SellList.user_id != user_id)

        sell_list_items = query.all()
        sell_list_data = [item.serialize() for item in sell_list_items]

        return jsonify({"sellList": sell_list_data}), 200

    except Exception as e:
        return jsonify({
            "error": "Error al obtener la lista de discos en venta",
            "details": str(e)
        }), 500






@api.route('/sell_lista/<int:record_id>', methods=['DELETE'])
@jwt_required()
def delete_sellList_record(record_id):
    try:

        
        record = SellList.query.get(record_id)
        if not record:
            return jsonify({"error": "Disco no encontrado."}), 404

        db.session.delete(record)
        db.session.commit()
        return jsonify({"msg": "Disco eliminado correctamente."}), 200

    except Exception as e:
        return jsonify({"error": "Error al eliminar el disco", "message": str(e)}), 500
    


@api.route('/wishlist', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    try:
        user_id = get_jwt_identity() 
        data = request.get_json()

        if not user_id:
            return jsonify({"error": "No se encontró el ID del usuario"}), 400

        if not data or 'record_id' not in data:
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        record_id = data['record_id']
        print("ID del disco:", record_id)


        record = Record.query.get(record_id)
        if not record:
            return jsonify({"error": "El disco no existe en la base de datos."}), 404

        
        existing_entry = WishList.query.filter_by(user_id=user_id, record_id=record_id).first()
        if existing_entry:
            return jsonify({"message": "Este disco ya está en tu wishlist."}), 400

    
        new_entry = WishList(user_id=user_id, record_id=record_id)
        db.session.add(new_entry)
        db.session.commit()

        return jsonify({"message": "Disco agregado a tu wishlist."}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500



@api.route('/wishlist/<int:record_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(record_id):
    user_id = get_jwt_identity()
    
    wishlist_item = WishList.query.filter_by(user_id=user_id, record_id=record_id).first()
    if not wishlist_item:
        return jsonify({"error": "El ítem no está en la wishlist"}), 404

    db.session.delete(wishlist_item)
    db.session.commit()

    return jsonify({"msg": "Eliminado correctamente"}), 200






@api.route("/wishlist", methods=["GET"])
@jwt_required()
def get_wishlist():
    try:
        
        user_id = get_jwt_identity()

    
        wishlist_items = WishList.query.filter_by(user_id=user_id).all()

        
        if not wishlist_items:
            return jsonify([]), 200

    
        wishlist_data = [
            {
                "id": item.id,
                "record_id": item.record.id,
                "record_title": item.record.title,
                "record_artist": getattr(item.record, "artist", "Desconocido"),
                "record_cover_image": item.record.cover_image,
                "record_label": item.record.label,
                "record_year": item.record.year,
                "record_genre": item.record.genre
            }
            for item in wishlist_items
        ]

        return jsonify(wishlist_data), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": "Error al obtener la wishlist", "details": str(e)}), 500


# ---------------------------------------------------------------------------------------------------

from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User, Record

@api.route('/exchange', methods=['POST'])
@jwt_required()
def create_exchange():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()

    
        print(f"\n=== Datos recibidos ===")
        print(f"Usuario: {user_id}")
        print(f"Disco objetivo ID: {data.get('target_record_id')}")
        print(f"Disco ofrecido ID: {data.get('offered_record_id')}\n")

    
        offered_record = Record.query.get(data['offered_record_id'])
        
        if not offered_record:
            return jsonify({"error": "Disco ofrecido no existe"}), 404

        print(f"=== Disco ofrecido ===")
        print(f"ID: {offered_record.id}")
        print(f"Título: {offered_record.title}")
        print(f"Dueño actual: {offered_record.owner_id}\n")

        if offered_record.owner_id != user_id:
            return jsonify({
                "error": f"""
                    Error de propiedad. 
                    Dueño real: {offered_record.owner_id}
                    Usuario logueado: {user_id}
                """
            }), 403

    
        if not data or 'target_record_id' not in data or 'offered_record_id' not in data:
            return jsonify({"error": "Datos incompletos"}), 400

        target_record = Record.query.get(data['target_record_id'])
        offered_record = Record.query.get(data['offered_record_id'])
        
        if not target_record or not offered_record:
            return jsonify({"error": "Uno de los discos no existe"}), 404

       
        if offered_record.owner_id != user_id:
            return jsonify({
                "error": f"El disco ofrecido no te pertenece. Dueño real: {offered_record.owner_id}"
            }), 403

   
        new_exchange = ExchangeList(
            requester_id=user_id,
            origin_disc_id=target_record.id,
            target_disc_id=offered_record.id,
            status="pending"
        )

        db.session.add(new_exchange)
        db.session.commit()

        return jsonify({
            "message": "Intercambio solicitado exitosamente",
            "exchange": new_exchange.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



    # -----------------------------------------------------------------------------------------------------------------



@api.route('/comments/<int:record_id>', methods=['GET'])
def get_comments(record_id):
    try:
        comments = Comment.query.filter_by(record_id=record_id).all()

        if not comments:
            return jsonify({"message": "No hay comentarios para este disco."}), 200

        return jsonify([comment.serialize() for comment in comments]), 200

    except Exception as e:
        print("Error en la API:", str(e))  
        return jsonify({"error": "Error al obtener los comentarios"}), 500




@api.route("/comments", methods=["POST"])
@jwt_required()
def add_comment():
    data = request.get_json()
    user_id = get_jwt_identity()

    if not data or "record_id" not in data or "content" not in data:
        return jsonify({"error": "record_id y content son campos requeridos"}), 400

    comment = Comment(
        user_id=user_id,
        record_id=data["record_id"],
        content=data["content"],
    )
    db.session.add(comment)
    db.session.commit()

    return jsonify(comment.serialize()), 201

@api.route('/user', methods=['DELETE'])
@jwt_required()
def delete_user():
    try:
        user_id = get_jwt_identity() 

        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

      
        WishList.query.filter_by(user_id=user_id).delete()
        SellList.query.filter_by(user_id=user_id).delete()
        Record.query.filter_by(owner_id=user_id).delete()

    
        db.session.delete(user)
        db.session.commit() 

        return jsonify({"msg": "Usuario y sus datos han sido eliminados correctamente"}), 200

    except Exception as e:
        db.session.rollback() 
        return jsonify({"error": str(e)}), 500

def delete_comments_by_record(record_id):
    try:
       
        deleted_rows = Comment.query.filter_by(record_id=record_id).delete()

        if deleted_rows == 0:
            return jsonify({"message": "No comments found for this record"}), 404

        db.session.commit()
        return jsonify({"message": f"{deleted_rows} comments deleted successfully"}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"Database error while deleting comments: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

def get_user_by_id(user_id): 
    try:
        user = User.query.filter_by(id=user_id).first()
        return user  
    except SQLAlchemyError as e:
        logging.error(f"Database error while fetching user: {str(e)}")
        return None 



@api.route('/purchase', methods=['POST'])
@jwt_required()
def purchase_record():
    buyer_id = get_jwt_identity()
    data = request.get_json()

    if not data or 'record_id' not in data:
        return jsonify({"error": "Datos insuficientes"}), 400

    try:
        SellList.query.filter_by(record_id=data['record_id']).delete()
        
        record = Record.query.get(data['record_id'])
        if not record:
            return jsonify({"error": "Disco no encontrado"}), 404
            
        record.owner_id = buyer_id
        
        new_transaction = Transaction(
            buyer_id=buyer_id,
            seller_id=record.owner_id, 
            record_id=data['record_id']
        )
        db.session.add(new_transaction)
        
        db.session.commit()

        return jsonify({
            "message": "Compra exitosa",
            "record": record.serialize(),
            "transaction_id": new_transaction.id
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error en la compra: {str(e)}"}), 500

@api.route('/user_records', methods=['GET'])  
@jwt_required()
def get_user_records():
    try:
        user_id = get_jwt_identity()
        records = Record.query.filter_by(owner_id=user_id).all()
        
        return jsonify([{
            "id": record.id,
            "title": record.title,
            "year": record.year,
            "genre": record.genre,
            "owner_id": record.owner_id,  
            "cover_image": record.cover_image
        } for record in records]), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/validate_token', methods=['GET'])
@jwt_required()
def validate_token():
    try:
        
        user_id = get_jwt_identity()
        

        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
            
        return jsonify(user.serialize()), 200
        
    except Exception as e:
        return jsonify({"msg": "Error validando token", "error": str(e)}), 500