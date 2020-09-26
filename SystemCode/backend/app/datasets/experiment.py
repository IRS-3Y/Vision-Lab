from . import _utils


DATASET_NAME = 'experiment'
CLASS_NAMES = ['real','fake']


def load_dataset(**kwargs):
  return _utils.load_dataset(DATASET_NAME, CLASS_NAMES, **kwargs)

