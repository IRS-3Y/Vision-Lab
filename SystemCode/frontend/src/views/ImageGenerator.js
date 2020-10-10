import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Switch } from 'antd'
import {
  HeartTwoTone,
  CloudDownloadOutlined
} from '@ant-design/icons'

import ImageService from '../services/ImageService'
import ImageCard from '../components/image/ImageCard'
import AffixHeader from '../components/layout/AffixHeader'

const service = new ImageService();

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexFlow: 'row wrap'
  },
  model:{
    margin: theme.spacing(0,2,0,0),
    width: 200,
    fontWeight: 500
  },
  image: {
    margin: theme.spacing(2,2,0,0),
    width: 200
  }
}))

export default function ImageGenerator(){
  const classes = useStyles();

  const models = [{
    name: 'Model A',
    likes: 1207,
    downloads: 3204
  },{
    name: 'Model B',
    likes: 192,
    downloads: 356
  },{
    name: 'Model C',
    likes: 402,
    downloads: 2012
  }].map(({name, likes, downloads}, i) => (
    <div key={i} className={classes.model}>
      <div style={{marginBottom: 8}}>{name}{' '}<Switch/></div>
      <HeartTwoTone twoToneColor="#ff3629"/>{' '}{likes}
      <CloudDownloadOutlined style={{color: '#097bd9', marginLeft: 12}}/>{' '}{downloads}
    </div>
  ));

  const images = [
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
    "6685fade-722d-4d40-8cb6-7d293d63ee47",
  ].map((uuid, i) => {
    let url = service.url({uuid, type: '.png'});
    return (
      <ImageCard className={classes.image} key={i}
        url={url}
        onLike={()=>console.log('like')}
        onDislike={()=>console.log('dislike')}/>
    )
  })
  return (
    <div className={classes.root}>
      <AffixHeader title="Image Generator">
        <div className={classes.container}>
          {models}
        </div>
      </AffixHeader>
      <div className={classes.container}>
        {images}
      </div>
    </div>
  )
}