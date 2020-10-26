from uuid import uuid4
from .entities import count, Model
from .models import create_model


if count(Model) == 0:
  # add preloaded detector models
  create_model(uuid=uuid4(), type='detector', name='ensemble_stacking224', version='preload_1', label='Preloaded (Stacking Ensemble)', status=1, ensemble=1)
  create_model(uuid=uuid4(), type='detector', name='experiment', version='preload_1', label='Preloaded (Experiment)', status=1, ensemble=0)
  create_model(uuid=uuid4(), type='detector', name='resnet50v2', version='preload_1', label='Preloaded (ResNet50 v2)', status=1, ensemble=0)

  # add preloaded generator models
  create_model(uuid=uuid4(), type='generator', name='stylegan2', version='preload_asian_face', label='Asian Face (StyleGAN)', status=1, ensemble=0)
  create_model(uuid=uuid4(), type='generator', name='stylegan2', version='preload_cartoon_face', label='Cartoon Face (StyleGAN)', status=1, ensemble=0)
  create_model(uuid=uuid4(), type='generator', name='stylegan2', version='preload_celebrity_face', label='Celebrity Face (StyleGAN)', status=1, ensemble=0)
  create_model(uuid=uuid4(), type='generator', name='stylegan2', version='preload_online_celebrity', label='Internet Celebrity (StyleGAN)', status=1, ensemble=0)
  create_model(uuid=uuid4(), type='generator', name='dcgan_tl', version='preload_human_face', label='Human Face (DCGAN)', status=1, ensemble=0)
  create_model(uuid=uuid4(), type='generator', name='dcgan_tl', version='preload_cartoon_face', label='Cartoon Face (DCGAN)', status=1, ensemble=0)

