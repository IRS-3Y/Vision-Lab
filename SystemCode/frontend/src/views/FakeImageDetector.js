import React from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ImageService from '../services/ImageService';
import ImageDropzone from '../components/image/ImageDropzone';
import Image from '../components/image/Image';

const service = new ImageService();

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
    padding: theme.spacing(5),
    minHeight: "90vh"
  }
}))

export default function FakeImageDetector({setResult}) {
  const classes = useStyles();

  const [file, setFile] = React.useState(null);
  const handleImageChange = async files => {
    if(files.length){
      setResult(null);
      setFile(files[0]);
      let result = await service.detectFake(files[0]);
      setResult(result.info);
    }else{
      setResult(null);
      setFile(null);
    }
  }
  return (
    <Paper className={classes.root}>
      <ImageDropzone onChange={handleImageChange}/>
      <br/>
      <Image file={file}/>
    </Paper>
  )
}