import React, {PropTypes} from 'react';
import Reflux from 'reflux';

import StoreProvider from 'injection/StoreProvider';
const NodesStore = StoreProvider.getStore('Nodes');
const ClusterOverviewStore = StoreProvider.getStore('ClusterOverview');
const PluginsStore = StoreProvider.getStore('Plugins');
const InputStatesStore = StoreProvider.getStore('InputStates');
const InputTypesStore = StoreProvider.getStore('InputTypes');

import { NodeMaintenanceDropdown, NodeOverview } from 'components/nodes';
import { PageHeader, Spinner } from 'components/common';

function nodeFilter(state) {
  return state.nodes ? state.nodes[this.props.params.nodeId] : state.nodes;
}

function clusterOverviewFilter(state) {
  return state.clusterOverview ? state.clusterOverview[this.props.params.nodeId] : undefined;
}

const ShowNodePage = React.createClass({
  propTypes: {
    params: PropTypes.object.isRequired,
  },
  mixins: [
    Reflux.connectFilter(NodesStore, 'node', nodeFilter),
    Reflux.connectFilter(ClusterOverviewStore, 'systemOverview', clusterOverviewFilter),
    Reflux.connect(InputTypesStore),
  ],
  getInitialState() {
    return {
      jvmInformation: undefined,
      plugins: undefined,
    };
  },
  componentWillMount() {
    ClusterOverviewStore.jvm(this.props.params.nodeId)
      .then(jvmInformation => this.setState({jvmInformation: jvmInformation}));
    PluginsStore.list(this.props.params.nodeId).then(plugins => this.setState({plugins: plugins}));
    InputStatesStore.list().then(inputStates => {
      // We only want the input states for the current node
      const inputIds = Object.keys(inputStates);
      const filteredInputStates = [];
      inputIds.forEach(inputId => {
        const inputObject = inputStates[inputId][this.props.params.nodeId];
        if (inputObject) {
          filteredInputStates.push(inputObject);
        }
      });

      this.setState({inputStates: filteredInputStates});
    });
  },
  _isLoading() {
    return !(this.state.node && this.state.systemOverview);
  },
  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }
    const node = this.state.node;
    const title = <span>节点 {node.short_node_id} / {node.hostname}</span>;

    return (
      <div>
        <PageHeader title={title}>
          <span>
            这个页面展示了一个被激活并且可使用的DeepLOG服务器节点的详细信息
          </span>
          <span>
            {node.is_master ? <span>这是管理者节点。</span> : <span>这<em>不是</em>管理者节点。</span>}
          </span>
          <span><NodeMaintenanceDropdown node={node}/></span>
        </PageHeader>
        <NodeOverview node={node} systemOverview={this.state.systemOverview}
                      jvmInformation={this.state.jvmInformation} plugins={this.state.plugins}
                      inputStates={this.state.inputStates} inputDescriptions={this.state.inputDescriptions}/>
      </div>
    );
  },
});

export default ShowNodePage;
