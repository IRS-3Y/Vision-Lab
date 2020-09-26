'''
Model related utilities
'''
import os
import tensorflow as tf

from ..context import get_obj


_model_cache = {}


def models_dir(*paths):
  '''
  Get model file directory
  '''
  app = get_obj('app')
  path = os.path.join(app.instance_path, 'models', *paths)
  os.makedirs(path, exist_ok=True)
  return path


def model_path(model_name, model_version = 'default', file_ext = '.h5'):
  '''
  Get model file full path
  '''
  filename = f"{model_version}{file_ext}"
  return os.path.join(models_dir(model_name), filename)


def load_model(model_name, model_version = 'default'):
  '''
  Load previously trained model
  '''
  cache_key = f"{model_name}__{model_version}"
  try:
    model = _model_cache[cache_key]
  except KeyError:
    path = model_path(model_name, model_version)
    model = tf.keras.models.load_model(path)
    _model_cache[cache_key] = model

  return model


def build_model_checkpoint(model_name, model_version = 'default'):
  '''
  Build check-point callback
  '''
  path = model_path(model_name, model_version)
  return tf.keras.callbacks.ModelCheckpoint(path, monitor='val_accuracy', verbose=0, save_best_only=True, mode='max')


def build_csv_logger(model_name, model_version = 'default'):
  '''
  Build CSV logger callback
  '''
  path = model_path(model_name, model_version, '.csv')
  return tf.keras.callbacks.CSVLogger(path)
