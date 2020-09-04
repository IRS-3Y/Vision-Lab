'''
Handling image storage
'''
import os
from uuid import uuid4

from .context import get_obj


def images_dir(*paths):
  '''
  Get image store directory
  '''
  app = get_obj('app')
  path = os.path.join(app.instance_path, 'images', *paths)
  os.makedirs(path, exist_ok=True)
  return path


def save_image(image, uuid = None):
  '''
  Store image files
  '''
  if uuid is None:
    uuid = uuid4()

  filename = f"{uuid}.{image.filename.split('.')[-1]}"
  image.save(os.path.join(images_dir('origin'), filename))

  return {'uuid': uuid}

