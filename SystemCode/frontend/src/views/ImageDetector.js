import React from 'react';
import { makeStyles } from '@material-ui/core';
import ImageService from '../services/ImageService';
import ImageDropzone from '../components/image/ImageDropzone';
import Image from '../components/image/Image';
import AffixHeader from '../components/layout/AffixHeader'

const service = new ImageService();

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2)
  }
}))

export default function ImageDetector({setResult}) {
  const classes = useStyles();

  const [image, setImage] = React.useState(null);
  const handleImageChange = async files => {
    if(files.length){
      setResult(null);
      let uploaded = await service.upload(files[0]);
      setImage(uploaded);
      let result = await service.detect(uploaded);
      setResult(result.info);
    }else{
      setResult(null);
      setImage(null);
    }
  }
  return (
    <div className={classes.root}>
      <AffixHeader title="Image Detector"/>
      <br/>
      <ImageDropzone onChange={handleImageChange}/>
      <br/>
      <Image url={image? service.url(image): null}/>
    </div>
  )
}