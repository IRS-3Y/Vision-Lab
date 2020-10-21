import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { makeStyles } from '@material-ui/core'
import { Table, Button, Modal, Space, Typography, Select, Input, Switch } from 'antd'
import ModelService from '../services/ModelService'
import FileService from '../services/FileService'
import FileUploader from '../components/file/FileUploader'
import config from '../config'

const service = new ModelService();

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0,2)
  },
  toolbar: {
    margin: theme.spacing(0)
  },
  space: {
    width: '100%'
  },
  text: {
    margin: theme.spacing(0),
    color: "rgba(0,0,0,0.7)",
    fontWeight: 700
  },
  select: {
    width: '100%',
    marginBottom: theme.spacing(1)
  },
  input: {
    width: '100%',
    marginBottom: theme.spacing(1)
  },
  uploader: {
    marginBottom: theme.spacing(3)
  }
}))

export default function ModelsManager({modelType}){
  const classes = useStyles();

  let [models, setModels] = React.useState([]);
  let refresh = async () => {
    let mds = await service.list(modelType);
    setModels(mds);
  }
  React.useEffect(() => {
    service.list(modelType).then(setModels);
  }, [modelType]);

  let [model, setModel] = React.useState({visible: false, key: uuidv4()});
  let changeModel = prop => value => {
    if(prop === 'name' && value){
      let accept = config.getModel({name: value}).accept;
      setModel(model => ({...model, accept, [prop]: value}));
    }else{
      setModel(model => ({...model, [prop]: value}));
    }
  }
  let saveModel = async () => {
    let {name, label, file} = model;
    if(name && label && file){
      await service.forModel(model).create({type: modelType, name, label, file});
      await refresh();
    }
    setModel({visible: false, key: uuidv4()});
  }

  const sorter = prop => (a, b) => a[prop].localeCompare(b[prop]);
  const columns = [{
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
    sorter: sorter('name'),
    render: name => config.getModel({name}).label
  },{
    title: 'Version',
    dataIndex: 'version',
    width: '20%',
    sorter: sorter('version')
  },{
    title: 'Display Label',
    dataIndex: 'label',
    sorter: sorter('label')
  },{
    title: 'Enabled',
    dataIndex: 'status',
    render: (s, {uuid}) => (
      <Switch checked={s === 1} onChange={async e => {
        let status = e? 1: 0;
        await service.updateStatus(uuid, status);
        setModels(mds => mds.map(m => (m.uuid === uuid? {...m, status}: m)));
      }}/>
    )
  }];

  return (
    <div className={classes.root}>
      <div className={classes.toolbar}>
        <Button type="primary" onClick={()=>setModel(m => ({...m, visible: true}))}>Upload Model</Button>
      </div>
      <Modal width={640}
        title="Upload Model"
        visible={model.visible}
        onOk={saveModel}
        onCancel={()=>setModel({visible: false, key: uuidv4()})}
      >
        <Space className={classes.space} direction="vertical">
          <Typography.Text className={classes.text}>Name</Typography.Text>
          <Select className={classes.select} key={`${model.key}-name`} defaultValue="" onChange={changeModel('name')}>
            <Select.Option key={0} value="">Select ...</Select.Option>
            {config.backend[modelType].models.map(m => (
              <Select.Option key={m.name} value={m.name}>{m.label}</Select.Option>
            ))}
          </Select>
          <Typography.Text className={classes.text}>Display Label</Typography.Text>
          <Input className={classes.input} key={`${model.key}-label`} placeholder="Enter ..." onChange={e => changeModel('label')(e.target.value)}/>
          {model.name? (
            <React.Fragment>
              <Typography.Text className={classes.text}>Model File</Typography.Text>
              <FileUploader className={classes.uploader} key={`${model.key}-file`} 
                accept={model.accept} onUploaded={changeModel('file')}
                service={new FileService({chunkSize: 1024 * 1024}).forModel(model)}/>
            </React.Fragment>
          ): null}
        </Space>
      </Modal>
      <Table columns={columns} dataSource={models}/>
    </div>
  )
}