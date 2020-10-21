'''
Application factory methods
'''
import os
from flask import Flask, Blueprint, jsonify, request, send_from_directory
from flask_cors import CORS
import tensorflow as tf

from .context import set_obj
from .images import save_image, images_dir, get_image_stats, set_image_stat
from .files import upload_file, upload_file_chunk, files_dir
from .models import upload_model, delete_model, get_models, update_model
from .classifier import predict_real_fake
from .generator import generate_image
from .entities import set_setting, get_settings


def build():
  '''
  Build flask application
  '''
  app = Flask(__name__, instance_relative_config=True)
  CORS(app)
  
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
    return jsonify({
      'status': 'ok',
      'tensorflow': {
        'version': tf.__version__,
        'gpu': tf.config.list_physical_devices('GPU') if tf.__version__.startswith('2.') else tf.test.gpu_device_name()
      }
    })

  # get system settings
  @backend.route('/settings')
  def settings_get():
    return jsonify(get_settings())

  # set system settings
  @backend.route('/settings', methods=['POST'])
  def settings_post():
    req = request.get_json()
    count = 0
    for key in req:
      set_setting(key, req[key])
      count += 1
    return jsonify({'count': count})

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
  def image_classify():
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

  # image generation
  @backend.route('/image/generate', methods=['POST'])
  def image_generate():
    req = request.get_json()
    if req['model'] is None:
      return jsonify({'error': 'missing model'})
    else:
      mdl_name = req['model']['name']
      mdl_version = req['model']['version']
      result = generate_image(mdl_name, mdl_version)
      return jsonify(result)

  # query image statistics
  @backend.route('/image/stats')
  def image_stats():
    return jsonify(get_image_stats())

  # update image statistics
  @backend.route('/image/stats', methods=['POST'])
  def image_stats_post():
    req = request.get_json()
    try:
      image = req['image']
      model = req['model']
      count = 0
      for stat in req['stats']:
        set_image_stat(image['uuid'], image['type'], model['name'], model['version'], stat['name'], stat['delta'])
        count += 1
      return jsonify({'count': count})
    except KeyError as e:
      return jsonify({'error': f"missing {e.args[0]}"})
  
  # handle large file uploading (init)
  @backend.route('/file/upload', methods=['POST'])
  def file_upload_init():
    req = request.get_json()
    try:
      file_uuid = req['uuid']
      file_type = req['type']
      upload_file(file_uuid, file_type)
      return jsonify({'uuid': file_uuid})
    except KeyError as e:
      return jsonify({'error': f"missing {e.args[0]}"})

  # handle large file uploading (chunk)
  @backend.route('/file/upload/<uuid>/<offset>', methods=['POST'])
  def file_upload_chunk(uuid, offset):
    if not request.files:
      return jsonify({'error': 'no files'})
    chunk = request.files['chunk']
    upload_file_chunk(uuid, offset, chunk.stream.read())
    return jsonify({'uuid': uuid})

  # get all models of type
  @backend.route('/model/<type>')
  def models_get(type):
    return jsonify(get_models(type))

  # adding model
  @backend.route('/model', methods=['POST'])
  def model_add():
    req = request.get_json()
    try:
      filename = f"{req['file']['uuid']}{req['file']['type']}"
      filepath = os.path.join(files_dir('upload'), filename)

      type = req['type']
      name = req['name']
      label = req['label']
      result = upload_model(type, name, label, filepath)
      return jsonify(result)
    except KeyError as e:
      return jsonify({'error': f"missing {e.args[0]}"})
  
  # updating model status
  @backend.route('/model/<uuid>/status/<status>', methods=['PATCH'])
  def model_update_status(uuid, status):
    return jsonify(update_model(uuid, status=status))
  
  # deleting model
  @backend.route('/model/<uuid>', methods=['DELETE'])
  def model_delete(uuid):
    return jsonify(delete_model(uuid))

  return backend

