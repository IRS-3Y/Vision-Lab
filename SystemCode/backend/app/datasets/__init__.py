from ._utils import *
from . import experiment

INDEX = {}
for ds in (
  experiment, 
  experiment
):
  INDEX[ds.DATASET_NAME] = ds

