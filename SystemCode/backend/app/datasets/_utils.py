'''
Dataset related utilities
'''
import os
import tensorflow as tf

from ..context import get_obj


def dataset_dir(*paths):
  '''
  Get dataset base directory
  '''
  app = get_obj('app')
  path = os.path.join(app.instance_path, 'datasets', *paths)
  os.makedirs(path, exist_ok=True)
  return path


def load_dataset(dataset_name, class_names = None, image_size = 128, batch_size = 32):
  '''
  Prepare image dataset
  '''
  directory = dataset_dir(dataset_name)

  training = tf.keras.preprocessing.image_dataset_from_directory(
    directory,
    class_names = class_names,
    label_mode = 'categorical',
    image_size = (image_size, image_size),
    batch_size = batch_size,
    seed = 17,
    validation_split = 0.2,
    subset = 'training'
  )
  validation = tf.keras.preprocessing.image_dataset_from_directory(
    directory,
    class_names = class_names,
    label_mode = 'categorical',
    image_size = (image_size, image_size),
    batch_size = batch_size,
    seed = 17,
    validation_split = 0.2,
    subset = 'validation'
  )

  AUTOTUNE = tf.data.experimental.AUTOTUNE
  training = training.cache().prefetch(buffer_size=AUTOTUNE)
  validation = validation.cache().prefetch(buffer_size=AUTOTUNE)

  return (training, validation)
