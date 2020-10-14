import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from './App';
import Landing from './Landing'

import 'antd/dist/antd.css';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={Landing}/>
      <Route path="/" component={App}/>
    </Switch>
  </Router>,
  document.getElementById('root')
);