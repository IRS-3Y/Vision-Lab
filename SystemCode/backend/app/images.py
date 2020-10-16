'''
Handling image storage and pre-processing
'''
import os
import cv2
from uuid import uuid4
from importlib import import_module
from sqlalchemy import func

from .context import get_obj
from .entities import get_session, Image


def images_dir(*paths):
  '''
  Get image store directory
  '''
  app = get_obj('app')
  path = os.path.join(app.instance_path, 'images', *paths)
  os.makedirs(path, exist_ok=True)
  return path


def load_image(image_uuid, image_type = '.jpg', resize = None):
  assert image_uuid

  filename = image_uuid + image_type
  path_origin = os.path.join(images_dir('origin'), filename)
  path = path_origin

  if resize is not None:
    path_resized = os.path.join(images_dir(f'resized/{resize}'), filename)
    path = path_resized
    
    # check if resized image was cached; if not, resize from original image
    if not os.path.isfile(path_resized):
      img = cv2.imread(path_origin, cv2.IMREAD_UNCHANGED)
      img = cv2.resize(img, (resize, resize))
      cv2.imwrite(path_resized, img)

  return cv2.imread(path, cv2.IMREAD_UNCHANGED)[..., ::-1]


def save_image(image, uuid = None):
  '''
  Store image files
  '''
  if uuid is None:
    uuid = uuid4()

  filetype = f".{image.filename.split('.')[-1]}"
  filename = f"{uuid}{filetype}"
  image.save(os.path.join(images_dir('origin'), filename))

  return {'uuid': uuid, 'type': filetype}


def plot_image(image_uuid, image_type = '.jpg', image_dir = 'origin'):
  plt = import_module('matplotlib.pyplot')
  image_path = os.path.join(images_dir(image_dir), f'{image_uuid}{image_type}')
  img = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)[..., ::-1]
  plt.imshow(img)
  plt.show()


def set_image_stat(image_uuid, image_type, model_name, model_version, stat_name, stat_delta = 1):
  session = get_session()

  image = session.query(Image).filter_by(uuid=image_uuid).first()
  if image is None:
    image = Image(uuid=image_uuid, image_type=image_type, model_name=model_name, model_version=model_version, likes=0, downloads=0)
    session.add(image)
  
  if stat_name == 'likes':
    image.likes = image.likes + stat_delta
  elif stat_name == 'downloads':
    image.downloads = image.downloads + stat_delta
  
  session.commit()


def get_image_stats():
  session = get_session()

  stats = []
  likes = func.sum(Image.likes).label('likes')
  downloads = func.sum(Image.downloads).label('downloads')
  model_name = Image.model_name.label('name')
  model_version = Image.model_version.label('version')

  for r in session.query(likes, downloads, model_name, model_version).group_by(model_name, model_version).all():
    model = {'name': r.name, 'version': r.version}
    stats.append({'model': model, 'likes': int(r.likes), 'downloads': int(r.downloads)})
  
  return stats
