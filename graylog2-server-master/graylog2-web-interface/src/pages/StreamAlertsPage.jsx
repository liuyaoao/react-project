import React from 'react';
import Reflux from 'reflux';
import { Row, Col, Button } from 'react-bootstrap';

import DocsHelper from 'util/DocsHelper';
import UserNotification from 'util/UserNotification';

import ActionsProvider from 'injection/ActionsProvider';
const AlertConditionsActions = ActionsProvider.getActions('AlertConditions');

import StoreProvider from 'injection/StoreProvider';
const StreamsStore = StoreProvider.getStore('Streams');
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const AlertConditionsStore = StoreProvider.getStore('AlertConditions');

import { IfPermitted, PageHeader, Spinner } from 'components/common';
import DocumentationLink from 'components/support/DocumentationLink';

import { AlarmCallbackComponent } from 'components/alarmcallbacks';
import AlertsComponent from 'components/alerts/AlertsComponent';
import CreateAlertConditionInput from 'components/alertconditions/CreateAlertConditionInput';
import AlertConditionsList from 'components/alertconditions/AlertConditionsList';
import AlertReceiversList from 'components/alerts/AlertReceiversList';

const StreamAlertsPage = React.createClass({
  propTypes: {
    params: React.PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(CurrentUserStore), Reflux.listenTo(AlertConditionsStore, 'onAlertConditionsList')],
  getInitialState() {
    return {
      stream: undefined,
    };
  },
  componentDidMount() {
    StreamsStore.onChange(this.loadData);
    this.loadData();
  },
  onAlertConditionsList(response) {
    this.setState({alertConditions: response.alertConditions.sort((a1, a2) => a1.id.localeCompare(a2.id))});
  },
  _onSendDummyAlert() {
    const stream = this.state.stream;
    StreamsStore.sendDummyAlert(stream.id).then(() => {
      UserNotification.success('为消息流发送虚拟警报 »' + stream.title + '«', '成功!');
    }, (error) => {
      UserNotification.error('无法为消息流发送虚拟警报 »' + stream.title + '«: ' + error.message,
        '发送虚拟警报失败!');
    });
  },
  loadData() {
    StreamsStore.get(this.props.params.streamId, (stream) => {
      this.setState({stream: stream});
    });

    AlertConditionsActions.list(this.props.params.streamId);
  },
  render() {
    if (!this.state.stream || !this.state.alertConditions) {
      return <Spinner />;
    }
    const stream = this.state.stream;
    return (
      <span>
        <PageHeader title={'用于消息流的警报配置 »' + stream.title + '«'}>
          <span>您可以定义任何消息字段或流的消息计数的阈值，并根据此定义通知警报。</span>
          <span>
            </span>
        </PageHeader>

        <CreateAlertConditionInput streamId={stream.id}/>

        <Row className="content alert-conditions">
          <Col md={12}>
            <h2 style={{marginBottom: '15px'}}>配置报警条件</h2>

            <AlertConditionsList alertConditions={this.state.alertConditions}/>
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <h2>回调</h2>
            <p className="description">
              此消息流触发警报的时候会执行下面的回调。
            </p>

            <AlarmCallbackComponent streamId={stream.id} permissions={this.state.currentUser.permissions} />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <IfPermitted permissions={'streams:edit:' + stream.id}>
              <div className="sendDummyAlert">
                <Button className="pull-right" bsStyle="info" onClick={this._onSendDummyAlert}>发送测试警报</Button>
              </div>
            </IfPermitted>

            <h2>接收机</h2>

            <p className="description">
              以下DeepLOG用户如果已经配置个人资料中的电子邮件地址，那么将会通过电子邮件收到有关通知。如果没有DeepLOG用户关联的接收机，你也可以添加任何其他电子邮件地址到警报。
            </p>

            <AlertReceiversList receivers={stream.alert_receivers} streamId={stream.id}/>

          </Col>
        </Row>

        <AlertsComponent streamId={stream.id} />
      </span>
    );
  },
});

export default StreamAlertsPage;
