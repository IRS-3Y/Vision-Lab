import axios from 'axios'
import config from '../config'

export default class DatasetService{
  constructor(){
    this._baseUrl = `${config.backend.baseUrl}/dataset`;
  }

  list = async (type) => {
    let resp = await axios.get(`${this._baseUrl}/${type}`);
    return resp.data;
  }

  create = async ({type, name, label, file}) => {
    let resp = await axios.post(`${this._baseUrl}`, {type, name, label, file});
    return resp.data;
  }

  updateStatus = async (uuid, status) => {
    let resp = await axios.patch(`${this._baseUrl}/${uuid}/status/${status}`);
    return resp.data;
  }

  delete = async (uuid) => {
    let resp = await axios.delete(`${this._baseUrl}/${uuid}`);
    return resp.data;
  }
}