'''
Handling image storage and pre-processing
'''
import os
import cv2
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

  return cv2.imread(path, cv2.IMREAD_UNCHANGED)


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

