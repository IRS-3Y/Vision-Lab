import os
import sys
from importlib import import_module
from .. import _utils


MODEL_NAME = 'stylegan2'


# add stylegan2 to sys.path for resolving dnnlib in model file
_path = os.path.dirname(os.path.realpath(__file__))
if _path not in sys.path:
  print(f'Adding to sys.path: {_path}')
  sys.path.append(_path)


def generate_image(model_version = 'default'):
  model_file = os.path.join(_utils.models_dir(MODEL_NAME), f'{model_version}.pkl')
  uuid = import_module(f'{__name__}.main').generate_image(model_file)
  model = {'type': MODEL_NAME, 'version': model_version}
  return {'uuid': uuid, 'type': '.png', 'model': model}
