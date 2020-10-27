import React from 'react'
import { makeStyles } from '@material-ui/core'
import { Tabs, Typography, Space } from 'antd'
import AffixHeader from '../components/layout/AffixHeader'
import TrainingsManager from './TrainingsManager'
import DatasetsManager from './DatasetsManager'

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
  }
}))

export default function ModelTrainings(){
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AffixHeader title="Model Trainings"/>
      <br/>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Image Detector" key="1">
          <Space className={classes.space} direction="vertical">
            <Typography.Text className={classes.text}>Training configurations</Typography.Text>
            <TrainingsManager modelType="detector"/>
            <br/>
            <Typography.Text className={classes.text}>Dataset configurations</Typography.Text>
            <DatasetsManager modelType="detector"/>
          </Space>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}