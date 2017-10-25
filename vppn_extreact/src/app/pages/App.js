var React = require('react');
// var Main = require('./Main');
var ReactWMHome = require('../../home');
var {connect} = require('react-redux');
import { bindActionCreators } from 'redux';
import * as HomeActions from '../actions/home_action';
var Login = require('./login');

var App = React.createClass({
  render: function(){
    var {userLogin} = this.props;
    return (
      <div className='mail-client'>
          {userLogin ? <ReactWMHome /> : <Login />}
      </div>
    )
  }
})
function mapStateToProps(state){
  const {userLogin} = state.homeReducer;
  return {
    userLogin
  }
}

module.exports = connect(
  mapStateToProps
)(App);
