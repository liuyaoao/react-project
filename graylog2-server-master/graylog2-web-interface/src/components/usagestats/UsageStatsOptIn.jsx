'use strict';

import React from 'react';
import { Alert, Button, Row, Col } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const UsageStatsOptOutStore = StoreProvider.getStore('UsageStatsOptOut');

const UsageStatsOptIn = React.createClass({
  getInitialState() {
    return {
      optOutStateLoaded: false,
      optOutState: null,
      pluginEnabled: false
    };
  },
  componentDidMount() {
    UsageStatsOptOutStore.pluginEnabled().done((isEnabled) => {
      this.setState({pluginEnabled: isEnabled});
    });

    UsageStatsOptOutStore.getOptOutState().done((optOutState) => {
      this.setState({optOutStateLoaded: true, optOutState: optOutState});
    });
  },
  _handleClickEnable() {
    UsageStatsOptOutStore.setOptIn(false);
    this.setState({optOutState: {opt_out: false}});
  },
  _handleClickDisable() {
    UsageStatsOptOutStore.setOptOut(false);
    this.setState({optOutState: {opt_out: true}});
  },
  render() {
    var content = null;

    if (this.state.optOutStateLoaded && this.state.pluginEnabled === true) {
      var form = null;

      if (this.state.optOutState !== null && this.state.optOutState.opt_out === true) {
        form = (
          <span>
            <i className="fa fa-info-circle"></i>
            &nbsp;
			您已<strong>禁用了</strong>向DeepLOG发送匿名流量统计的功能。为了能让DeepLOG更好地为您工作，请将其打开以让它能够发送任何匿名统计信息给DeepLOG。
            <Button bsSize="xsmall" bsStyle="success" className="pull-right" onClick={this._handleClickEnable}>启用</Button>
          </span>
        );
      } else {
        form = (
          <span>
            <i className="fa fa-info-circle"></i>
            &nbsp;
			您已<strong>启用了</strong>向DeepLOG发送匿名流量统计的功能。谢谢您！用户统计能让DeepLOG更好地工作。如果您想取消这个功能，请点击"禁用"
            <Button bsSize="xsmall" bsStyle="info" className="pull-right" onClick={this._handleClickDisable}>禁用</Button>
          </span>
        );
      }

      content = (
        <Row className="content">
          <Col md={12}>
            <h2><i className="fa fa-bar-chart"></i>匿名流量统计</h2>
            <Alert bsStyle="info">
              {form}
            </Alert>
          </Col>
        </Row>
      );
    }

    return content;
  }
});

module.exports = UsageStatsOptIn;
