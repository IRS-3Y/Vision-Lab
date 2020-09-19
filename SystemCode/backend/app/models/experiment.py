from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D
from tensorflow.keras.optimizers import RMSprop

from . import _utils


MODEL_NAME = 'experiment'


def load_model(model_version = 'default'):
  return _utils.load_model(MODEL_NAME, model_version)


def build_model(image_size = 128):
  model = Sequential()
  model.add(Conv2D(32, (3, 3), input_shape=(image_size, image_size, 3), padding='same', activation='relu'))
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

