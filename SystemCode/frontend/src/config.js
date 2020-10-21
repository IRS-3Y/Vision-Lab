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
      label: 'StyleGAN2',
      accept: ['.pkl']
    }],
    batchSize: 10
  }
};

export {backend};
export default {backend};