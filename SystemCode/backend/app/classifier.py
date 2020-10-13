import numpy as np

from . import models
from .images import load_image


def predict(inputs, model_name = 'experiment', model_version = 'default'):
  model = models.load(model_name).load_model(model_version)
  return model.predict(inputs)


def predict_image(image_uuid, image_type = '.jpg', model_name = 'experiment', model_version = 'default'):
  mdl = models.load(model_name)
  img = load_image(image_uuid, image_type, resize=mdl.IMAGE_SIZE)
  inputs = np.array([img]).astype('float32')
  return predict(inputs, model_name, model_version)


def predict_real_fake(image_uuid, image_type = '.jpg', model_name = 'experiment', model_version = 'default'):
  predicts = predict_image(image_uuid, image_type, model_name, model_version)
  [real, fake] = predicts[0]
  clz = "real" if real > fake else 'fake'
  return {'class': clz, 'real': real.item(), 'fake': fake.item()}
  
