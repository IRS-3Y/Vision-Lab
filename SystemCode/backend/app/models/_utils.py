'''
Model related utilities
'''
import os
import tensorflow as tf

from ..context import get_obj


def models_dir(*paths):
  '''
  Get model file directory
  '''
  app = get_obj('app')
  path = os.path.join(app.instance_path, 'models', *paths)
  os.makedirs(path, exist_ok=True)
  return path


def model_path(model_name, model_version = 'default'):
  '''
  Get model file full path
  '''
  filename = f"{model_version}.h5"
  return os.path.join(models_dir(model_name), filename)


def load_model(model_name, model_version = 'default'):
  '''
  Load previously trained model
  '''
  path = model_path(model_name, model_version)
  return tf.keras.models.load_model(path)

