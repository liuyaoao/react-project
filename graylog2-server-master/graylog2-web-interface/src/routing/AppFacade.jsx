import React from 'react';
import Reflux from 'reflux';
import LoginPage from 'react-proxy?name=LoginPage!pages/LoginPage';
import LoggedInPage from 'react-proxy?name=LoggedInPage!pages/LoggedInPage';
import ServerUnavailablePage from 'pages/ServerUnavailablePage';

import StoreProvider from 'injection/StoreProvider';
const SessionStore = StoreProvider.getStore('Session');
const ServerAvailabilityStore = StoreProvider.getStore('ServerAvailability');

import 'javascripts/shims/styles/shim.css';
import 'bootstrap-dist/css/bootstrap.min.css';
import 'stylesheets/font-awesome.min.css';
import 'stylesheets/newfonts.less';
import 'stylesheets/bootstrap-submenus.less';
import 'stylesheets/toastr.min.css';
import 'stylesheets/rickshaw.min.css';
import 'stylesheets/graylog2.less';
import 'stylesheets/bootstrap-table.min.css';
import "react-widgets-dist/css/react-widgets.css";

const AppFacade = React.createClass({
  mixins: [Reflux.connect(SessionStore), Reflux.connect(ServerAvailabilityStore)],

  componentDidMount() {
    this.interval = setInterval(ServerAvailabilityStore.ping, 20000);
  },

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },

  render() {
    if (!this.state.server.up) {
      return <ServerUnavailablePage server={this.state.server} />;
    }
    if (!this.state.sessionId) {
      return <LoginPage />;
    }
    return <LoggedInPage />;
  },
});

export default AppFacade;
