import React from 'react';
import { makeStyles } from '@material-ui/core';
import {Progress} from 'antd'
import ImageService from '../services/ImageService';
import ImageDropzone from '../components/image/ImageDropzone';
import Image from '../components/image/Image';
import AffixHeader from '../components/layout/AffixHeader'

const service = new ImageService();

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2)
  },
  progress: {
    width: '100%'
  }
}))

export default function ImageDetector({setResult}) {
  const classes = useStyles();

  let [percent, setPercent] = React.useState(-1);

  let [image, setImage] = React.useState(null);
  let handleImageChange = async files => {
    if(files.length){
      setResult(null);
      setPercent(0);
      let uploaded = await service.upload(files[0]);
      setImage(uploaded);
      let result = await service.detect(uploaded, ({total, current}) => {
        setPercent(Math.round(100*(1+current)/(1+total)));
      });
      setResult(result.info);
    }else{
      setPercent(-1);
      setResult(null);
      setImage(null);
    }
  }
  return (
    <div className={classes.root}>
      <AffixHeader title="Image Detector"/>
      <br/>
      <ImageDropzone onChange={handleImageChange}/>
      {percent < 0? null: <Progress className={classes.progress} percent={percent}/>}
      <br/>
      <Image url={image? service.url(image): null}/>
    </div>
  )
}