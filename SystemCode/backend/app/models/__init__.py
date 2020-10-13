from importlib import import_module
from ._utils import *

def load(model_name):
  return import_module(f'{__name__}.{model_name}')

