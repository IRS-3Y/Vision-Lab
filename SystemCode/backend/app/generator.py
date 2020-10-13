from . import models

def generate_image(model_name, model_version = 'default'):
  mdl = models.load(model_name)
  return mdl.generate_image(model_version)

