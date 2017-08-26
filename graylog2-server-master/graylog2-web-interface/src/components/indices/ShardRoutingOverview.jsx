import React from 'react';

import { ShardRouting } from 'components/indices';
import naturalSort from 'javascript-natural-sort';

const ShardRoutingOverview = React.createClass({
  propTypes: {
    routing: React.PropTypes.array.isRequired,
    indexName: React.PropTypes.string.isRequired,
  },
  render() {
    const { indexName, routing } = this.props;
    return (
      <div className="shard-routing">
        <h3>碎片的路由</h3>

        <ul className="shards">
          {routing
            .sort((shard1, shard2) => naturalSort(shard1.id, shard2.id))
            .map((route) => <ShardRouting key={indexName + '-shard-route-' +route.node_id + "-" + route.id} route={route}/>)}
        </ul>

        <br style={{clear: 'both'}} />

        <div className="description">
          加粗的碎片是主要的，其他的是副本。副本被选为主要的时自动选离集群。大小和文件数量只反映主要的碎片和不可替换的副本。
        </div>
      </div>
    );
  },
});

export default ShardRoutingOverview;
