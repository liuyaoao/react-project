import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import { Spinner } from 'components/common';

import ActionsProvider from 'injection/ActionsProvider';
const IndicesActions = ActionsProvider.getActions('Indices');
const IndexRangesActions = ActionsProvider.getActions('IndexRanges');
import StoreProvider from 'injection/StoreProvider';
StoreProvider.getStore('IndexRanges'); // To make IndexRangesActions work.

import { IndexRangeSummary, ShardMeter, ShardRoutingOverview } from 'components/indices';

const IndexDetails = React.createClass({
  propTypes: {
    index: React.PropTypes.object.isRequired,
    indexName: React.PropTypes.string.isRequired,
    indexRange: React.PropTypes.object.isRequired,
    isDeflector: React.PropTypes.bool.isRequired,
  },
  componentDidMount() {
    IndicesActions.subscribe(this.props.indexName);
    //hover时 dropdown显示
    var hoverTimeout;
    $('.dropdown').hover(function() {
        clearTimeout(hoverTimeout);
        $(this).addClass('open');
    }, function() {
        var $self = $(this);
        hoverTimeout = setTimeout(function() {
            $self.removeClass('open');
        }, 50);
    });
  },
  componentWillUnmount() {
    IndicesActions.unsubscribe(this.props.indexName);
  },

  _formatActionButtons() {
    if (this.props.isDeflector) {
      return (
        <span>
          <Button bsStyle="warning" bsSize="xs" disabled>偏转指标不能关闭</Button>{' '}
          <Button bsStyle="danger" bsSize="xs" disabled>偏转指标不能删除</Button>
        </span>
      );
    }

    return (
      <span>
        <Button bsStyle="warning" bsSize="xs" onClick={this._onRecalculateIndex}>重新计算指标范围</Button>{' '}
        <Button bsStyle="warning" bsSize="xs" onClick={this._onCloseIndex}>关闭指标</Button>{' '}
        <Button bsStyle="danger" bsSize="xs" onClick={this._onDeleteIndex}>删除指标</Button>
      </span>
    );
  },
  _onRecalculateIndex() {
    if (window.confirm(`真的要重新计算指标${this.props.indexName}的指数范围吗？`)) {
      IndexRangesActions.recalculateIndex(this.props.indexName);
    }
  },
  _onCloseIndex() {
    if (window.confirm(`真的要关闭指标${this.props.indexName}吗？`)) {
      IndicesActions.close(this.props.indexName);
    }
  },
  _onDeleteIndex() {
    if (window.confirm(`真的要删除指标${this.props.indexName}吗？`)) {
      IndicesActions.delete(this.props.indexName);
    }
  },
  render() {
    if (!this.props.index || !this.props.index.all_shards) {
      return <Spinner />;
    }
    const { index, indexRange, indexName } = this.props;
    return (
      <div className="index-info">
        <IndexRangeSummary indexRange={indexRange} />{' '}

        {index.all_shards.segments} 段，{' '}
        {index.all_shards.open_search_contexts} 打开搜索上下文，{' '}
        {index.all_shards.documents.deleted} 删除信息

        <Row style={{ marginBottom: '10' }}>
          <Col md={4} className="shard-meters">
            <ShardMeter title="初级碎片操作" shardMeter={index.primary_shards} />
          </Col>
          <Col md={4} className="shard-meters">
            <ShardMeter title="总碎片操作" shardMeter={index.all_shards} />
          </Col>
        </Row>

        <ShardRoutingOverview routing={index.routing} indexName={indexName} />

        <hr style={{ marginBottom: '5', marginTop: '10' }}/>

        {this._formatActionButtons()}
      </div>
    );
  },
});

export default IndexDetails;
