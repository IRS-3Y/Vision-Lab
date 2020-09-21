from ._utils import *
from . import experiment
from . import resnet50

INDEX = {
  experiment.MODEL_NAME: experiment,
  resnet50.MODEL_NAME: resnet50
}