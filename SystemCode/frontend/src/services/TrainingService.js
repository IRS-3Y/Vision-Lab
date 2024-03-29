import _ from 'lodash'
import axios from 'axios'
import config from '../config'
import AppService from './AppService'

const app = new AppService();

export default class TrainingService{
  constructor(){
    this._baseUrl = `${config.backend.baseUrl}/training`;
  }

  list = async (type) => {
    let resp = await axios.get(`${this._baseUrl}/${type}`);
    if(!resp.data.length){
      return resp.data;
    }
    let now = await app.now();
    return resp.data.map(m => ({
      ...m,
      type: m.model_type,
      name: m.model_name,
      begin_at: m.begin_at? m.begin_at: '',
      end_at: m.end_at? m.end_at: '',
      duration: m.begin_at? ((m.end_at? Date.parse(m.end_at): now) - Date.parse(m.begin_at)): undefined,
      ensemble: m.ensemble === 1,
      base_models: _.split(m.base_models, ','),
      settings: m.settings? JSON.parse(m.settings): {},
      datasets: m.datasets? JSON.parse(m.datasets): {},
      metrics: m.metrics? JSON.parse(m.metrics): {}
    }));
  }

  create = async ({type, name, ensemble, base_models = [], settings = {}, datasets = {}}, process) => {
    let resp = await axios.post(`${this._baseUrl}`, {
      type, name,
      ensemble: ensemble? true: false,
      base_models: _.join(base_models, ','),
      settings: JSON.stringify(settings),
      datasets: JSON.stringify(datasets)
    });
    if(process){
      await this.triggerProcess();
    }
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

  triggerProcess = async () => {
    let resp = await axios.post(`${this._baseUrl}/process`, {});
    return resp.data;
  }
}