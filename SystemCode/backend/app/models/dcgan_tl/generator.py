import numpy as np
import os
from uuid import uuid4
import cv2
import tensorflow as tf
import tensorlayer as tl
from tensorlayer.layers import Input, Dense, DeConv2d, Reshape, BatchNorm2d, Conv2d, Flatten

from .._utils import model_path, images_dir
from . import MODEL_NAME, IMAGE_RESIZE

Z_DIM = 100

_model_cache = {}


def build_generator(image_size=128, gf_dim=64):
  s16 = image_size // 16
  w_init = tf.random_normal_initializer(stddev=0.02)
  gamma_init = tf.random_normal_initializer(1., 0.02)

  ni = Input([None, Z_DIM])
  nn = Dense(n_units=(gf_dim * 8 * s16 * s16), W_init=w_init, b_init=None)(ni)
  nn = Reshape(shape=[-1, s16, s16, gf_dim*8])(nn)
  nn = BatchNorm2d(decay=0.9, act=tf.nn.relu, gamma_init=gamma_init, name=None)(nn)
  nn = DeConv2d(gf_dim * 4, (5, 5), (2, 2), W_init=w_init, b_init=None)(nn)
  nn = BatchNorm2d(decay=0.9, act=tf.nn.relu, gamma_init=gamma_init)(nn)
  nn = DeConv2d(gf_dim * 2, (5, 5), (2, 2), W_init=w_init, b_init=None)(nn)
  nn = BatchNorm2d(decay=0.9, act=tf.nn.relu, gamma_init=gamma_init)(nn)
  nn = DeConv2d(gf_dim, (5, 5), (2, 2), W_init=w_init, b_init=None)(nn)
  nn = BatchNorm2d(decay=0.9, act=tf.nn.relu, gamma_init=gamma_init)(nn)
  nn = DeConv2d(3, (5, 5), (2, 2), act=tf.nn.tanh, W_init=w_init)(nn)

  return tl.models.Model(inputs=ni, outputs=nn)


def load_generator(model_version = 'default'):
  try:
    model = _model_cache[model_version]
  except KeyError:
    path = model_path(MODEL_NAME, model_version, file_ext='.npz')
    model = build_generator()
    model.load_weights(path, format='npz')
    model.eval()
    _model_cache[model_version] = model
  return model


def generate_image(model_version = 'default'):
  uuid = uuid4()
  imgpath = os.path.join(images_dir(MODEL_NAME), f"{uuid}.png")

  # generated image from random noise vector
  z = np.random.normal(loc=0.0, scale=1.0, size=[1, Z_DIM]).astype(np.float32)
  img = load_generator(model_version)(z)[0]
  tl.visualize.save_image(img, imgpath)

  # resize (enlarge) image
  img = cv2.imread(imgpath, cv2.IMREAD_UNCHANGED)
  img = cv2.resize(img, (IMAGE_RESIZE, IMAGE_RESIZE))
  cv2.imwrite(imgpath, img)

  model = {'name': MODEL_NAME, 'version': model_version}
  return {'uuid': uuid, 'type': '.png', 'model': model}
