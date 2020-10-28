from tensorflow.keras.models import Model
from tensorflow.keras.layers import concatenate, Input, Dense
from tensorflow.keras.layers.experimental.preprocessing import Resizing

from . import _utils


MODEL_NAME = 'ensemble_stacking224'
IMAGE_SIZE = 224


def load_model(model_version = 'default'):
  return _utils.load_model(MODEL_NAME, model_version)


def build_model(base_models, classes = 2):
  inputs = Input(shape = (IMAGE_SIZE, IMAGE_SIZE, 3))

  # connect all base models to the same input (resizing if shape differs)
  bases = []
  count = 0
  for bm in base_models:
    bm._name = f"bm{count}_{bm.name}"
    bm.trainable = False
    
    [height, width] = bm.input.shape[1:3]
    x = inputs if height == IMAGE_SIZE else Resizing(height=height,width=width)(inputs)
    bases.append(bm(x))
    count += 1
  
  # concatenate all base model outputs and apply additional dense layers
  merge = concatenate(bases)
  hidden = Dense(classes * len(base_models), activation='relu')(merge)
  outputs = Dense(classes, activation='softmax')(hidden)

  model = Model(inputs=inputs, outputs=outputs)
  model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
  return model

