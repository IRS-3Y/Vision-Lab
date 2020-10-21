from importlib import import_module
from ._utils import *
from ._entities import *

def load(model_name):
  return import_module(f'{__name__}.{model_name}')

