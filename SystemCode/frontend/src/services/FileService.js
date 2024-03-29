import axios from 'axios'
import {v4 as uuidv4} from 'uuid'
import config from '../config'
import {getBackend} from '../adaptor'

function readChunk(file, skip, take) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    let blob = file.slice(skip, skip + take); 
    reader.onload = e => resolve(e.target.result);
    reader.onerror = error => reject(error);
    reader.readAsArrayBuffer(blob);
  });
}

export default class FileService{
  constructor({baseUrl, chunkSize = 128 * 1024} = {}){
    this._baseUrl = `${config.backend.baseUrl}/file`;
    if(baseUrl){
      this._baseUrl = `${baseUrl}/file`;
    }
    this._ulChunkSize = chunkSize;
  }

  upload = async (file, tracer) => {
    const uuid = uuidv4();
    const type = file.name.substr(file.name.lastIndexOf('.'));

    //init file upload
    await axios.post(`${this._baseUrl}/upload`, {uuid, type});

    const fileSize = file.size;
    let offset = 0;
    while(offset < fileSize){
      let result = await readChunk(file, offset, this._ulChunkSize);

      //send file chunk to server
      let form = new FormData();
      form.append('chunk', new Blob([result]));
      await axios.post(`${this._baseUrl}/upload/${uuid}/${offset}`, form, {
        headers: {'Content-Type': 'multipart/form-data' }
      });

      //update offset and progress
      offset += result.byteLength;
      if(tracer){
        tracer({total: fileSize, current: offset, file: {uuid, type}});
      }
    }
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
    return new FileService({baseUrl, chunkSize: this._ulChunkSize});
  }
}