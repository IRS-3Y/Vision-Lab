const backend = {
  baseUrl: '/backend',
  detector: {
    model: {
      name: 'resnet50v2',
      version: 'default'
    },
    models: [{
      name: 'resnet50v2',
      label: 'ResNet50 v2',
      accept: ['.h5']
    }]
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
  return [
    ...backend.generator.models,
    ...backend.detector.models
  ].filter(m => m.name === name)[0];
}

export {backend, getModel};
export default {backend, getModel};