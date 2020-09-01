import React from 'react';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

export default class ErrorBoundary extends React.Component {
  state = {
    error: false,
    info: {}
  }
  reset = () => {
    this.setState({
      error: false, 
      info: {}
    });
  }
  render() {
    const {error} = this.state;
    if (error) {
      return (
        <div className="error-boundary">
          <Alert severity="error">{error.message}</Alert>
          <Button variant="contained" onClick={this.reset}>Reload</Button>
        </div>
      );
    }else{
      const {children} = this.props;
      return children? children: null;
    }
  }
  // error handling
  componentDidCatch(error, info){
    const {onCatchError} = this.props;
    const event = {error, info};
    onCatchError && onCatchError(event);
    if(!event.handled){
      this.setState({error, info});
    }
  }
}