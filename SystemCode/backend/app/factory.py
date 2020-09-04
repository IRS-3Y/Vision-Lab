'''
Application factory methods
'''
import os
from flask import Flask, Blueprint, jsonify


def build():
  '''
  Build flask application
  '''
  app = Flask(__name__, instance_relative_config=True)
  
  # ensure the instance folder exists
  try:
    os.makedirs(app.instance_path)
  except OSError:
    pass

  # register blueprints
  app.register_blueprint(build_backend(), url_prefix='/backend')
  return app


def build_backend():
  '''
  Build backend APIs blueprint
  '''
  backend = Blueprint('backend', __name__)

  # check status
  @backend.route('/status')
  def status():
    return jsonify({'status': 'ok'})

  return backend

