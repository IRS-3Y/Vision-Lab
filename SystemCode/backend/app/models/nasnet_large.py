from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input
from tensorflow.keras.applications import NASNetLarge
from tensorflow.keras.applications.nasnet import preprocess_input

from . import _utils


MODEL_NAME = 'nasnet_large'
IMAGE_SIZE = 331


def load_model(model_version = 'default'):
  return _utils.load_model(MODEL_NAME, model_version)


def build_model(classes = 2):
  inputs = Input(shape = (IMAGE_SIZE, IMAGE_SIZE, 3))
  x = preprocess_input(inputs)
  x = NASNetLarge(weights=None, classes=classes)(x)
  model = Model(inputs=inputs, outputs=x)
  model.compile(loss='categorical_crossentropy', metrics=['accuracy'])
  return model

