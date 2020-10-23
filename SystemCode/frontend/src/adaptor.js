import axios from 'axios'

import config from './config'
import {messageQueue} from './services/AppService'

const _backends = {}
export function getBackend(name){
  return _backends[name] || {};
}

export async function findBackend(test){
  const baseUrl = config.backend.baseUrl;
  try{
    let resp = await axios.get(`${baseUrl}/status`);
    if(!test || test(resp.data)){
      return {...resp.data, baseUrl};
    }
  }catch(err){
    console.debug(err);
  }
  for(let i=5001; i<5004; i++){
    try{
      let testUrl = `http://${window.location.hostname}:${i}${baseUrl}`
      let resp = await axios.get(`${testUrl}/status`);
      if(!test || test(resp.data)){
        return {...resp.data, baseUrl: testUrl};
      }
    }catch(err){
      console.debug(err);
    }
  }
  throw new Error('cannot find valid backend');
}

export async function findBackendTF1(){
  try{
    let backend = await findBackend(({tensorflow: tf}) => {
      return tf.version.startsWith('1.') && tf.gpu
    })
    console.info(`Found tensorflow-v${backend.tensorflow.version} backend on: ${backend.baseUrl}`);
    _backends.tf1 = backend;
  }
  catch(err) {
    console.error(err);
    messageQueue.push({
      severity: "warning",
      title: "TensorFlow v1 Backend Disconnected",
      text: "StyleGAN is NOT supported when TensorFlow v1 Backend is disconnected",
      lifespan: 60000
    });
    _backends.tf1 = {};
  }
}

export async function findBackendTF22(){
  try{
    let backend = await findBackend(({tensorflow: tf}) => {
      return tf.version.startsWith('2.2.')
    })
    console.info(`Found tensorflow-v${backend.tensorflow.version} backend on: ${backend.baseUrl}`);
    _backends.tf22 = backend;
  }
  catch(err) {
    console.error(err);
    messageQueue.push({
      severity: "warning",
      title: "TensorFlow v2.2 Backend Disconnected",
      text: "DCGAN is NOT supported when TensorFlow v2.2 Backend is disconnected",
      lifespan: 60000
    });
    _backends.tf22 = {};
  }
}

export function isValidModel(model){
  let {backend} = config.getModel(model);
  if(backend){
    //requires specific backend
    return _backends[backend] && _backends[backend].baseUrl;
  }else{
    return true;
  }
}

//test on loading
findBackendTF1();
findBackendTF22();