import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Tabs, Typography, Space, Slider } from 'antd'
import AppService from '../services/AppService'
import AffixHeader from '../components/layout/AffixHeader'
import GeneratorModels from './GeneratorModels'
import config from '../config'

const app = new AppService();

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2)
  },
  space: {
    width: '100%',
    margin: theme.spacing(2,0)
  },
  text: {
    margin: theme.spacing(0,2),
    color: "rgba(0,0,0,0.7)",
    fontWeight: 700
  },
  slider: {
    margin: theme.spacing(1,2,5,2),
    maxWidth: 360
  }
}))

export default function SystemSettings(){
  const classes = useStyles();

  let [settings, setSettings] = React.useState({
    generator_batch_size: config.backend.generator.batchSize
  });
  let changeSetting = key => value => {
    setSettings(s => ({...s, [key]: value}));
    app.mergeSettings({[key]: value});
  }
  return (
    <div className={classes.root}>
      <AffixHeader title="System Settings"/>
      <br/>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Image Generator" key="1">
          <Space className={classes.space} direction="vertical">
            <Typography.Text className={classes.text}>Number of images generated per batch</Typography.Text>
            <Slider className={classes.slider} min={1} max={20} defaultValue={settings.generator_batch_size} onAfterChange={changeSetting('generator_batch_size')}/>
            <Typography.Text className={classes.text}>Model configurations</Typography.Text>
            <GeneratorModels/>
          </Space>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Image Detector" key="2">
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}