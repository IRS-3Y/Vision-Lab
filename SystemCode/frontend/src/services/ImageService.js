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

  detectFake = async (file) => {
    let saved = await this.upload(file);
    //TODO call prediction model
    return {
      uuid: saved.uuid,
      info: 'I think this is a fake photo.'
    }
  }
}