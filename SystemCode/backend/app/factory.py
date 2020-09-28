'''
Application factory methods
'''
import os
from flask import Flask, Blueprint, jsonify, request, send_from_directory

from .context import set_obj
from .images import save_image, images_dir
from .classifier import predict_real_fake


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

  # retrieve images
  @backend.route('/image/<path:path>')
  def image_get(path):
    idx = path.rindex('/')
    folder = images_dir(path[0:idx])
    filename = path[idx+1:]
    return send_from_directory(folder, filename)

  # store images
  @backend.route('/image', methods=['POST'])
  def image_post():
    if request.files:
      image = request.files['image']
      result = save_image(image)
      return jsonify(result)
    else:
      return jsonify({'error': 'no image'})

  # image classification
  @backend.route('/image/classify', methods=['POST'])
  def classify():
    req = request.get_json()
    usecase = req['type']

    if(usecase == 'real_fake'):
      img_uuid = req['image']['uuid']
      img_type = req['image']['type']

      mdl_name = None
      mdl_version = None
      if req['model'] is not None:
        mdl_name = req['model']['name']
        mdl_version = req['model']['version']
      
      result = predict_real_fake(img_uuid, img_type, mdl_name, mdl_version)
      return jsonify(result)
    else:
      return jsonify({'error': 'invalid type'})

  return backend

