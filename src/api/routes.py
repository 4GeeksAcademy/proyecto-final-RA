"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import requests
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Record, Collection
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


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



@api.route('/search', methods=['GET'])
def search_discogs():
    query = requests.args.get('q', '')
    if not query:
        return jsonify({"error": "Search query is required"}), 400

    try:
        url = "https://api.discogs.com/database/search"
        params = {
            'q': query,
            'token': 'IbGAToUBoydGMQjHpMQIlzJbNkIfiywWVYlFmsgY',
            'type': 'release',
            'per_page': 10,
        }

        response = request.get(url, params=params)
        response.raise_for_status()

        data = response.json()

        # Guardar discos en la tabla `records`
        for release in data['results']:
            record = Record.query.filter_by(id=release['id']).first()
            if not record:
                new_record = Record(
                    id=release['id'],  # Suponiendo que el ID es único en Discogs
                    title=release['title'],
                    artist=release['artist'],  # Campos personalizados según API
                    year=release.get('year', None)
                )
                db.session.add(new_record)
        db.session.commit()

        return jsonify(data['results'])

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    
# -----------------------------------------------------------------------------------------------

@api.route('/add-record', methods=['POST'])
@jwt_required()  # Requiere que el usuario esté autenticado
def add_record():
    data = request.json
    try:
        # Obtener el ID del usuario logueado desde el token JWT
        owner_id = get_jwt_identity()

        title = data.get('title')
        cover_image = data.get('image_url')

        if not title or not cover_image:
            return jsonify({"error": "Faltan datos requeridos: title y cover_image"}), 400

        # Crear un nuevo registro asociado al usuario logueado
        new_record = Record(
            title=title,
            cover_image=cover_image,
            owner_id=owner_id  # Asignar el usuario logueado como propietario
        )

        db.session.add(new_record)
        db.session.commit()

        return jsonify({
            "message": "Record added successfully",
            "record": new_record.serialize()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




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




