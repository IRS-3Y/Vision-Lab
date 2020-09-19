import axios from 'axios';
import config from '../config';

export default class ImageService {
  constructor(){
    this._baseUrl = `${config.backend.baseUrl}/image`;
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

  detectFake = async (file) => {
    let image = await this.upload(file);
    let result = await this.classify({type: 'real_fake', image});
    return {
      image, result,
      info: [
        `I think this is a ${result.class} photo.`,
        `real: ${result.real.toFixed(4)} fake: ${result.fake.toFixed(4)}`
      ]
    }
  }
}