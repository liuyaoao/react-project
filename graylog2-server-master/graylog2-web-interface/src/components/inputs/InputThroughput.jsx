import React from 'react';
import Reflux from 'reflux';
import numeral from 'numeral';

import StoreProvider from 'injection/StoreProvider';
const MetricsStore = StoreProvider.getStore('Metrics');

import ActionsProvider from 'injection/ActionsProvider';
const MetricsActions = ActionsProvider.getActions('Metrics');

import { LinkToNode, Spinner } from 'components/common';

const InputThroughput = React.createClass({
  propTypes: {
    input: React.PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(MetricsStore)],
  getInitialState() {
    return {
      showDetails: false,
    };
  },
  componentWillMount() {
    this._metricNames().forEach(metricName => MetricsActions.addGlobal(metricName));
  },
  componentWillUnmount() {
    this._metricNames().forEach(metricName => MetricsActions.removeGlobal(metricName));
  },
  _metricNames() {
    return [
      this._prefix('incomingMessages'),
      this._prefix('emptyMessages'),
      this._prefix('open_connections'),
      this._prefix('total_connections'),
      this._prefix('written_bytes_1sec'),
      this._prefix('written_bytes_total'),
      this._prefix('read_bytes_1sec'),
      this._prefix('read_bytes_total'),
    ];
  },
  _prefix(metric) {
    const input = this.props.input;
    return input.type + '.' + input.id + '.' + metric;
  },
  _getValueFromMetric(metric) {
    if (metric === null || metric === undefined) {
      return undefined;
    }

    switch (metric.type) {
      case 'meter':
        return metric.metric.rate.mean;
      case 'gauge':
        return metric.metric.value;
      case 'counter':
        return metric.metric.count;
      default:
        return undefined;
    }
  },
  _calculateMetrics(metrics) {
    const result = {};
    this._metricNames().forEach(metricName => {
      result[metricName] = Object.keys(metrics).reduce((previous, nodeId) => {
        if (!metrics[nodeId][metricName]) {
          return previous;
        }
        const value = this._getValueFromMetric(metrics[nodeId][metricName]);
        if (value !== undefined) {
          return isNaN(previous) ? value : previous + value;
        }
        return previous;
      }, NaN);
    });

    return result;
  },
  _formatCount(count) {
    return numeral(count).format('0,0');
  },
  _formatBytes(bytes) {
    return numeral(bytes).format('0.0b');
  },
  _formatNetworkStats(writtenBytes1Sec, writtenBytesTotal, readBytes1Sec, readBytesTotal) {
    // ugh, is there a way of not doing it globally?
    numeral.zeroFormat('0B');

    const network = (
      <span className="input-io">
        <span>网络进出量: </span>
        <span className="persec">
          <i className="fa fa-caret-down channel-direction channel-direction-down"/>
          <span className="rx value">{this._formatBytes(readBytes1Sec)} </span>

          <i className="fa fa-caret-up channel-direction channel-direction-up"/>
          <span className="tx value">{this._formatBytes(writtenBytes1Sec)}</span>
        </span>

        <span className="total">
          <span> (汇总: </span>
          <i className="fa fa-caret-down channel-direction channel-direction-down"/>
          <span className="rx value">{this._formatBytes(readBytesTotal)} </span>

          <i className="fa fa-caret-up channel-direction channel-direction-up"/>
          <span className="tx value">{this._formatBytes(writtenBytesTotal)}</span>
          <span> )</span>
        </span>
        <br />
      </span>
    );
    // wow this sucks
    numeral.zeroFormat(null);

    return network;
  },
  _formatConnections(openConnections, totalConnections) {
    return (
      <span>
        启动的连接: <span className="active">{this._formatCount(openConnections)} </span>
        (<span className="total">共 {this._formatCount(totalConnections)}</span>)
        <br />
      </span>
    );
  },
  _formatAllNodeDetails(metrics) {
    return (
      <span>
        <hr key="separator"/>
        {Object.keys(metrics).map(nodeId => this._formatNodeDetails(nodeId, metrics[nodeId]))}
      </span>
    );
  },
  _formatNodeDetails(nodeId, metrics) {
    const openConnections = this._getValueFromMetric(metrics[this._prefix('open_connections')]);
    const totalConnections = this._getValueFromMetric(metrics[this._prefix('total_connections')]);
    const emptyMessages = this._getValueFromMetric(metrics[this._prefix('emptyMessages')]);
    const writtenBytes1Sec = this._getValueFromMetric(metrics[this._prefix('written_bytes_1sec')]);
    const writtenBytesTotal = this._getValueFromMetric(metrics[this._prefix('written_bytes_total')]);
    const readBytes1Sec = this._getValueFromMetric(metrics[this._prefix('read_bytes_1sec')]);
    const readBytesTotal = this._getValueFromMetric(metrics[this._prefix('read_bytes_total')]);


    return (
      <span key={this.props.input.id + nodeId}>
        <LinkToNode nodeId={nodeId} />
        <br/>
        {!isNaN(writtenBytes1Sec) && this._formatNetworkStats(writtenBytes1Sec, writtenBytesTotal, readBytes1Sec, readBytesTotal)}
        {!isNaN(openConnections) && this._formatConnections(openConnections, totalConnections)}
        {!isNaN(emptyMessages) && <span>Empty messages discarded: {this._formatCount(emptyMessages)}<br/></span>}
        {isNaN(writtenBytes1Sec) && isNaN(openConnections) && <span>No metrics available for this node</span>}
        <br/>
      </span>
    );
  },
  _toggleShowDetails(evt) {
    evt.preventDefault();
    this.setState({showDetails: !this.state.showDetails});
  },
  render() {
    if (!this.state.metrics) {
      return <Spinner />;
    }
    const metrics = this._calculateMetrics(this.state.metrics);
    const incomingMessages = metrics[this._prefix('incomingMessages')];
    const emptyMessages = metrics[this._prefix('emptyMessages')];
    const openConnections = metrics[this._prefix('open_connections')];
    const totalConnections = metrics[this._prefix('total_connections')];
    const writtenBytes1Sec = metrics[this._prefix('written_bytes_1sec')];
    const writtenBytesTotal = metrics[this._prefix('written_bytes_total')];
    const readBytes1Sec = metrics[this._prefix('read_bytes_1sec')];
    const readBytesTotal = metrics[this._prefix('read_bytes_total')];
    return (
      <div className="graylog-input-metrics">
        <h3>消息吞吐量 / 程序调用详情</h3>
        <span>
          {isNaN(incomingMessages) && isNaN(writtenBytes1Sec) && isNaN(openConnections) && <i>此输入值没有诊断信息</i>}
          {!isNaN(incomingMessages) && <span>1分钟的平均速率: {this._formatCount(incomingMessages)} 个消息每秒<br/></span>}
          {!isNaN(writtenBytes1Sec) && this._formatNetworkStats(writtenBytes1Sec, writtenBytesTotal, readBytes1Sec, readBytesTotal)}
          {!isNaN(openConnections) && this._formatConnections(openConnections, totalConnections)}
          {!isNaN(emptyMessages) && <span>被废弃的空消息: {this._formatCount(emptyMessages)}<br/></span>}
          {!isNaN(writtenBytes1Sec) && this.props.input.global && <a href="" onClick={this._toggleShowDetails}>{this.state.showDetails ? '隐藏' : '显示'} 详情</a>}
          {!isNaN(writtenBytes1Sec) && this.state.showDetails && this._formatAllNodeDetails(this.state.metrics)}
        </span>
      </div>
    );
  },
});

export default InputThroughput;
