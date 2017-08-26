import React, { PropTypes } from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux'

import CreateStreamButton from 'components/streams/CreateStreamButton';
import StreamComponent from 'components/streams/StreamComponent';
import DocumentationLink from 'components/support/DocumentationLink';
import PageHeader from 'components/common/PageHeader';
import { IfPermitted, Spinner } from 'components/common';

import DocsHelper from 'util/DocsHelper';
import UserNotification from 'util/UserNotification';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const StreamsStore = StoreProvider.getStore('Streams');

import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Routes from 'routing/Routes';

import * as networkAction from '../itoss/actions/networkTopology_action';

const StreamsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  _isLoading() {
    return !this.state.currentUser;
  },
  _onSave(_, stream) {
    StreamsStore.save(stream, () => {
      UserNotification.success('消息流已被成功创建。', '成功');
    });
  },
  _onRealTimeStream() {
    const { dispatch } = this.props;
    dispatch(networkAction.set_streamId(""));
  },
  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }
    return (
      <div>
        <PageHeader title="消息流">
          <span>你可以将传入的消息路由到消息流中并通过规则来分类它们。 如果一个消息匹配它被路由到的那个消息流的所有规则，那么它可以被路由到复数的流。
            举个例子，你可以新建一个包含所有SSH登录和配置每当有比平常更多登录时就报警的消息流。</span>
          <span>

          </span>


          <span>
            <LinkContainer to={Routes.REALTIMESTREAMS} style={{marginRight:"5px"}}>
              <Button bsSize="large" bsStyle="success" onClick={this._onRealTimeStream}>实时消息</Button>
            </LinkContainer>
            <IfPermitted permissions="streams:create">
              <CreateStreamButton ref="createStreamButton" bsSize="large" bsStyle="success" onSave={this._onSave} />
            </IfPermitted>
          </span>
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <StreamComponent currentUser={this.state.currentUser} onStreamSave={this._onSave}/>
          </Col>
        </Row>
      </div>
    );
    // return (
    //   <div>
    //     <PageHeader title="Streams">
    //       <span>You can route incoming messages into streams by applying rules against them. If a
    //         message
    //         matches all rules of a stream it is routed into it. A message can be routed into
    //         multiple
    //         streams. You can for example create a stream that contains all SSH logins and configure
    //         to be alerted whenever there are more logins than usual.
    //
    //         Read more about streams in the <DocumentationLink page={DocsHelper.PAGES.STREAMS} text="documentation"/>.</span>
    //
    //       <span>
    //         Take a look at the
    //         {' '}<DocumentationLink page={DocsHelper.PAGES.EXTERNAL_DASHBOARDS} text="DeepLOG stream dashboards"/>{' '}
    //         for wall-mounted displays or other integrations.
    //       </span>
    //
    //       <IfPermitted permissions="streams:create">
    //         <CreateStreamButton ref="createStreamButton" bsSize="large" bsStyle="success" onSave={this._onSave} />
    //       </IfPermitted>
    //     </PageHeader>
    //
    //     <Row className="content">
    //       <Col md={12}>
    //         <StreamComponent currentUser={this.state.currentUser} onStreamSave={this._onSave}/>
    //       </Col>
    //     </Row>
    //   </div>
    // );
  },
});

// export default StreamsPage;
StreamsPage.propTypes = {
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  // const { streamId } = state.networkTopologyReducer

  return {
    // streamId
  }
}

export default connect(mapStateToProps)(StreamsPage)
