import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { makeStyles } from '@material-ui/core'
import { Table, Button, Modal, Space, Typography, Select} from 'antd'
import TrainingService from '../services/TrainingService'
import config from '../config'

const service = new TrainingService();

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
  }
}))

export default function TrainingsManager({modelType}){
  const classes = useStyles();

  let [trainings, setTrainings] = React.useState([]);
  let refresh = async () => {
    let trns = await service.list(modelType);
    setTrainings(trns);
  }
  React.useEffect(() => {
    service.list(modelType).then(setTrainings);
  }, [modelType]);

  let [training, setTraining] = React.useState({visible: false, key: uuidv4()});
  let changeTraining = prop => value => {
    setTraining(trn => ({...trn, [prop]: value}));
  }
  let saveTraining = async () => {
    let {name, ensemble, base_models, settings, datasets} = training;
    if(name && settings && datasets){
      await service.create({type: modelType, name, ensemble, base_models, settings, datasets});
      await refresh();
    }
    setTraining({visible: false, key: uuidv4()});
  }

  const sorter = prop => (a, b) => a[prop].localeCompare(b[prop]);
  const columns = [{
    title: 'Model Name',
    dataIndex: 'name',
    width: '20%',
    sorter: sorter('name'),
    render: name => config.getModel({name}).label
  },{
    title: 'Created Time',
    dataIndex: 'created_at',
    sorter: sorter('created_at')
  },{
    title: 'Start Time',
    dataIndex: 'begin_at',
    sorter: sorter('begin_at')
  },{
    title: 'End Time',
    dataIndex: 'end_at',
    sorter: sorter('end_at')
  },{
    title: 'Status',
    dataIndex: 'status',
    sorter: (a, b) => a.status - b.status
  }];

  return (
    <div className={classes.root}>
      <div className={classes.toolbar}>
        <Button type="primary" onClick={()=>setTraining(m => ({...m, visible: true, settings: {}, datasets: {}}))}>Add Training</Button>
      </div>
      <Modal width={640}
        title="Add Training"
        visible={training.visible}
        onOk={saveTraining}
        onCancel={()=>setTraining({visible: false, key: uuidv4()})}
      >
        <Space className={classes.space} direction="vertical">
          <Typography.Text className={classes.text}>Model Name</Typography.Text>
          <Select className={classes.select} key={`${training.key}-name`} defaultValue="" onChange={changeTraining('name')}>
            <Select.Option key={0} value="">Select ...</Select.Option>
            {config.backend[modelType].models.map(m => (
              <Select.Option key={m.name} value={m.name}>{m.label}</Select.Option>
            ))}
          </Select>
        </Space>
      </Modal>
      <Table columns={columns} dataSource={trainings}/>
    </div>
  )
}