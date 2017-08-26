import React from 'react';
import { Alert } from 'react-bootstrap';

import { DocumentationLink } from 'components/support';
import DocsHelper from 'util/DocsHelper';

const IndexerClusterHealthSummary = React.createClass({
  propTypes: {
    health: React.PropTypes.object.isRequired,
  },
  _alertClassForHealth(health) {
    switch (health.status) {
      case 'green': return 'success';
      case 'yellow': return 'warning';
      case 'red': return 'danger';
      default: return 'success';
    }
  },
  _formatTextForHealth(health) {
	var color = "";
    switch (health.status) {
      case 'green': color="绿色的";break;
      case 'yellow': color="黄色的";break;
      case 'red': color="红色的";break;
    }
    const text = 'Elasticsearch集群是' + color + '.';
    switch (health.status) {
      case 'green': return text;
      case 'yellow':
      case 'red': return <strong>{text}</strong>;
      default: return text;
    }
  },
  _iconNameForHealth(health) {
    switch (health.status) {
      case 'green': return 'check-circle';
      case 'yellow': return 'warning';
      case 'red': return 'ambulance';
      default: return 'check-circle';
    }
  },
  render() {
    const { health } = this.props;
    return (
      <Alert bsStyle={this._alertClassForHealth(health)} className="es-cluster-status">
        <i className={'fa fa-' + this._iconNameForHealth(health)}/> &nbsp;{this._formatTextForHealth(health)}{' '}
        分片:{' '}
        {health.shards.active} 个激活,{' '}
        {health.shards.initializing} 个初始化,{' '}
        {health.shards.relocating} 个重新定位,{' '}
        {health.shards.unassigned} 个未被分配
      </Alert>
    );
  },
});

export default IndexerClusterHealthSummary;
