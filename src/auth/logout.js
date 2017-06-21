/**
 * Created by apple on 20/06/17.
 *
 * Logout
 */
import React from 'react';

export default class Logout extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      user: sessionStorage.getItem('user'),
    };
    this.logout = this.logout.bind(this);
  }

  logout() {
    sessionStorage.clear();
    window.location.href='/';
  }

  render(){
    return(
      <div onClick={this.logout}>{this.state.user} Logout</div>
    );
  }
}

