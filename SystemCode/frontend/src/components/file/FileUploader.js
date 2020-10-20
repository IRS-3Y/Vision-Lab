import React from 'react'
import { makeStyles } from '@material-ui/core'
import {DropzoneArea} from 'material-ui-dropzone'
import {Progress} from 'antd'

import FileService from '../../services/FileService'

const service = new FileService({chunkSize: 1024 * 1024});

const useStyles = makeStyles(theme => ({
  dropzone: {
    minHeight: 100,
    color: 'rgba(0,0,0,0.5)'
  },
  progress: {
    width: '100%'
  }
}))

export default function FileUploader({
  className, accept = [], maxSize = 2000000000, onUploaded
}){
  const classes = useStyles();

  let [percent, setPercent] = React.useState(-1);

  const handleChange = files => {
    if(files.length){
      setPercent(0);
      service.upload(files[0], ({total, current, file}) => {
        let p = Math.round(100*current/total);
        setPercent(p);
        if(p === 100 && onUploaded){
          onUploaded(file);
        }
      });
    }
  }
  return (
    <div className={className}>
      <DropzoneArea
        dropzoneClass={classes.dropzone}
        acceptedFiles={accept}
        filesLimit={1}
        maxFileSize={maxSize}
        dropzoneText="Drop file here"
        showPreviews={false}
        showPreviewsInDropzone={false}
        showAlerts={false}
        onChange={handleChange}/>
      {percent < 0? null: <Progress className={classes.progress} percent={percent}/>}
    </div>
  )
}