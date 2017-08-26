import React from 'react';
import Reflux from 'reflux';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import String from 'string';

import ActionsProvider from 'injection/ActionsProvider';
const LoggersActions = ActionsProvider.getActions('Loggers');

import StoreProvider from 'injection/StoreProvider';
const LoggersStore = StoreProvider.getStore('Loggers');

const LogLevelDropdown = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    nodeId: React.PropTypes.string.isRequired,
    subsystem: React.PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(LoggersStore)],
  componentDidMount() {
    //hover时 dropdown显示
    var hoverTimeout;
    $('.dropdown').hover(function() {
        clearTimeout(hoverTimeout);
        $(this).addClass('open');
    }, function() {
        var $self = $(this);
        hoverTimeout = setTimeout(function() {
            $self.removeClass('open');
        }, 50);
    });
  },
  _changeLoglevel(loglevel) {
    LoggersActions.setSubsystemLoggerLevel(this.props.nodeId, this.props.name, loglevel);
  },
  getLogLevelCN(loglevel) {
      switch (loglevel) {
          case 'fatal':
              return '严重';
              break;
          case 'error':
              return '错误';
              break;
          case 'warn':
              return '警告';
              break;
          case 'info':
              return '信息';
              break;
          case 'debug':
              return '调试';
              break;
          case 'trace':
              return '跟踪';
              break;
      }
  },
  render() {
    const { subsystem, nodeId } = this.props;
    var _this = this;
    const loglevels = this.state.availableLoglevels
      .map((loglevel) =>
        <MenuItem key={subsystem + '-' + nodeId + '-' + loglevel} active={subsystem.level === loglevel} onClick={(evt) => { evt.preventDefault(); this._changeLoglevel(loglevel); }}>
          {_this.getLogLevelCN(loglevel)}
        </MenuItem>);
    return (
      <DropdownButton id="loglevel" bsSize="xsmall" title={this.getLogLevelCN(subsystem.level)}>
        {loglevels}
      </DropdownButton>
    );
  },
});

export default LogLevelDropdown;
