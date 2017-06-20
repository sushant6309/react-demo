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
import {Col, Row} from 'react-bootstrap';

export default class Reminders extends React.Component{

  constructor(props){
    super(props);
    // Middleware();
    this.state = {
      upComingReminders:[],
      pastReminders: [],
      message: '',
      phoneNumber: '',
      scheduleDateTime: '',
    };
    this.getReminders();
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

  render() {
      return(
        <div className="container">
          <HeaderNav />"
          <Row>
            <Col md={6}> Sushant </Col>
            <Col md={6}> Yadav </Col>
          </Row>
        </div>
      );
  }
}