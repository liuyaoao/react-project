var React = require('react');
var ReactDOM = require('react-dom');
var {connect} = require('react-redux');
import { bindActionCreators } from 'redux';
import * as HomeActions from '../actions/home_action';
var Store = require('../script/store');

var Login = React.createClass({
  getInitialState: function() {
    return {
      currentTimer: null
    }
  },
  componentDidMount: function(){
    $('#content').css('top', '0px');
    this.setCurrentTimer();
  },
  componentWillUnmount: function(){
    $('#content').css('top', '50px');
    this.resetLastError();
    var currentTimer = this.state.currentTimer;
    if (currentTimer) {
      clearInterval(this.state.currentTimer);
    }
  },
  setCurrentTimer: function() {
    var _self = this;
		var b = setInterval(function(){
			var date = new Date();
	    var currentTime = date.toTimeString().split(' ')[0], currentDate = date.toDateString();
	    document.getElementById('currentTime').innerHTML = currentTime;
      document.getElementById('currentDate').innerHTML = currentDate.toUpperCase().replace(' ', ' , ');
		}, 500);
		this.setState({currentTimer: b});
  },
  formatLastError(error) {
    if (error) {
      return (
        <div>
          <br />
          <div className="notify alert no-margin full-size">
            <span className="notify-closer" onClick={this.resetLastError}></span>
            <span className="notify-text">{error}</span>
          </div>
        </div>
      );
    }
    return null;
  },
  resetLastError() {
    this.props.actions.setErrorMsg('');
  },
  render: function(){
    const alert = this.formatLastError(this.props.errorMsg);
    return (
      <div>
        <div className="login-time">
          <h1 id="currentTime"></h1>
          <hr/>
          <h1 id="currentDate"></h1>
        </div>
        <div className="login-form padding30 block-shadow">
          <form onSubmit={this.handleSubmitLogin}>
              <h1 className="text-light login-title">NETGEAR ROUTER</h1>
              <br />
              <div className="input-control text full-size" data-role="input">
                  <span className="mif-user prepend-icon"></span>
                  <input type="text" name="user_login" id="user_login" ref="userName" />
                  <button className="button helper-button clear"><span className="mif-cross"></span></button>
              </div>
              <br />
              <br />
              <div className="input-control password full-size" data-role="input">
                  <span className="mif-lock prepend-icon"></span>
                  <input type="password" name="user_password" id="user_password" ref="userPassword" />
                  <button className="button helper-button reveal"><span className="mif-looks"></span></button>
              </div>
              <br /><br />
              <label className="input-control checkbox re-check">
                <input type="checkbox" />
                <span className="check"></span>
                <span className="caption"> Remember Me</span>
              </label>
              <br /><br />
              <div className="form-actions">
                  <button type="submit" className="button primary full-size bottom-shadow">SIGN IN</button>
              </div>
              {alert}
          </form>
        </div>
      </div>
    )
  },
  handleSubmitLogin: function(e){
    e.preventDefault();
    this.resetLastError();
    var userName = this.refs.userName.value;
    if (!userName) {
      this.props.actions.setErrorMsg('Please input user name');
      return;
    }
    var userPassword = this.refs.userPassword.value;
    if (!userPassword) {
      this.props.actions.setErrorMsg('Please input user password');
      return;
    }
    if (userName !== 'admin' || userPassword !== 'manage') {
      this.props.actions.setErrorMsg('Invalid credentials, please verify them and retry!');
      return;
    }
    Store.set('userLogin', true);
    this.props.actions.setUserLogin(true);
  },
  handleCancel: function(){
    this.resetLastError();
    this.refs.userName.value = '';
    this.refs.userPassword.value = '';
    this.refs.userName.focus();
  },
});

function mapStateToProps(state){
  const {userLogin, errorMsg} = state.homeReducer;
  return {
    userLogin,
    errorMsg
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(HomeActions, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
