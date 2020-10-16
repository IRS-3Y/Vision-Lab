import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Switch, Spin } from 'antd'
import {
  PlusOutlined,
  LoadingOutlined,
  HeartTwoTone,
  CloudDownloadOutlined
} from '@ant-design/icons'

import ImageService, {generateImage} from '../services/ImageService'
import ImageCard from '../components/image/ImageCard'
import AffixHeader from '../components/layout/AffixHeader'
import config from '../config'

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
    margin: theme.spacing(1,2,1,0),
    width: 200,
    fontWeight: 500
  },
  image: {
    margin: theme.spacing(2,2,0,0),
    width: 200
  },
  imagePlus: {
    margin: theme.spacing(2,2,0,0),
    width: 200,
    height: 200,
    border: "4px dashed rgb(0, 0, 0, 0.12)",
    borderRadius: theme.spacing(2),
    "&:hover": {
      cursor: 'pointer'
    }
  },
  imagePlusIcon: {
    width: 192,
    height: 192,
    "& svg": {
      margin: 46,
      width: 100,
      height: 100,
      color: "rgb(190, 190, 190)"
    }
  }
}))

export default function ImageGenerator(){
  const classes = useStyles();

  let [images, setImages] = React.useState([]);
  let [limit, setLimit] = React.useState(0);
  let generateMore = () => setLimit(limit => limit + config.backend.generator.batchSize);

  let [models, setModels] = React.useState([]);
  let toggleModel = (name, version) => {
    return () => {
      setModels(models => models.map(model => {
        if(model.name === name && model.version === version){
          return {...model, enabled: !model.enabled}
        }
        return model;
      }))
    }
  }

  React.useEffect(() => {
    if(models.length < 1){
      //init model list
      service.getStats().then(stats => {
        let mdls = config.backend.generator.models.map(m => {
          let stat = stats.find(({model}) => model.name === m.name && model.version === m.version);
          let {likes=0, downloads=0} = (stat || {});
          return {...m, likes, downloads};
        });
        setModels(mdls);
      });
    }else{
      //handle model deselection
      let mdls = models.filter(m => m.enabled);
      if(mdls.length < 1){
        setLimit(0);
        setImages([]);
      }else{
        setImages(images => images.filter(({model: {name, version}}) => {
          return mdls.filter(m => m.name === name && m.version === version).length > 0;
        }))
      }
    }
  }, [models]);

  React.useEffect(() => {
    let active = true;
    if(images.length < limit){
      generateImage(models.filter(m => m.enabled)).then(image => {
        if(active && image){
          setImages([...images, image]);
        }
      }, err => console.error(err));
    }
    return () => { active = false; };
  }, [models, images, limit]);

  //prevent model change during image generation
  let modelFixed = images.length < limit;
  if(models.filter(m => m.enabled).length < 1){
    modelFixed = false;
  }
  const modelList = models.map(({name, version, title, enabled, disabled, likes, downloads}, i) => {
    return (
      <div key={i} className={classes.model}>
        <div style={{marginBottom: 8}}>{title}{' '}<Switch checked={enabled} disabled={disabled || modelFixed} onChange={toggleModel(name, version)}/></div>
        <HeartTwoTone twoToneColor="#ff3629"/>{' '}{likes}
        <CloudDownloadOutlined style={{color: '#097bd9', marginLeft: 12}}/>{' '}{downloads}
      </div>
    )
  });

  const imageCards = images.map(({uuid, type, model, url}, i) => {
    let updateStat = (stat, delta) => {
      return async () => {
        await service.postStats({
          image: {uuid, type},
          model,
          stats: [{name: stat, delta}] 
        });
        setModels(models => models.map(m => {
          if(m.name === model.name && m.version === model.version){
            return {...m, [stat]: m[stat] + delta};
          }
          return m;
        }));
      };
    }
    return (
      <ImageCard className={classes.image} key={i}
        url={url}
        onLike={updateStat('likes', 1)}
        onDislike={updateStat('likes', -1)}
        onDownload={updateStat('downloads', 1)}/>
    )
  })
  const imagePlus = (
    <div className={classes.imagePlus}>
      {images.length < limit?(
        <Spin indicator={<LoadingOutlined spin className={classes.imagePlusIcon}/>}/>
      ):(
        <PlusOutlined className={classes.imagePlusIcon} onClick={generateMore}/>
      )}
    </div>
  )
  return (
    <div className={classes.root}>
      <AffixHeader title="Image Generator">
        <div className={classes.container}>
          {modelList}
        </div>
      </AffixHeader>
      <div className={classes.container}>
        {imageCards}
        {imagePlus}
      </div>
    </div>
  )
}