import React from 'react'
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { Card } from 'antd'

import imgG from '../assets/img/generator.png'
import imgD from '../assets/img/detector.png'

const { Meta } = Card

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    display: 'flex',
    flexFlow: 'row wrap'
  },
  card: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    width: 240
  },
  meta: {
    textAlign: 'center'
  },
  img: {
    filter: 'opacity(80%)'
  }
}))

export default function HomeView(){
  const classes = useStyles();
  const history = useHistory();
  return (
    <div className={classes.root}>
      <Card className={classes.card}
        hoverable
        cover={<img className={classes.img} alt="generator" src={imgG}/>}
        onClick={()=>history.push('/generator')}
      >
        <Meta className={classes.meta} title="Image Generator"/>
      </Card>
      <Card className={classes.card}
        hoverable
        cover={<img className={classes.img} alt="detector" src={imgD}/>}
        onClick={()=>history.push('/detector')}
      >
        <Meta className={classes.meta} title="Image Detector"/>
      </Card>
    </div>
  )
}