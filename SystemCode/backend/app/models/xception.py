from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input
from tensorflow.keras.applications import Xception
from tensorflow.keras.applications.xception import preprocess_input

from . import _utils


MODEL_NAME = 'xception'
IMAGE_SIZE = 299


def load_model(model_version = 'default'):
  return _utils.load_model(MODEL_NAME, model_version)


def build_model():
  inputs = Input(shape = (IMAGE_SIZE, IMAGE_SIZE, 3))
  x = preprocess_input(inputs)
  x = Xception(weights=None, classes=2)(x)
  model = Model(inputs=inputs, outputs=x)
  model.compile(loss='categorical_crossentropy', metrics=['accuracy'])
  return model

