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
      accept: ['.pkl'],
      backend: 'tf1'
    }],
    batchSize: 10
  }
};

function getModel({name}){
  return backend.generator.models.filter(m => m.name === name)[0];
}

export {backend, getModel};
export default {backend, getModel};