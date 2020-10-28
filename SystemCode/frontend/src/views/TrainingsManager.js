import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { makeStyles } from '@material-ui/core'
import { Table, Button, Modal, Space, Typography, Select, Switch, Slider, Transfer, Tag} from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import humanizeDuration from 'humanize-duration'
import TrainingService from '../services/TrainingService'
import DatasetService from '../services/DatasetService'
import ModelService from '../services/ModelService'
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
  },
  switch: {
    width: '47%',
    fontWeight: 700,
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  slider: {
    width: '80%'
  },
  transfer: {
    width: '100%',
    marginBottom: theme.spacing(1)
  },
  clickable: {
    '&:hover': {
      cursor: 'pointer'
    }
  },
  sync: {
    verticalAlign: 'middle',
    marginLeft: theme.spacing(2),
    '&:hover': {
      cursor: 'pointer'
    },
    "& svg": {
      width: 24,
      height: 24,
      color: 'rgb(24,144,255)'
    },
    "& svg:hover": {
      color: 'rgb(74,168,255)'
    }
  }
}))

export default function TrainingsManager({modelType}){
  const classes = useStyles();

  let [baseModels, setBaseModels] = React.useState([]);
  let refreshBaseModels = async () => {
    let models = await new ModelService().list(modelType);
    setBaseModels(models.filter(m => m.ensemble === 0));
  }

  let [datasets, setDatasets] = React.useState([]);
  let refreshDatasets = async () => {
    let dsts = await new DatasetService().list(modelType);
    setDatasets(dsts.filter(d => d.status === 1));
  }

  let [trainings, setTrainings] = React.useState([]);
  let refresh = async () => {
    let trns = await service.list(modelType);
    setTrainings(trns);
  }
  React.useEffect(() => {
    service.list(modelType).then(setTrainings);
  }, [modelType]);

  let [training, setTraining] = React.useState({visible: false, key: uuidv4()});
  let changeTraining = (p0, p1) => value => {
    if(p0 === 'name'){
      if(value && value.startsWith('ensemble')){
        setTraining(trn => ({...trn, name: value, ensemble: true}));
      }else{
        setTraining(trn => ({...trn, name: value, ensemble: false, base_models: []}));
      }
    }else if(p1){
      setTraining(trn => {
        let child = trn[p0];
        child = {...child, [p1]: value};
        return {...trn, [p0]: child};
      });
    }else{
      setTraining(trn => ({...trn, [p0]: value}));
    }
  }
  let saveTraining = async () => {
    let {name, ensemble, base_models, settings, datasets} = training;
    if(name && settings && datasets && datasets.uuid){
      await service.create({type: modelType, name, ensemble, base_models, settings, datasets}, true);
      await refresh();
    }
    setTraining({visible: false, key: uuidv4()});
  }

  const pause = async ({uuid}) => {
    await service.updateStatus(uuid, -1);
    refresh();
  }
  const resume = async ({uuid}) => {
    await service.updateStatus(uuid, 0);
    refresh();
  }

  const handleSync = async () => {
    await service.triggerProcess();
    refresh();
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
    title: 'Duration',
    dataIndex: 'duration',
    sorter: ({duration: a = 0}, {duration: b = 0}) => a-b,
    render: duration => duration? humanizeDuration(duration): ""
  },{
    title: 'Accuracy',
    dataIndex: 'metrics',
    sorter: ({metrics: {acc_score: a = 0}}, {metrics: {acc_score: b = 0}}) => a-b,
    render: ({acc_score: acc}) => acc? (100 * acc).toFixed(2) + "%": "",
    align: 'right'
  },{
    title: 'Status',
    dataIndex: 'status',
    sorter: (a, b) => a.status - b.status,
    render: (status, trn) => {
      switch (status){
        case -1: return <Tag color="orange" className={classes.clickable} onClick={()=>resume(trn)}>paused</Tag>;
        case 0: return <Tag className={classes.clickable} onClick={()=>pause(trn)}>pending</Tag>;
        case 1: return <Tag color="blue">running</Tag>;
        case 2: return <Tag color="green">success</Tag>;
        case 3: return <Tag color="red">failure</Tag>;
        default: return null;
      }
    }
  }];

  return (
    <div className={classes.root}>
      <div className={classes.toolbar}>
        <Button type="primary" onClick={async ()=>{
          await refreshBaseModels();
          await refreshDatasets();
          setTraining(m => ({
            ...m, visible: true, 
            settings: {
              batch_size: config.backend.training.defaultBatchSize,
              max_epochs: config.backend.training.defaultMaxEpochs
            }, 
            datasets: {}
          }));
        }}>Add Training</Button>
        <SyncOutlined className={classes.sync} onClick={handleSync}/>
      </div>
      <Modal width={720}
        title="Add Training"
        visible={training.visible}
        onOk={saveTraining}
        onCancel={()=>setTraining({visible: false, key: uuidv4()})}
      >
        <Space className={classes.space} direction="vertical">
          <Typography.Text className={classes.text}>Choose Dataset</Typography.Text>
          <Select className={classes.select} key={`${training.key}-ds-uuid`} defaultValue="" onChange={changeTraining('datasets', 'uuid')}>
            <Select.Option key={0} value="">Select ...</Select.Option>
            {datasets.map(d => (
              <Select.Option key={d.uuid} value={d.uuid}>{d.label}</Select.Option>
            ))}
          </Select>
          <div>
            <Switch className={classes.switch} key={`${training.key}-ds-user`} onChange={changeTraining('datasets', 'include_user_images')}
              checkedChildren="Include user uploaded images" 
              unCheckedChildren="Exclude user uploaded images"
            />
            <Switch className={classes.switch} key={`${training.key}-ds-generator`} onChange={changeTraining('datasets', 'include_generator_images')}
              checkedChildren="Include generator produced images" 
              unCheckedChildren="Exclude generator produced images"
            />
          </div>
          <Typography.Text className={classes.text}>Choose Model</Typography.Text>
          <Select className={classes.select} key={`${training.key}-name`} defaultValue="" onChange={changeTraining('name')}>
            <Select.Option key={0} value="">Select ...</Select.Option>
            {config.backend[modelType].models.map(m => (
              <Select.Option key={m.name} value={m.name}>{m.label}</Select.Option>
            ))}
          </Select>
          {training.ensemble? (
            <React.Fragment>
              <Typography.Text className={classes.text}>Base Models</Typography.Text>
              <Transfer className={classes.transfer} key={`${training.key}-base-models`} 
                dataSource={baseModels}
                titles={['Unselected Models', 'Selected Models']}
                targetKeys={training.base_models}
                onChange={changeTraining('base_models')}
                render={item => item.label}
                listStyle={{width: '50%'}}/>
            </React.Fragment>
          ): null}
          <Typography.Text className={classes.text}>Batch Size</Typography.Text>
          <Slider className={classes.slider} key={`${training.key}-batch-size`} 
            min={1} max={200} defaultValue={config.backend.training.defaultBatchSize}
            onAfterChange={changeTraining('settings', 'batch_size')}
          />
          <Typography.Text className={classes.text}>Maximum Epochs</Typography.Text>
          <Slider className={classes.slider} key={`${training.key}-max-epochs`} 
            min={1} max={100} defaultValue={config.backend.training.defaultMaxEpochs}
            onAfterChange={changeTraining('settings', 'max_epochs')}
          />
        </Space>
      </Modal>
      <Table columns={columns} dataSource={trainings}/>
    </div>
  )
}