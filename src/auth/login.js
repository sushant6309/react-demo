/**
 * Created by apple on 17/06/17.
 */
import React from 'react';
import './login.css';
import AppAPI from '../lib/api';

export default class Login extends React.Component{

  constructor(props, context){
    super(props);
    this.state = {
      userName: '',
      userNameError: '',
      password: '',
      passwordError: '',
      confirmPassword: '',
      confirmPasswordError: '',
      isLogin: true,
      errorMessage: ''
    };
    this.handleUserName = this.handleUserName.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.login = this.login.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.signUp = this.signUp.bind(this);
    const userCheck = sessionStorage.getItem('token');
    if(userCheck !== null){
      window.location.href = '/reminders';
    }
  }

  handleUserName(event) {
    this.setState({ userName: event.target.value });
  }

  handlePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleConfirmPassword(event) {
    this.setState( {confirmPassword: event.target.value });
  }

  login(){
    this.clearErrors();
    const request = new Promise(async (resolve, reject) =>
      AppAPI.login.post({
        username: this.state.userName,
        password: this.state.password,
      })

    .then((response) => {
      return resolve(response);
    }).catch(err => reject(err)));

    request.then((response) => {
      sessionStorage.setItem('token', response.key);
      sessionStorage.setItem('user', this.state.userName);
      window.location.href = '/reminders';
    })
    .catch(err => {
      if(err.password){
        this.setState({ passwordError: err.password[0] });
      }
      if(err.username){
        this.setState({ userNameError: err.username[0] });
      }
      if(err.non_field_errors){
        this.setState({ errorMessage: err.non_field_errors[0] })
      }
    });
  }

  toggleForm(){
    this.setState({
      userName:'',
      password:'',
      confirmPassword: '',
      isLogin:!this.state.isLogin,
    });
    this.clearErrors();
  }

  clearErrors(){
    this.setState({
      userNameError: '',
      passwordError: '',
      confirmPasswordError: '',
    });
  }

  signUp(){
    this.clearErrors();
    const request = new Promise(async (resolve, reject) =>
      AppAPI.register.post({
        email: this.state.userName,
        password: this.state.password,
        confirm_password: this.state.confirmPassword,
    })
    .then((response) => {
      return resolve(response);
    }).catch(err => reject(err)));

    request.then((response) => {
      sessionStorage.setItem('token', response.token);
      sessionStorage.setItem('user', this.state.userName);
      window.location.href = '/reminders';

    })
    .catch(err => {
      if(err.password){
        this.setState({ passwordError: err.password[0] });
      }
      if(err.username){
        this.setState({ userNameError: err.username[0] });
      }
      if(err.confirm_password){
        this.setState({ confirmPasswordError: err.confirm_password[0] })
      }
    });

  }

  render() {
    if(this.state.isLogin){
      return(
        <div className="login-container">
          <div className="login-form">
            <header>Login</header>
            <div className="help">{this.state.errorMessage}</div>
            <label>Username <span className="require">*</span></label>
            <input  type="email" value={this.state.userName} onChange={this.handleUserName} />
            <div className="help">{this.state.userNameError}</div>
            <label style={{marginTop: 15}}>Password <span className="require">*</span></label>
            <input type="password" value={this.state.password} onChange={this.handlePassword} />
            <div className="help">{this.state.passwordError}</div>

            <button type="button" onClick={this.login}>Login</button>
            <button type="button"  onClick={this.toggleForm}>Sign Up</button>

          </div>
        </div>
      );
    }
    return(
      <div className="login-container">
        <div className="login-form">
          <header>Sign Up</header>
          <div className="help">{this.state.errorMessage}</div>
          <label >Username <span className="require">*</span></label>
          <input type="email" value={this.state.userName} onChange={this.handleUserName} />
          <div className="help">{this.state.userNameError}</div>
          <label style={{marginTop: 15}}>Password <span className="require">*</span></label>
          <input type="password" value={this.state.password} onChange={this.handlePassword}/>
          <div className="help">{this.state.passwordError}</div>
          <label style={{marginTop: 15}}>Confirm Password <span className="require">*</span></label>
          <input type="password" value={this.state.confirmPassword} onChange={this.handleConfirmPassword}/>
          <div className="help">{this.state.confirmPasswordError}</div>

          <button type="button" className="sign-up" onClick={this.signUp}>Sign Up</button>
          <button type="button" onClick={this.toggleForm}>Login</button>
        </div>
      </div>
    );
  }
}