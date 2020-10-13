# Thanks to StyleGAN2 provider —— Copyright (c) 2019, NVIDIA CORPORATION.
# This work is trained by Copyright(c) 2018, seeprettyface.com, BUPT_GWY.

import numpy as np
import PIL.Image
import dnnlib
import dnnlib.tflib as tflib
import pretrained_networks
import os
from uuid import uuid4
from .._utils import images_dir

def text_save(file, data):  # save generate code, which can be modified to generate customized style
    for i in range(len(data[0])):
        s = str(data[0][i])+'\n'
        file.write(s)

def generate_image(network_pkl, truncation_psi=0.5):
    uuid = uuid4()
    image_dir = images_dir('stylegan2')

    _G, _D, Gs = pretrained_networks.load_networks(network_pkl)
    noise_vars = [var for name, var in Gs.components.synthesis.vars.items() if name.startswith('noise')]

    Gs_kwargs = dnnlib.EasyDict()
    Gs_kwargs.output_transform = dict(func=tflib.convert_images_to_uint8, nchw_to_nhwc=True)
    Gs_kwargs.randomize_noise = False
    if truncation_psi is not None:
        Gs_kwargs.truncation_psi = truncation_psi

    # Generate random latent
    z = np.random.randn(1, *Gs.input_shape[1:])  # [minibatch, component]

    # Save latent
    txt_filename = os.path.join(image_dir, f"{uuid}.txt")
    with open(txt_filename, 'w') as f:
        text_save(f, z)

    # Generate image
    tflib.set_vars({var: np.random.randn(*var.shape.as_list()) for var in noise_vars})  # [height, width]
    images = Gs.run(z, None, **Gs_kwargs)  # [minibatch, height, width, channel]

    # Save image
    PIL.Image.fromarray(images[0], 'RGB').save(os.path.join(image_dir, f"{uuid}.png"))
    return uuid
