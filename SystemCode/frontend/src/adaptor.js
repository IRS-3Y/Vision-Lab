import axios from 'axios'

import config from './config'

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
  for(let i=5001; i<5010; i++){
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