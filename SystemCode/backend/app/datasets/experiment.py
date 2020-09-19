from . import _utils


DATASET_NAME = 'experiment'


def load_dataset(image_size = 128, batch_size = 128):
  return _utils.load_dataset(DATASET_NAME, ['real','fake'], image_size, batch_size)

