import React from 'react';
import Reflux from 'reflux';
import { Alert, Col, Row } from 'react-bootstrap';
import numeral from 'numeral';

import ActionsProvider from 'injection/ActionsProvider';
const IndexerOverviewActions = ActionsProvider.getActions('IndexerOverview');
const IndicesActions = ActionsProvider.getActions('Indices');

import StoreProvider from 'injection/StoreProvider';
const IndexerOverviewStore = StoreProvider.getStore('IndexerOverview');
const IndicesStore = StoreProvider.getStore('Indices');

import DocsHelper from 'util/DocsHelper';
import { PageHeader, Spinner } from 'components/common';
import { DocumentationLink } from 'components/support';
import { IndexerClusterHealthSummary } from 'components/indexers';
import { IndicesMaintenanceDropdown, IndicesOverview } from 'components/indices';
import IndicesConfiguration from 'components/indices/IndicesConfiguration';

const IndicesPage = React.createClass({
  mixins: [
    Reflux.connect(IndicesStore, 'indexDetails'),
    Reflux.connect(IndexerOverviewStore),
  ],
  componentDidMount() {
    IndicesActions.list();
    this.timerId = setInterval(() => {
      IndicesActions.multiple();
      IndexerOverviewActions.list();
    }, this.REFRESH_INTERVAL);
  },
  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  },
  REFRESH_INTERVAL: 2000,
  _totalIndexCount() {
    return (Object.keys(this.state.indexerOverview.indices).length + this.state.indexDetails.closedIndices.length);
  },
  render() {
    if (!this.state.indexerOverview || !this.state.indexDetails.closedIndices) {
      return <Spinner />;
    }
    const deflectorInfo = this.state.indexerOverview.deflector;
    return (
      <span>
        <PageHeader title="索引">
          <span>
            这是目前DeepLOG正在考虑为搜索和分析的所有指标（消息存储）的概述。
          </span>

          <span>

          </span>

          <IndicesMaintenanceDropdown />
        </PageHeader>

        <Row className="content">
          <Col md={12}>
            <IndicesConfiguration />
          </Col>
        </Row>

        <Row className="content">
          <Col md={12}>
            <Alert bsStyle="success" style={{ marginTop: '10' }}>
              <i className="fa fa-th"/> &nbsp;{this._totalIndexCount()} 指标在全部的 {' '}
              {numeral(this.state.indexerOverview.counts.events).format('0,0')} 条信息处于管理中，
              当前写的活动指标是 <i>{deflectorInfo.current_target}</i>.
            </Alert>
            <IndexerClusterHealthSummary health={this.state.indexerOverview.indexer_cluster.health} />
          </Col>
        </Row>

        <IndicesOverview indices={this.state.indexerOverview.indices}
                         indexDetails={this.state.indexDetails.indices}
                         closedIndices={this.state.indexDetails.closedIndices}
                         deflector={this.state.indexerOverview.deflector}/>
      </span>
    );
  },
});

export default IndicesPage;
