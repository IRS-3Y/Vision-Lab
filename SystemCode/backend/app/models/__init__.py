from ._utils import *
from . import experiment
from . import xception
from . import vgg16, vgg19
from . import resnet50v2, resnet101v2, resnet152v2

INDEX = {}
for m in (
  experiment,
  xception,
  vgg16,
  vgg19,
  resnet50v2,
  resnet101v2,
  resnet152v2
):
  INDEX[m.MODEL_NAME] = m
  