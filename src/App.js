import React  from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Login from './auth/login';
import Reminders from './reminders/index';

const BasicExample = () => (
  <Router>
    <div>
      <Route exact path="/" component={Login}/>
      <Route exact path="/reminders" component={Reminders}/>
    </div>
  </Router>
)

export default BasicExample;
