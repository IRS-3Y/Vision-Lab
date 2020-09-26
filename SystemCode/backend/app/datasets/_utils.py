'''
Dataset related utilities
'''
import random
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


def load_dataset(dataset_name, class_names = None, image_size = 128, batch_size = 32, 
                  training_take = -1, validation_take = -1):
  '''
  Prepare image dataset
  '''
  seed = random.randrange(0, 10000)
  directory = dataset_dir(dataset_name)

  training = tf.keras.preprocessing.image_dataset_from_directory(
    directory,
    class_names = class_names,
    label_mode = 'categorical',
    image_size = (image_size, image_size),
    batch_size = batch_size,
    seed = seed,
    validation_split = 0.2,
    subset = 'training'
  )
  validation = tf.keras.preprocessing.image_dataset_from_directory(
    directory,
    class_names = class_names,
    label_mode = 'categorical',
    image_size = (image_size, image_size),
    batch_size = batch_size,
    seed = seed,
    validation_split = 0.2,
    subset = 'validation'
  )

  AUTOTUNE = tf.data.experimental.AUTOTUNE
  training = training.take(training_take).cache().prefetch(buffer_size=AUTOTUNE)
  validation = validation.take(validation_take).cache().prefetch(buffer_size=AUTOTUNE)

  return (training, validation)
