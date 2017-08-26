import React from 'react';
import Reflux from 'reflux';
import { Alert, Row, Col } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const NotificationsStore = StoreProvider.getStore('Notifications');

import { Spinner } from 'components/common';
import Notification from 'components/notifications/Notification';

const NotificationsList = React.createClass({
  mixins: [Reflux.connect(NotificationsStore)],
  _formatNotificationCount(count) {
    if (count === 0) {
      return '无系统通知信息';
    }
    if (count === 1) {
      return '有一个系统通知信息';
    }

    return '有 ' + count + ' 个系统通知信息';

  },
  render() {
    if (!this.state.notifications) {
      return <Spinner />;
    }

    const count = this.state.total;

    let title;
    let content;

    if (count === 0) {
      title = '无系统通知信息';
      content = (
        <Alert bsStyle="success" className="notifications-none">
          <i className="fa fa-check-circle"/>{' '}
          &nbsp;无系统通知信息
        </Alert>
      );
    } else {
      title = `${this._formatNotificationCount(count)}`;
      content = this.state.notifications.map((notification) => {
        return <Notification key={`${notification.type}-${notification.timestamp}`} notification={notification} />;
      });
    }

    return (
      <Row className="content">
        <Col md={12}>
          <h2>{title}</h2>
          <p className="description">
			系统通知信息是由DeepLOG触发的，展示了您应该对应执行的状况。如果您需要更多的信息和帮助，很多系统信息类型都会提供DeepLOG文档的链接。
          </p>

          {content}
        </Col>
      </Row>
    );
  },
});

export default NotificationsList;
