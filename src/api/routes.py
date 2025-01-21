"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import requests
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Record, Collection
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_login import current_user



api = Blueprint('api', __name__)

CORS(api)



from requests_oauthlib import OAuth1


# Claves y URL de la API de Discogs
DISCOGS_CONSUMER_KEY = 'kmEbvrXuklqaKnWubyqy'
DISCOGS_CONSUMER_SECRET = 'LWhxEIMhJHQrPQTIqhpOZhzCRJeccZAV'
ACCESS_TOKEN = 'ALJYHaInXueBuAgvKlnOnLojhaUPxgdsTJqzeOJv'
TOKEN_SECRET = 'XEGBwLwVNBQQqbXNxZxeLcgABTBqGGyDcaYYNFBM'
BASE_URL = 'https://api.discogs.com/'

@api.route('/search', methods=['GET'])
def search_discogs():
    query = request.args.get('q')
    search_type = request.args.get('type', 'release')  # 'release', 'artist', 'label', 'genre'
    
    oauth = OAuth1(
        DISCOGS_CONSUMER_KEY,
        DISCOGS_CONSUMER_SECRET,
        ACCESS_TOKEN,
        TOKEN_SECRET
    )
    
    url = f"{BASE_URL}/database/search"
    
    # Ajustamos los parámetros de la búsqueda según el tipo
    params = {'q': query, 'type': search_type}  # Cambiamos 'release' por search_type
    if search_type == 'artist':
        params['artist'] = query  # Si es búsqueda por artista
    elif search_type == 'label':
        params['label'] = query  # Si es búsqueda por sello
    elif search_type == 'genre':
        params['genre'] = query  # Si es búsqueda por género

    try:
        response = requests.get(url, auth=oauth, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

# -------------------------------------------------------------------------------------------------------


# Ruta para agregar un disco a la tabla records
@api.route('/add_record', methods=['POST'])
@jwt_required()  # Protege la ruta con JWT
def add_record():
    try:
        # Obtener los datos del disco desde la solicitud JSON
        data = request.get_json()

        # Validar que los datos esenciales estén presentes
        required_fields = ['title', 'label', 'year', 'genre', 'style', 'cover_image']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"Falta el campo: {field}"}), 400

        # Obtener el ID del usuario autenticado a través del JWT
        user_id = get_jwt_identity()  # Obtén el ID del usuario autenticado a través del token


        # Crear una nueva instancia del modelo Record con los datos proporcionados
        new_record = Record(
            title=data.get('title'),
            label=data.get('label'),
            year=data.get('year'),
            genre=data.get('genre'),
            style=data.get('style'),
            cover_image=data.get('cover_image'),
            owner_id=user_id  # Asocia el ID del usuario autenticado
        )

        # Agregar el nuevo disco a la base de datos
        db.session.add(new_record)
        db.session.commit()

        # Devolver la información del disco recién creado
        return jsonify({
            "message": "Disco agregado exitosamente",
            "record": {
                "id": new_record.id,
                "title": new_record.title,
                "label": new_record.label,
                "year": new_record.year,
                "genre": new_record.genre,
                "style": new_record.style,
                "cover_image": new_record.cover_image,
                "owner_id": new_record.owner_id
            }
        }), 201

    except Exception as e:
        db.session.rollback()  # Asegúrate de hacer rollback si ocurre un error
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
        # Obtener todos los usuarios
        users = User.query.all()
        # Serializar la información de cada usuario
        result = [user.serialize() for user in users]
        return jsonify(result), 200
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
@api.route('/edit_user/<int:user_id>', methods=['PUT'])
def edit_user(user_id):
    try:
        # Obtener los datos enviados en el cuerpo de la solicitud
        data = request.get_json()

        # Validar que los campos necesarios estén presentes
        if not data:
            return jsonify({"msg": "No se han proporcionado datos para actualizar"}), 400

        # Buscar el usuario en la base de datos
        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        # Actualizar los datos del usuario según los valores proporcionados
        if "name" in data:
            user.name = data["name"]

        if "email" in data:
            # Verificar si el nuevo correo ya existe en la base de datos
            existing_user = User.query.filter_by(email=data["email"]).first()
            if existing_user and existing_user.id != user_id:
                return jsonify({"msg": "El correo electrónico ya está en uso"}), 400
            user.email = data["email"]

        if "is_active" in data:
            user.is_active = data["is_active"]

        if "password" in data:
            # Actualizar la contraseña sin encriptar
            user.password = data["password"]

        # Guardar los cambios en la base de datos
        db.session.commit()

        return jsonify({"msg": "Usuario actualizado con éxito"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

    # ----------------------------------------------------------------------------------------------------------




