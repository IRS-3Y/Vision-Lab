import React from 'react'
import { makeStyles } from '@material-ui/core'
import {DropzoneArea} from 'material-ui-dropzone'

import FileService from '../../services/FileService'

const service = new FileService();

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '160px',
    color: 'rgba(0,0,0,0.5)'
  }
}))

export default function FileUploader({
  accept = [], maxSize = 2000000000
}){
  const classes = useStyles();

  const handleChange = files => {
    if(files.length){
      service.upload(files[0], console.log);
    }
  }
  return (
    <DropzoneArea
      dropzoneClass={classes.root}
      acceptedFiles={accept}
      filesLimit={1}
      maxFileSize={maxSize}
      dropzoneText="Drop file here"
      showPreviews={false}
      showPreviewsInDropzone={false}
      showAlerts={false}
      onChange={handleChange}/>
  )
}