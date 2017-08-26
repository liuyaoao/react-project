import React from 'react';
import Reflux from 'reflux';
import { Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const StreamsStore = StoreProvider.getStore('Streams');

import OutputsComponent from 'components/outputs/OutputsComponent';
import SupportLink from 'components/support/SupportLink';
import Spinner from 'components/common/Spinner';
import Routes from 'routing/Routes';

const StreamOutputsPage = React.createClass({
  mixins: [Reflux.connect(CurrentUserStore)],
  getInitialState() {
    return {stream: undefined};
  },
  componentDidMount() {
    StreamsStore.get(this.props.params.streamId, (stream) => {
      this.setState({stream: stream});
    });
  },
  render() {
    if (!this.state.stream) {
      return <Spinner />;
    }
    return (
      <div>
        <Row className="content content-head">
          <Col md={10}>
            <h1>
              消息流输出内容 &raquo;{this.state.stream.title}&laquo;
            </h1>

            <p className="description">
              DeepLOG节点可以通过输出消息流转发信息。你可以启动或者停止任意多的输出。
              您还可以重用已在其他流中运行的输出。

              全局视图可用的所有配置的输出请参考<a href="@routes.OutputsController.index()">此处</a>。

            </p>

            <SupportLink>
              从这个消息流中<i>删除</i>一个输出，但它仍然会在可用的输出列表中。
              <i>全局性的</i>删除一个输出，那么将会从这个和其他所有的消息流中删除并终止它。
              您可以在{' '} <LinkContainer to={Routes.SYSTEM.OUTPUTS}><a>全局输出列表</a></LinkContainer>中看到所有已定义的输出。
            </SupportLink>
          </Col>
        </Row>
        <OutputsComponent streamId={this.state.stream.id} permissions={this.state.currentUser.permissions}/>
      </div>

    );
  }
});

export default StreamOutputsPage;
