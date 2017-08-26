import React from 'react';
import Reflux from 'reflux';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';
import DateTime from 'logic/datetimes/DateTime';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const SystemStore = StoreProvider.getStore('System');

import { Spinner, Timestamp } from 'components/common';

const TimesList = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore), Reflux.connect(SystemStore)],
  getInitialState() {
    return {time: moment()};
  },
  componentDidMount() {
    this.interval = setInterval(() => this.setState(this.getInitialState()), 1000);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  render() {
    if (!this.state.system) {
      return <Spinner />;
    }
    const time = this.state.time;
    const timeFormat = DateTime.Formats.DATETIME_TZ;
    const currentUser = this.state.currentUser;
    const serverTimezone = this.state.system.timezone;
    return (
      <Row className="content">
        <Col md={12}>
          <h2><i className="fa fa-clock-o"/>时区配置</h2>

          <p className="description">
			处理时区问题可能会产生一些困扰。此处您可以了解您的系统中不同的组件所应用的不同的时区。你可以在指定的DeepLOG服务区节点的相关详细页面查看对应时区的设置。
          </p>

          <dl className="system-time">
            <dt>用户 <em>{currentUser.username}</em>:</dt>
            <dd><Timestamp dateTime={time} format={timeFormat}/></dd>
            <dt>您的浏览器:</dt>
            <dd><Timestamp dateTime={time} format={timeFormat} tz={'browser'}/></dd>
            <dt>DeepLOG服务器:</dt>
            <dd><Timestamp dateTime={time} format={timeFormat} tz={serverTimezone}/></dd>
          </dl>
        </Col>
      </Row>
    );
  },
});

export default TimesList;
