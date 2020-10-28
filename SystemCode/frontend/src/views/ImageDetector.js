import React from 'react'
import { makeStyles } from '@material-ui/core'
import {Progress, Tag, Modal, Space, Typography, Select} from 'antd'
import ImageService from '../services/ImageService'
import ImageDropzone from '../components/image/ImageDropzone'
import Image from '../components/image/Image'
import AffixHeader from '../components/layout/AffixHeader'
import ChatBot from '../components/chatbot/ChatBot'
import config from '../config'

const service = new ImageService();

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2)
  },
  progress: {
    width: '100%'
  },
  tag: {
    margin: "4px",
    "&:hover": {
      cursor: "pointer"
    }
  },
  space: {
    width: '100%'
  },
  text: {
    verticalAlign: 'middle',
    color: "rgba(0,0,0,0.7)",
    fontWeight: 700
  },
  select: {
    width: 300
  }
}))

export default function ImageDetector() {
  const classes = useStyles();

  let [image, setImage] = React.useState(null);
  let [percent, setPercent] = React.useState(-1);
  let [result, setResult] = React.useState([]);
  let [feedback, setFeedback] = React.useState({visible: false});
  
  let handleImageChange = async files => {
    if(files.length){
      setResult([]);
      setPercent(0);
      let uploaded = await service.upload(files[0]);
      setImage(uploaded);
      let result = await service.detect(uploaded, ({total, current}) => {
        setPercent(Math.round(100*(1+current)/(1+total)));
      });
      setResult([result.info]);
      setFeedback(fb => ({
        ...fb,
        image: uploaded,
        class_label: result.result.class
      }));
    }else{
      setPercent(-1);
      setResult([]);
      setImage(null);
    }
  }

  let sendFeedback = async () => {
    await service.label(feedback);
    setFeedback({visible: false});
    setResult([]);
  }
  let feedbackActions = feedback.image? [
    <Tag className={classes.tag} key="0" color="green" onClick={sendFeedback}>Agree</Tag>,
    <Tag className={classes.tag} key="1" color="red" onClick={() => setFeedback(fb => ({...fb, visible: true}))}>Disagree</Tag>
  ]: [];

  return (
    <div className={classes.root}>
      <AffixHeader title="Image Detector"/>
      <br/>
      <ImageDropzone onChange={handleImageChange}/>
      {percent < 0? null: <Progress className={classes.progress} percent={percent}/>}
      <br/>
      <Image url={image? service.url(image): null}/>
      <Modal width={520}
        title="Feedback"
        visible={feedback.visible}
        onOk={sendFeedback}
        onCancel={()=>setFeedback(fb => ({...fb, visible: false}))}
      >
        <Space className={classes.space}>
          <Typography.Text className={classes.text}>I think this image is</Typography.Text>
          <Select className={classes.select} value={feedback.class_label} onChange={v => setFeedback(fb => ({...fb, class_label: v}))}>
            {config.backend.detector.classes.map(c => (
              <Select.Option key={c.name} value={c.name}>{c.label}</Select.Option>
            ))}
          </Select>
        </Space>
      </Modal>
      <ChatBot content={result} actions={feedbackActions} actionsTitle="What do you think?"/>
    </div>
  )
}