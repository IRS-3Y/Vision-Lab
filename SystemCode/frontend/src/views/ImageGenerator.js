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
import {findBackend} from '../adaptor'

const service = new ImageService();

let service_tf1 = null;
findBackend(({tensorflow}) => {
  return tensorflow.version.startsWith('1.');
})
.then(({tensorflow, baseUrl}) => {
  console.info(`Found tensorflow-v${tensorflow.version} backend on: ${baseUrl}`);
  service_tf1 = new ImageService({baseUrl});
}, 
err => console.error(err));

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

  let [images, setImages] = React.useState([]);
  let [limit, setLimit] = React.useState(10);

  React.useEffect(() => {
    let active = true;
    if(images.length < limit){
      service_tf1.generate({
        name: 'stylegan2',
        version: 'generator_yellow-stylegan2-config-f'
      })
      .then(image => {
        if(active){
          setImages([...images, image]);
        }
      },
      err => console.error(err));
    }
    return () => { active = false; };
  }, [images, limit]);

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

  const imageCards = images.map(({uuid, type, model}, i) => {
    let url = model.name === 'stylegan2'?
      service_tf1.url({uuid, type, subdir: model.name}):
      service.url({uuid, type, subdir: model.name});
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
        {imageCards}
      </div>
    </div>
  )
}