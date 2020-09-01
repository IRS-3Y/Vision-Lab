import axios from 'axios';
import config from '../config';

const messageQueue = [];
export {messageQueue};

export default class AppService {
  constructor(){
    this._baseUrl = `${config.backend.baseUrl}/app`;
  }

  getStatus = async () => {
    let resp = await axios.get(`${this._baseUrl}/status`);
    return resp.data;
  }

  checkStatus = () => {
    this.getStatus().then(status => {
      if(!status.dialogflowConnected){
        messageQueue.push({
          severity: "warning",
          title: "Dialogflow Disconnected",
          text: "Free text search is NOT supported when Dialogflow service is disconnected",
          lifespan: 60000
        })
      }
    }).catch(e => {
      console.error(e);
      messageQueue.push({
        severity: "error",
        title: "Backend Disconnected",
        text: "System will not function until backend service is connected again",
        lifespan: 60000
      })
    })
  }

  getSettings = async () => {
    let resp = await axios.get(`${this._baseUrl}/settings`);
    return resp.data;
  }

  mergeSettings = async (settings) => {
    let resp = await axios.post(`${this._baseUrl}/settings`, settings);
    return resp.data;
  }

  loadSettings = async (settings) => {
    if(!settings){
      settings = await this.getSettings();
    }
    //update neo4j connection
    let host = settings.graph.host || window.location.hostname;
    let port = settings.graph.port;
    config.neovis.server_url = `bolt://${host}:${port}`;
  }
}