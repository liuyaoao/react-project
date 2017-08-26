import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import { LinkContainer } from 'react-router-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const NodesStore = StoreProvider.getStore('Nodes');
const CurrentUserStore = StoreProvider.getStore('CurrentUser');
const InputStatesStore = StoreProvider.getStore('InputStates');

import { PageHeader, Spinner } from 'components/common';
import { InputsList } from 'components/inputs';

import Routes from 'routing/Routes';

function nodeFilter(state) {
  return state.nodes ? state.nodes[this.props.params.nodeId] : state.nodes;
}

const NodeInputsPage = React.createClass({
  propTypes: {
    params: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(CurrentUserStore), Reflux.connectFilter(NodesStore, 'node', nodeFilter)],
  componentDidMount() {
    this.interval = setInterval(InputStatesStore.list, 2000);
  },
  componentWillUnmount() {
    clearInterval(this.interval);
  },
  _isLoading() {
    return !this.state.node;
  },
  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }

    const title = <span>节点的输入值 {this.state.node.short_node_id} / {this.state.node.hostname}</span>;

    return (
      <div>
        <PageHeader title={title}>
          <span>DeepLOG节点通过输入值接收数据。此页面可以启动或终止任何您想操作的输入值。</span>

          <span>
            您可以在<LinkContainer to={Routes.SYSTEM.INPUTS}><a>此处</a></LinkContainer>启动和终止集群中的输入值。
          </span>
        </PageHeader>
        <InputsList permissions={this.state.currentUser.permissions} node={this.state.node} />
      </div>
    );
  },
});

export default NodeInputsPage;
