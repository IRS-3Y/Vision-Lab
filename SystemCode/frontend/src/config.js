const backend = {
  baseUrl: '/backend',
  detector: {
    model: {
      name: 'resnet50v2',
      version: 'default'
    }
  },
  generator: {
    models: [{
      name: 'stylegan2',
      version: 'generator_yellow-stylegan2-config-f'
    },{
      name: 'stylegan2',
      version: 'generator_star-stylegan2-config-f'
    },{
      name: 'stylegan2',
      version: 'generator_wanghong-stylegan2-config-f'
    },{
      name: 'stylegan2',
      version: 'skylion-stylegan2-animeportraits'
    }],
    batchSize: 10
  }
};

export {backend};
export default {backend};