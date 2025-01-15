"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Record
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200



@api.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    new_user = User(name=data['name'], email=data['email'], password=data['password'], is_active=True)
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201

@api.route('/records', methods=['GET'])
def get_records():
    records = Record.query.all()
    return jsonify([record.serialize() for record in records])


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