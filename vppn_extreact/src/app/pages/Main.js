import React, { createElement, Component } from 'react';
import { connect } from 'react-redux';
import { routeNodeSelector } from 'redux-router5';
var Login = require('./login');
var WirelessConfig = require('../windows/wirelessConfig');
var ReactWMHome = require('../../home');

const components = {
    'login':   Login,
    'wireless': WirelessConfig
};

var Main = React.createClass({
  render: function(){
    const { route } = this.props;
    const segment = route ? route.name.split('.')[0] : undefined;
    console.log(route.name);
    return (
        <div>
          { route.name == 'login' ? <div className="App">{createElement(components[segment] || NotFound)}</div> :
            <div className="App">
              <ReactWMHome />


            </div>
          }
        </div>

    )
  }
})

Main = connect(routeNodeSelector(''))(Main);
module.exports = Main;
