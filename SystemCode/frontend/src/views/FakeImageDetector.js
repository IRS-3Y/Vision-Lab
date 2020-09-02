import React from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ImageDropzone from '../components/image/ImageDropzone';
import Image from '../components/image/Image';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
    padding: theme.spacing(5),
    minHeight: "90vh"
  }
}))

export default function FakeImageDetector() {
  const classes = useStyles();

  const [file, setFile] = React.useState(null);
  const handleImageChange = files => {
    if(files.length){
      setFile(files[0]);
    }else{
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