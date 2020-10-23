from importlib import import_module


MODEL_NAME = 'dcgan_tl'
IMAGE_RESIZE = 256


def generate_image(model_version = 'default'):
  return import_module(f'{__name__}.generator').generate_image(model_version)

