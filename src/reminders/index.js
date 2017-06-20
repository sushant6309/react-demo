/**
 * Created by apple on 17/06/17.
 */
import React from 'react';
import AppAPI from '../lib/api';
import './index.css';
import Middleware from '../auth/middleware';
import moment from 'moment';
import _ from 'lodash';
import HeaderNav from '../layouts/header';
import {Col, Row, FormControl, FormGroup, Button, Nav} from 'react-bootstrap';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

export default class Reminders extends React.Component{

  constructor(props){
    super(props);
    // Middleware();
    this.state = {
      upComingReminders:[],
      pastReminders: [],
      message: '',
      phoneNumber: '',
      scheduleDateTime: moment(),
    };
    this.getReminders();
    this.handleAddMessage = this.handleAddMessage.bind(this);
    this.handleAddNumber = this.handleAddNumber.bind(this);
    this.handleAddDate = this.handleAddDate.bind(this);
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
    const request = new Promise(async (resolve, reject) =>
      AppAPI.reminders.post({
        scheduled_datetime: this.state.scheduleDateTime,
        message: this.state.message,
        phone_number: this.state.phoneNumber
      })
        .then((response) => {
          return resolve(response);
        }).catch(err => reject(err)));

    request.then((response) => {

      let upComingReminders = this.state.upComingReminders;
      upComingReminders.push(response);

      this.setState({
        upComingReminders,
      });

    })
    .catch(err => {
      console.debug(err);
    });
  }

  updateReminder(id){
    const request = new Promise(async (resolve, reject) =>
      AppAPI.reminders.put({
        scheduled_datetime: this.state.scheduleDateTime,
        message: this.state.message,
        phone_number: this.state.phoneNumber,
        id: id
      })
      .then((response) => {
        return resolve(response);
      }).catch(err => reject(err)));

    request.then((response) => {

      let upComingReminders = this.state.upComingReminders;
      let pastReminders = this.state.pastReminders;

      if(moment().isBefore(moment(response.scheduled_datetime))){
        upComingReminders.push(response);
      }else {
        pastReminders.push(response);
      }

      upComingReminders.push(response);

      this.setState({
        upComingReminders,
        pastReminders,
      });

    })
    .catch(err => {
      console.debug(err);
    });
  }

  deleteReminder(id){
    const request = new Promise(async (resolve, reject) =>
      AppAPI.reminders.delete({
        id: id
      })
        .then((response) => {
          return resolve(response);
        }).catch(err => reject(err)));

    request.then((response) => {

      //ToDo: Remove reminder from its associated array.
    })
      .catch(err => {
        console.debug(err);
      });
  }

  handleAddMessage(event){
    this.setState( {message: event.target.value });
  }

  handleAddNumber(event){
    this.setState( {phoneNumber: event.target.value });
  }

  isValidDate(current){
    const yesterday = moment().subtract( 1, 'day' );
    return current.isAfter(yesterday);
  }

  handleAddDate(date){
    this.setState({ scheduleDateTime: date.format('DD/MM/YYYY hh:mm A')  })
  }

  render() {
      return(
        <div>
          <Nav className="navbar navbar-inverse">
            <div className="container-fluid">
              <div className="navbar-header pull-right">
                <ul className="nav navbar-nav navbar-right">
                  <li> <a href="#">John@example.com <span className="glyphicon glyphicon-user"> </span></a></li>

                </ul>
              </div>
            </div>
          </Nav>
          <div className="container">
            <Row>
              <h5>Add Reminder</h5>
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
                <Button bsStyle="primary" bsSize="sm" > Add</Button>
              </Col>
            </Row>
            <Row>
              <h5><a>Upcoming Reminders</a></h5>
              <Col sm={12}>
                <ul className="products" style={{listStyleType: 'circle'}}>
                  <li><h5 className="content">Discussion with manager regarding new project release <span className="badge badge-default">July 30 at 10:30 a:m</span></h5>
                    <button type="button" className="btn btn-primary">Edit</button>
                    <button className="btn btn-danger" type="submit">Remove</button>
                  </li>

                  <div className="clearfix"> </div>

                  <li><h5 className="content">Discussion with manager regarding new project release <span className="badge badge-default">July 30 at 10:30 a:m</span></h5>
                    <button type="button" className="btn btn-primary">Edit</button>
                    <button className="btn btn-danger" type="submit">Remove</button>
                  </li>

                  <div className="clearfix"> </div>

                  <li><h5 className="content">Discussion with manager regarding new project release <span className="badge badge-default">July 30 at 10:30 a:m</span></h5>
                    <button type="button" className="btn btn-primary">Edit</button>
                    <button className="btn btn-danger" type="submit">Remove</button>
                  </li>
                </ul>
              </Col>
            </Row>
            <Row>
              <h5><a>Past Reminders</a></h5>
              <Col sm={12}>
                <ul className="reminder-past">
                  <li><h5 className="content">Discussion with manager regarding new project release <span className="badge badge-default">July 30 at 10:30 a:m</span></h5>
                    <button type="button" className="btn btn-primary">Remind Again</button>
                    <button className="btn btn-danger" type="submit">Remove</button>
                  </li>

                  <div className="clearfix"> </div>

                  <li><h5 className="content">Discussion with manager regarding new project release <span className="badge badge-default">July 30 at 10:30 a:m</span></h5>
                    <button type="button" className="btn btn-primary">Remind Again</button>
                    <button className="btn btn-danger" type="submit">Remove</button>
                  </li>

                  <div className="clearfix"> </div>

                  <li><h5 className="content">Discussion with manager regarding new project release <span className="badge badge-default">July 30 at 10:30 a:m</span></h5>
                    <button type="button" className="btn btn-primary">Remind Again</button>
                    <button className="btn btn-danger" type="submit">Remove</button>
                  </li>
                </ul>
              </Col>
            </Row>
          </div>
        </div>
      );
  }
}