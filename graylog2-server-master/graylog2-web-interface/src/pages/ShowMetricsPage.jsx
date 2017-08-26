import React, {PropTypes} from 'react';
import Reflux from 'reflux';

import StoreProvider from 'injection/StoreProvider';
const NodesStore = StoreProvider.getStore('Nodes');
const MetricsStore = StoreProvider.getStore('Metrics');

import ActionsProvider from 'injection/ActionsProvider';
const MetricsActions = ActionsProvider.getActions('Metrics');

import { PageHeader, Spinner } from 'components/common';
import { MetricsComponent } from 'components/metrics';

const ShowMetricsPage = React.createClass({
  propTypes: {
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(MetricsStore), Reflux.connect(NodesStore)],
  componentDidMount() {
    MetricsActions.names();
  },
  render() {
    if (!this.state.nodes || !this.state.metricsNames) {
      return <Spinner />;
    }

    let nodeId = this.props.params.nodeId;
    // "master" node ID is a placeholder for master node, get first master node ID
    if (nodeId === 'master') {
      const nodeIDs = Object.keys(this.state.nodes);
      const masterNodes = nodeIDs.filter(nodeID => this.state.nodes[nodeID].is_master);
      nodeId = masterNodes[0] || nodeIDs[0];
    }

    const node = this.state.nodes[nodeId];
    const title = <span>节点 {node.short_node_id} / {node.hostname} 的程序调用详情</span>;
    const namespace = MetricsStore.namespace;
    const names = this.state.metricsNames[nodeId];
    const filter = this.props.location.query.filter;
    return (
      <span>
        <PageHeader title={title}>
          <span>
			所有DeepLOG的节点都提供了内部的程序调用详情用于诊断，修复和监测。您同样可以通过JMX进入所有的程序调用详情。
          </span>
          <span>这个节点总共报告了 {names.length} 个程序调用详情</span>
        </PageHeader>

        <MetricsComponent names={names} namespace={namespace} nodeId={nodeId} filter={filter} />
      </span>
    );
  },
});

export default ShowMetricsPage;
