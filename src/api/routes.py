"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import requests
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Record, SellList
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_login import current_user

api = Blueprint('api', __name__)

CORS(api)

from requests_oauthlib import OAuth1

DISCOGS_CONSUMER_KEY = 'kmEbvrXuklqaKnWubyqy'
DISCOGS_CONSUMER_SECRET = 'LWhxEIMhJHQrPQTIqhpOZhzCRJeccZAV'
ACCESS_TOKEN = 'ALJYHaInXueBuAgvKlnOnLojhaUPxgdsTJqzeOJv'
TOKEN_SECRET = 'XEGBwLwVNBQQqbXNxZxeLcgABTBqGGyDcaYYNFBM'
BASE_URL = 'https://api.discogs.com/'

@api.route('/search', methods=['GET'])
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


@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:

        user = User.query.get(user_id)

        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        
        return jsonify(user.serialize()), 200

  
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route('/register', methods=['POST'])
def register():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        
        if not email or not password:
            raise Exception('Faltan datos: name, email o contraseña')
        
        check_user = User.query.filter_by(email=email).first()

        if check_user:
            return jsonify({"msg": "Ya exite un usuario con este correo, intenta iniciar sesion"}), 400
        
        new_user = User(email=email, password=password, is_active=True)
        db.session.add(new_user)
        db.session.commit()
        
        access_token = create_access_token(identity=str(new_user.id))
        return ({"msg": "Usuario registrado con exito", "token": access_token}), 201

    except Exception as error:
        return jsonify({"error": str(error)}), 400

@api.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get('email', None)
        password = request.json.get('password', None)

        if not email or not password:
            raise Exception('Faltan datos: email o contrasena')
        
        check_user = User.query.filter_by(email=email).first()

        if not check_user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        if check_user.password != password:
            return jsonify({"msg": "Contrasena incorrecta"}), 401

        access_token = create_access_token(identity=str(check_user.id))
        return jsonify({"msg": "Inicio de sesion exitoso", 'token': access_token}), 200
    
    except Exception as error:
        return jsonify({'error': str(error)}), 400


@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    id = get_jwt_identity()
    user = User.query.get(id)

    if not user:
        return jsonify({"msg": "algo ha ido mal"}), 404
    
    return jsonify({"user": user.serialize()}), 200




    
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

@api.route('/records', methods=['GET'])
@jwt_required()
def get_records():
    try:
        id = get_jwt_identity()
        records = Record.query.filter_by(owner_id=id).all()
        serialized_records = [record.serialize() for record in records]
        return jsonify(serialized_records), 200
    except Exception as e:
        return jsonify({"error": "Error al obtener los registros", "message": str(e)}), 500



@api.route('/records/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    try:
       
        sell_list_entry = SellList.query.filter_by(record_id=record_id).first()
        if sell_list_entry:
            return jsonify({"error": "El disco está en venta y no se puede eliminar."}), 400

        record = Record.query.get(record_id)
        if not record:
            return jsonify({"error": "Disco no encontrado."}), 404

        db.session.delete(record)
        db.session.commit()
        return jsonify({"msg": "Disco eliminado correctamente."}), 200

    except Exception as e:
        return jsonify({"error": "Error al eliminar el disco", "message": str(e)}), 500


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



@api.route('/sell_lista/<int:record_id>', methods=['DELETE'])
def delete_sellList_record(record_id):
    try:

        # Eliminar el registro si no está en venta
        record = SellList.query.get(record_id)
        if not record:
            return jsonify({"error": "Disco no encontrado."}), 404

        db.session.delete(record)
        db.session.commit()
        return jsonify({"msg": "Disco eliminado correctamente."}), 200

    except Exception as e:
        return jsonify({"error": "Error al eliminar el disco", "message": str(e)}), 500