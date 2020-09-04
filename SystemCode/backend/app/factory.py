'''
Application factory methods
'''
import os
from flask import Flask, Blueprint, jsonify, request

from .context import set_obj
from .images import save_image


def build():
  '''
  Build flask application
  '''
  app = Flask(__name__, instance_relative_config=True)
  
  # ensure the instance folder exists
  os.makedirs(app.instance_path, exist_ok=True)

  # register blueprints
  app.register_blueprint(build_backend(), url_prefix='/backend')

  set_obj('app', app)
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

  # store images
  @backend.route('/image', methods=['POST'])
  def image_post():
    if request.files:
      image = request.files['image']
      result = save_image(image)
      return jsonify(result)
    else:
      return jsonify({'error': 'no image'})

  return backend

