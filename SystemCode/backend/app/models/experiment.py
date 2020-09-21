from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D, Input
from tensorflow.keras.layers.experimental.preprocessing import Resizing, Rescaling
from tensorflow.keras.optimizers import RMSprop

from . import _utils


MODEL_NAME = 'experiment'
IMAGE_SIZE = 128


def load_model(model_version = 'default'):
  return _utils.load_model(MODEL_NAME, model_version)


def build_model():
  model = Sequential()
  model.add(Input(shape=(IMAGE_SIZE, IMAGE_SIZE, 3)))
  model.add(Rescaling(1./255))
  model.add(Conv2D(32, (3, 3), padding='same', activation='relu'))
  model.add(Conv2D(32, (3, 3), padding='same', activation='relu'))
  model.add(MaxPooling2D(pool_size=(2, 2)))
  model.add(Conv2D(48, (3, 3), padding='same', activation='relu'))
  model.add(Conv2D(48, (3, 3), padding='same', activation='relu'))
  model.add(MaxPooling2D(pool_size=(2, 2)))
  model.add(Conv2D(64, (3, 3), padding='same', activation='relu'))
  model.add(Conv2D(64, (3, 3), padding='same', activation='relu'))
  model.add(Dropout(0.2))
  model.add(Flatten())
  model.add(Dense(256, activation='relu'))
  model.add(Dense(2, activation='softmax'))
  model.compile(loss='categorical_crossentropy', metrics=['accuracy'])
  return model

