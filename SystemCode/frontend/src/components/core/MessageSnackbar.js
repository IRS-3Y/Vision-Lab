import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Typography from '@material-ui/core/Typography';
import { v4 as uuid } from 'uuid';

function schedule(task, milliseconds, recursive){
  let handle = null, cancel = null;
  if(recursive){
    handle = window.setInterval(task, milliseconds);
    cancel = () => window.clearInterval(handle);
  }else{
    handle = window.setTimeout(task, milliseconds);
    cancel = () => window.clearTimeout(handle);
  }
  return {cancel};
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class MessageSnackbar extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      open: false,
      message: {}
    }
    this.queue = props.queue;
  }

  render() {
    const {defaultSeverity, anchorOrigin, autoHideDuration} = this.props;
    const {open, message} = this.state;
    return (
      <Snackbar key={message.id}
        anchorOrigin={anchorOrigin}
        autoHideDuration={message.lifespan? message.lifespan: autoHideDuration}
        open={open}
        onClose={this.handleClose}
        onExited={this.handleExited}
      >
        <Alert severity={message.severity? message.severity: defaultSeverity}>
          {message.title? <AlertTitle>{message.title}</AlertTitle>: null}
          {message.text? <Typography variant="subtitle2">{message.text}</Typography>: null}
        </Alert>
      </Snackbar>
    )
  }

  componentDidMount(){
    this.timer = schedule(() => {
      try{
        this.processQueue();
      }catch(e){
        console.log(e);
      }
    }, this.props.processQueueInterval, true);
  }

  componentWillUnmount(){
    if(this.timer){
      this.timer.cancel();
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleExited = () => {
    this.processQueue();
  }

  processQueue = async () => {
    if(!this.queue){
      return;
    }else if(this.state.open || this.processing){
      return;
    }
    this.processing = true;
    try{
      let message = await this.queue.shift();
      if(message){
        if(typeof message === 'string'){
          message = { text: message }
        }else{
          message = {...message};
        }
        if(!message.id){
          message.id = uuid();
        }
        this.setState({ message, open: true })
      }
    }finally{
      this.processing = false;
    }
  }

  static defaultProps = {
    processQueueInterval: 500,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    autoHideDuration: 5000,
    defaultSeverity: "info"
  };
}
