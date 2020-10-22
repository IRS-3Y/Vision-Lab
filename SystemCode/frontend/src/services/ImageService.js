import _ from 'lodash'
import axios from 'axios';
import {messageQueue} from './AppService';
import ModelService from './ModelService'
import config from '../config';
import {getBackend, isValidModel} from '../adaptor'

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

  detect = async (image, tracer) => {
    let models = await new ModelService().list('detector');
    models = models.filter(m => m.status === 1);
    if(models.length < 1){
      messageQueue.push({
        severity: "warning",
        title: "Model Not Selected",
        text: "Please enable at least one model for image detector",
        lifespan: 5000
      });
      return {info: null};
    }
    //test each model one by one
    let results = [];
    let total = models.length;
    let current = 0;
    if(tracer){
      tracer({total, current});
    }
    while(models.length){
      let model = models.shift();
      let result = await this.classify({type: 'face', image, model});
      results.push({result, model});
      current += 1;
      if(tracer){
        tracer({total, current});
      }
    }
    //aggregate results to determine final result
    let classes = config.backend.detector.classes;
    let result = {};
    classes.forEach(({name}) => result[name] = 0.0);
    results.forEach(({result: r}) => {
      classes.forEach(({name}) => {
        result[name] = result[name] + r[name];
        r[name] = r[name].toFixed(4);
      });
    });
    let max = 0.0;
    classes.forEach(({name}) => {
      result[name] = result[name] / results.length
      if(result[name] > max){
        max = result[name];
        result.class = name;
      }
      result[name] = result[name].toFixed(4);
    });
    result.classLabel = classes.filter(c => c.name === result.class)[0].label;

    console.debug({results, result});
    return {
      image, results, result,
      info: `I think this is ${result.classLabel}.`
    }
  }

  generate = async ({name, version}) => {
    let resp = await axios.post(`${this._baseUrl}/generate`, {model: {name, version}});
    return resp.data;
  }

  postStats = async ({image, model:{name,version}, stats = []}) => {
    let resp = await axios.post(`${this._baseUrl}/stats`, {image, model: {name, version}, stats});
    return resp.data;
  }

  getStats = async () => {
    let resp = await axios.get(`${this._baseUrl}/stats`);
    return resp.data;
  }

  forModel = model => {
    let {backend} = config.getModel(model);
    if(!backend){
      return this;
    }
    //requires specific backend
    let {baseUrl} = getBackend(backend);
    if(!baseUrl){
      throw new Error(`no backend: ${backend}`);
    }
    return new ImageService({baseUrl});
  }

  //auto-adapt to multiple backends
  generateImage = async (models = []) => {
    //excluding model if no valid backend
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
    let service = this.forModel(model);
    let image = await service.generate(model);
    return {
      ...image,
      url: service.url({...image, subdir: model.name})
    }
  }
}
