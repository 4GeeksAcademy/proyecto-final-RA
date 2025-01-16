"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
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
    # Obtener el nombre del disco desde la query string (parámetro de búsqueda)
    query = request.args.get('q', '')  # Por defecto, si no se pasa un término, se buscará vacío

    if not query:
        return jsonify({"error": "Search query is required"}), 400

    try:
        # Construir la URL de búsqueda de Discogs
        url = "https://api.discogs.com/database/search"
        params = {
            'q': query,
            'token': 'IbGAToUBoydGMQjHpMQIlzJbNkIfiywWVYlFmsgY',  # Reemplazar con tu token
            'type': 'release',  # Buscar solo discos (releases)
            'per_page': 10,     # Limitar a los primeros 10 resultados
        }

        # Realizar la solicitud GET a la API de Discogs
        response = request.get(url, params=params)
        response.raise_for_status()  # Lanzar error si la respuesta no es exitosa

        # Obtener los resultados de la API y devolverlos como JSON
        data = response.json()
        return jsonify(data['releases'])

    except request.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500



@api.route('/add_to_collection', methods=['POST'])
@jwt_required()  # Aseguramos que el usuario esté autenticado
def add_to_collection():
    try:
        # Obtener la identidad del usuario (id)
        user_id = get_jwt_identity()

        # Obtener el disco a agregar (ID del disco)
        record_id = request.json.get('record_id', None)

        # Verificar si el disco existe
        record = Record.query.get(record_id)
        if not record:
            return jsonify({"msg": "Disco no encontrado"}), 404

        # Verificar si el usuario ya tiene este disco en su colección
        existing_collection = Collection.query.filter_by(user_id=user_id, record_id=record_id).first()
        if existing_collection:
            return jsonify({"msg": "Este disco ya está en tu colección"}), 400

        # Crear una nueva entrada en la colección
        new_collection = Collection(user_id=user_id, record_id=record_id)
        db.session.add(new_collection)
        db.session.commit()

        return jsonify({"msg": "Disco agregado a tu colección con éxito"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


