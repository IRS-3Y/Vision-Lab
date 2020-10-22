import numpy as np

from . import models
from .images import load_image


FACE_CLASSES = ['human','human_gen','anime','anime_gen']


def predict(inputs, model_name = 'experiment', model_version = 'default'):
  model = models.load(model_name).load_model(model_version)
  return model.predict(inputs)


def predict_image(image_uuid, image_type = '.jpg', model_name = 'experiment', model_version = 'default'):
  mdl = models.load(model_name)
  img = load_image(image_uuid, image_type, resize=mdl.IMAGE_SIZE)
  inputs = np.array([img]).astype('float32')
  return predict(inputs, model_name, model_version)


def predict_face(image_uuid, image_type = '.jpg', model_name = 'experiment', model_version = 'default'):
  predicts = predict_image(image_uuid, image_type, model_name, model_version)[0]
  clz = FACE_CLASSES[np.argmax(predicts)]
  result = {'_class': clz}
  for i in range(len(FACE_CLASSES)):
    result[FACE_CLASSES[i]] = predicts[i].item()
  return result
