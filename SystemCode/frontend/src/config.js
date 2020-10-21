const backend = {
  baseUrl: '/backend',
  detector: {
    model: {
      name: 'resnet50v2',
      version: 'default'
    }
  },
  generator: {
    models_: [{
      title: 'Asian Face',
      name: 'stylegan2',
      version: 'generator_yellow-stylegan2-config-f',
      enabled: true
    },{
      title: 'Celebrity Face',
      name: 'stylegan2',
      version: 'generator_star-stylegan2-config-f'
    },{
      title: 'Online Celebrity',
      name: 'stylegan2',
      version: 'generator_wanghong-stylegan2-config-f'
    },{
      title: 'Cartoon Face',
      name: 'stylegan2',
      version: 'skylion-stylegan2-animeportraits'
    }],
    models: [{
      name: 'stylegan2',
      label: 'StyleGAN2',
      accept: ['.pkl']
    }],
    batchSize: 10
  }
};

export {backend};
export default {backend};