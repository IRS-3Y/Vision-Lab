import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { makeStyles } from '@material-ui/core'
import { Table, Button, Modal, Space, Typography, Input, Switch } from 'antd'
import DatasetService from '../services/DatasetService'
import FileService from '../services/FileService'
import FileUploader from '../components/file/FileUploader'

const service = new DatasetService();

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

export default function DatasetsManager({modelType}){
  const classes = useStyles();

  let [datasets, setDatasets] = React.useState([]);
  let refresh = async () => {
    let dsts = await service.list(modelType);
    setDatasets(dsts);
  }
  React.useEffect(() => {
    service.list(modelType).then(setDatasets);
  }, [modelType]);

  let [dataset, setDataset] = React.useState({visible: false, key: uuidv4()});
  let changeDataset = prop => value => {
    setDataset(dst => ({...dst, [prop]: value}));
  }
  let saveDataset = async () => {
    let {name, label, file} = dataset;
    if(name && label && file){
      await service.create({type: modelType, name, label, file});
      await refresh();
    }
    setDataset({visible: false, key: uuidv4()});
  }

  const sorter = prop => (a, b) => a[prop].localeCompare(b[prop]);
  const columns = [{
    title: 'Name',
    dataIndex: 'name',
    width: '20%',
    sorter: sorter('name')
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
        setDatasets(dsts => dsts.map(m => (m.uuid === uuid? {...m, status}: m)));
      }}/>
    )
  }];

  return (
    <div className={classes.root}>
      <div className={classes.toolbar}>
        <Button type="primary" onClick={()=>setDataset(m => ({...m, visible: true}))}>Upload Dataset</Button>
      </div>
      <Modal width={640}
        title="Upload Dataset"
        visible={dataset.visible}
        onOk={saveDataset}
        onCancel={()=>setDataset({visible: false, key: uuidv4()})}
      >
        <Space className={classes.space} direction="vertical">
          <Typography.Text className={classes.text}>Name</Typography.Text>
          <Input className={classes.input} key={`${dataset.key}-name`} placeholder="Enter ..." onChange={e => changeDataset('name')(e.target.value)}/>
          <Typography.Text className={classes.text}>Display Label</Typography.Text>
          <Input className={classes.input} key={`${dataset.key}-label`} placeholder="Enter ..." onChange={e => changeDataset('label')(e.target.value)}/>
          {dataset.name? (
            <React.Fragment>
              <Typography.Text className={classes.text}>Dataset File</Typography.Text>
              <FileUploader className={classes.uploader} key={`${dataset.key}-file`} 
                accept={['.tar']} onUploaded={changeDataset('file')}
                service={new FileService({chunkSize: 1024 * 1024})}/>
            </React.Fragment>
          ): null}
        </Space>
      </Modal>
      <Table columns={columns} dataSource={datasets}/>
    </div>
  )
}