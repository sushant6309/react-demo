/**
 * Created by apple on 17/06/17.
 *
 * Reminders
 */
import React from 'react';
import AppAPI from '../lib/api';
import './index.css';
import Middleware from '../auth/middleware';
import moment from 'moment';
import _ from 'lodash';
import {Col, Row, FormControl, FormGroup, Button} from 'react-bootstrap';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

export default class Reminders extends React.Component{

  constructor(props){
    super(props);
     Middleware();
    this.state = {
      upComingReminders:[],
      pastReminders: [],
      message: '',
      editMessage: '',
      phoneNumber: '',
      editPhoneNumber: '',
      scheduleDateTime: moment(),
      editScheduleDateTime: moment(),
      user: sessionStorage.getItem('user'),
    };
    this.getReminders();
    this.handleAddMessage = this.handleAddMessage.bind(this);
    this.handleAddNumber = this.handleAddNumber.bind(this);
    this.handleAddDate = this.handleAddDate.bind(this);
    this.handleEditMessage = this.handleEditMessage.bind(this);
    this.handleEditNumber = this.handleEditNumber.bind(this);
    this.handleEditDate = this.handleEditDate.bind(this);
    this.createReminders = this.createReminders.bind(this);
     this.deleteReminder = this.deleteReminder.bind(this);
  }

  getReminders() {
    const request = new Promise(async (resolve, reject) =>
      AppAPI.reminders.get()
        .then((response) => {
          return resolve(response);
        }).catch(err => reject(err)));

    request.then((response) => {

      let pastReminders = this.state.pastReminders;
      let upComingReminders = this.state.upComingReminders;

      _.forEach(response, function (reminder) {
        if(moment().isBefore(moment(reminder.scheduled_datetime))){
          reminder['edit'] = false;
          upComingReminders.push(reminder);
        }else {
          pastReminders.push(reminder);
        }
      });

      this.setState({
        pastReminders,
        upComingReminders,
      });

    })
    .catch(err => {
      console.debug(err);
    });
  }

  createReminders(){
    const cloneDate = this.state.scheduleDateTime.clone();
    const request = new Promise(async (resolve, reject) =>
      AppAPI.reminders.post({
        scheduled_datetime: cloneDate.format(),
        message: this.state.message,
        phone_number: this.state.phoneNumber
      })
        .then((response) => {
          return resolve(response);
        }).catch(err => reject(err)));

    request.then((response) => {
      let upComingReminders = this.state.upComingReminders;
      response.edit = false;
      response.scheduled_datetime = moment(response.scheduled_datetime);
      upComingReminders.push(response);

      this.setState({
        upComingReminders,
        message: '',
        phoneNumber: '',
        scheduleDateTime: moment()
      });

    })
    .catch(err => {
      console.debug(err);
    });
  }

  updateReminder(id ,key){
    const request = new Promise(async (resolve, reject) =>
      AppAPI.reminders.put({
        scheduled_datetime: this.state.editScheduleDateTime.format(),
        message: this.state.editMessage,
        phone_number: this.state.editPhoneNumber,
        id: id
      })
      .then((response) => {
        return resolve(response);
      }).catch(err => reject(err)));

    request.then((response) => {

      let upComingReminders = this.state.upComingReminders;
        response.edit = false;
        response.scheduled_datetime = moment(response.scheduled_datetime);
        upComingReminders[key] = response;

      this.setState({
        upComingReminders,
        editMessage: '',
        editPhoneNumber: '',
        editScheduleDateTime: moment(),
      });

    })
    .catch(err => {
      console.debug(err);
    });
  }

  deleteReminder(id, key, type){
    const request = new Promise(async (resolve, reject) =>
      AppAPI.reminders.delete({
        id: id
      })
        .then((response) => {
          return resolve(response);
        }).catch(err => reject(err)));

    request.then((response) => {
      if(type === 'past'){
        let pastReminders = this.state.pastReminders;
        pastReminders.splice(key,1);
        this.setState({ pastReminders });
        return true;
      }
      let upComingReminders = this.state.upComingReminders;
      upComingReminders.splice(key,1);
      this.setState({ upComingReminders });
      return true;
    })
      .catch(err => {
        //Just a temp solution as the server is not responding in json object.
        if(type === 'past'){
          let pastReminders = this.state.pastReminders;
          pastReminders.splice(key,1);
          this.setState({ pastReminders });
          return true;
        }
        let upComingReminders = this.state.upComingReminders;
        upComingReminders.splice(key,1);
        this.setState({ upComingReminders });
        return true;
      });
  }

  handleAddMessage(event){
    this.setState( {message: event.target.value });
  }

  handleAddNumber(event){
    this.setState( {phoneNumber: event.target.value });
  }

  handleAddDate(date){
    this.setState({ scheduleDateTime: date })
  }

  handleEditMessage(event){
    this.setState( {editMessage: event.target.value });
  }

  handleEditNumber(event){
    this.setState( {editPhoneNumber: event.target.value });
  }

  handleEditDate(date){
    this.setState({ editScheduleDateTime: date })
  }

  isValidDate(current){
    const yesterday = moment().subtract( 1, 'day' );
    return current.isAfter(yesterday);
  }

  editReminder(key){
    let reminders = this.state.upComingReminders;
    reminders[key].edit = true;
    this.setState({
      editScheduleDateTime : moment(reminders[key].scheduled_datetime),
      editMessage: reminders[key].message,
      editPhoneNumber: reminders[key].number,
      editId: reminders[key].id,
      upComingReminders: reminders,
    });

  }

  remindAgain(key){
    const reminder = this.state.pastReminders[key];
    this.setState({
      message: reminder.message,
      phoneNumber: reminder.phone_number,
      scheduleDateTime: moment(),
    });
  }

  cancelUpdate(key) {
    let upComingReminders = this.state.upComingReminders;
    upComingReminders[key].edit = false;
    this.setState({
      editMessage: '',
      phoneNumber: '',
      editScheduleDateTime: moment(),
      upComingReminders
    })
  }

  logout() {
    sessionStorage.clear();
    window.location.href='/';
  }


  renderUpcomingReminders(){
    const upComingReminders = _.map(this.state.upComingReminders,(reminder, key) =>{
      if(!reminder.edit){
        return(<Row key={key.toString()} >
          <Col sm={12}>
            <div className="products" >
              <h4 className="content">
                <span className="glyphicon glyphicon-unchecked"> </span> {typeof reminder !== 'undefined'?reminder.message: null}
                <span className="badge badge-default">
                  {typeof reminder !== 'undefined'?moment(reminder.scheduled_datetime).format('MMMM DD at hh:mm a'): '-'}
                </span>
              </h4>
              <div className="pull-right">
                <Button bsStyle="primary" onClick={()=>{this.editReminder(key)}}>Edit</Button>
                <Button bsStyle="danger" onClick={()=>{this.deleteReminder(reminder.id, key, 'upComing')}}>Remove</Button>
              </div>
            </div>
          </Col>
        </Row>);
      }else {
        return (<Row key={key.toString()}>
          <Col sm={5}>
            <FormGroup
              controlId="editMessage"
            >
              <FormControl
                type="text"
                value={this.state.editMessage}
                placeholder="Add reminder message"
                onChange={this.handleEditMessage}
              />
            </FormGroup>
          </Col>
          <Col sm={2}>
            <FormGroup
              controlId="addPhone"
            >
              <FormControl
                type="text"
                value={this.state.editPhoneNumber}
                placeholder="Phone Number"
                onChange={this.handleEditNumber}
              />
            </FormGroup>
          </Col>
          <Col sm={2}>
            <Datetime
              value={this.state.editScheduleDateTime}
              isValidDate={this.isValidDate}
              onChange={this.handleEditDate}
            />
          </Col>
          <Col sm={3}>
            <Button bsStyle="primary" onClick={()=>{this.updateReminder(reminder.id, key)}}> Update</Button>
            <Button bsStyle="default" onClick={()=>{this.cancelUpdate(key)}}> Cancel</Button>
          </Col>
        </Row>);
      }
    });
    return upComingReminders;
  }

  renderPastReminders(){
    return this.state.pastReminders.map((reminder, key) =>{

        return(<Row key={key.toString()} style={{marginTop: 50}}><Col sm={12}><div className="products" key={key.toString()}>
          <h4 className="content"><span className="glyphicon glyphicon-ok"> </span> <strike>{reminder.message}</strike> <span className="badge badge-default">{moment(reminder.scheduled_datetime).format('MMMM DD at hh:mm a')}</span></h4>
          <div className="pull-right">
          <Button bsStyle="primary" onClick={()=>{this.remindAgain(key)}}>Remind Again</Button>
          <Button bsStyle="danger"  onClick={()=>{this.deleteReminder(reminder.id, key, 'past')}}>Remove</Button>
          </div>
        </div></Col></Row>);
    });
  }


  render() {
      return(
        <div>
          <div className="navbar navbar-inverse">
            <div className="container-fluid">
              <div className="navbar-header pull-right">
                <ul className="nav navbar-nav navbar-right">
                  <li>
                    <a style={{cursor:'pointer'}} onClick={()=>{this.logout()}}> {this.state.user}
                      <span className="glyphicon glyphicon-log-out"> </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="container">
            <Row>
              <Col sm={12}>
                <h4>Add Reminder</h4>
              </Col>
            </Row>
            <Row>
              <Col sm={5}>
                <FormGroup
                  controlId="addMessage"
                >
                  <FormControl
                    type="text"
                    value={this.state.message}
                    placeholder="Add reminder message"
                    onChange={this.handleAddMessage}
                  />
                </FormGroup>
              </Col>
              <Col sm={3}>
                <FormGroup
                  controlId="addPhone"
                >
                  <FormControl
                    type="text"
                    value={this.state.phoneNumber}
                    placeholder="Phone Number"
                    onChange={this.handleAddNumber}
                  />
                </FormGroup>
              </Col>
              <Col sm={3}>
                <Datetime
                  value={this.state.scheduleDateTime}
                  isValidDate={this.isValidDate}
                  onChange={this.handleAddDate}
                />
              </Col>
              <Col sm={1}>
                <Button bsStyle="primary" onClick={this.createReminders} > Add</Button>
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
            <Col sm={12}><h4><a className="heading">Upcoming Reminders</a></h4></Col>
                {this.renderUpcomingReminders()}
            {(this.state.pastReminders.length > 0) && <Row><Col sm={12}><h4><a className="heading">Past Reminders</a></h4></Col></Row>}
              {()=>{this.renderPastReminders()}}
              </Col>
            </Row>
          </div>
        </div>
      );
  }
}