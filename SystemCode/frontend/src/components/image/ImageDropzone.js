import React from 'react';
import { makeStyles } from '@material-ui/core';
import {DropzoneArea} from 'material-ui-dropzone';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '160px',
    color: 'rgba(0,0,0,0.5)'
  }
}))

export default function ImageDropzone(props){
  const classes = useStyles();
  return (
    <DropzoneArea
      dropzoneClass={classes.root}
      acceptedFiles={['image/*']}
      filesLimit={1}
      maxFileSize={10000000}
      dropzoneText="Drop image here"
      showPreviews={false}
      showPreviewsInDropzone={false}
      showAlerts={false}
      {...props}/>
  )
}