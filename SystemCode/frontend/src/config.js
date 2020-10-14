const backend = {
  baseUrl: '/backend',
  detector: {
    model: {
      name: 'resnet50v2',
      version: 'default'
    }
  },
  generator: {
    batchSize: 10
  }
};

export {backend};
export default {backend};