from flask import Flask
from routes import register_routes
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    register_routes(app)

    return app
