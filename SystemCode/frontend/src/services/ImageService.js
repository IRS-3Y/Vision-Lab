import _ from 'lodash'
import axios from 'axios';
import {messageQueue} from './AppService';
import config from '../config';
import {findBackend} from '../adaptor'

export default class ImageService {
  constructor({baseUrl} = {}){
    this._baseUrl = `${config.backend.baseUrl}/image`;
    if(baseUrl){
      this._baseUrl = `${baseUrl}/image`;
    }
  }

  url = ({uuid, type, subdir = 'origin'}) => {
    return `${this._baseUrl}/${subdir}/${uuid}${type}`;
  }

  upload = async (file) => {
    let form = new FormData();
    form.append('image', file);

    let resp = await axios.post(this._baseUrl, form, {
      headers: {'Content-Type': 'multipart/form-data' }
    });
    return resp.data;
  }

  classify = async (req) => {
    let resp = await axios.post(`${this._baseUrl}/classify`, req);
    return resp.data;
  }

  detect = async (image) => {
    let result = await this.classify({
      type: 'real_fake', 
      image,
      model: config.backend.detector.model
    });
    return {
      image, result,
      info: [
        `I think this is a ${result.class} photo.`,
        `real: ${result.real.toFixed(4)} fake: ${result.fake.toFixed(4)}`
      ]
    }
  }

  generate = async ({name, version}) => {
    let resp = await axios.post(`${this._baseUrl}/generate`, {model: {name, version}});
    return resp.data;
  }
}

// customized for multiple tensorflow backends
const _singleton = new ImageService();
let _inst_tf1 = null;
findBackend(({tensorflow}) => {
  return tensorflow.version.startsWith('1.');
})
.then(({tensorflow, baseUrl}) => {
  console.info(`Found tensorflow-v${tensorflow.version} backend on: ${baseUrl}`);
  _inst_tf1 = new ImageService({baseUrl});
}, 
err => {
  console.error(err);
  messageQueue.push({
    severity: "warning",
    title: "TensorFlow v1 Backend Disconnected",
    text: "StyleGAN is NOT supported when TensorFlow v1 Backend is disconnected",
    lifespan: 60000
  })
});

export function isValidModel(model){
  if(_inst_tf1){
    return true;
  }else{
    return model.name !== 'stylegan2';
  }
}

export async function generateImage(models = []){
  //excluding stylegan2 model if no tf1 backend
  models = models.filter(isValidModel);
  if(models.length < 1){
    messageQueue.push({
      severity: "warning",
      title: "Model Not Selected",
      text: "Please enable at least one model for image generation",
      lifespan: 5000
    });
    return null;
  }
  let model = _.sample(models);
  let service = (model.name === 'stylegan2')? _inst_tf1: _singleton;
  let image = await service.generate(model);
  return {
    ...image,
    url: service.url({...image, subdir: model.name})
  }
}