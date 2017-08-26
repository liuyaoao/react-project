import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import numeral from 'numeral';

import { Spinner } from 'components/common';

import MetricsExtractor from 'logic/metrics/MetricsExtractor';

import StoreProvider from 'injection/StoreProvider';
const MetricsStore = StoreProvider.getStore('Metrics');

import ActionsProvider from 'injection/ActionsProvider';
const MetricsActions = ActionsProvider.getActions('Metrics');

// TODO this is a copy of GlobalTroughput, it just renders differently and only targets a single node.
const NodeThroughput = React.createClass({
  propTypes: {
    nodeId: PropTypes.string.isRequired,
    longFormat: PropTypes.bool,
  },
  mixins: [Reflux.connect(MetricsStore)],
  getDefaultProps() {
    return {
      longFormat: false,
    };
  },
  componentWillMount() {
    this.metricNames = {
      totalIn: 'org.graylog2.throughput.input.1-sec-rate',
      totalOut: 'org.graylog2.throughput.output.1-sec-rate',
    };

    Object.keys(this.metricNames).forEach(metricShortName => MetricsActions.add(this.props.nodeId, this.metricNames[metricShortName]));
  },
  componentWillUnmount() {
    Object.keys(this.metricNames).forEach(metricShortName => MetricsActions.remove(this.props.nodeId, this.metricNames[metricShortName]));
  },
  _isLoading() {
    return !this.state.metrics;
  },
  _formatThroughput(metrics) {
    if (this.props.longFormat) {
      return (
        <span>
          正在每秒执行 <strong>{numeral(metrics.totalIn).format('0,0')}</strong> 个输入消息和 <strong>
          {numeral(metrics.totalOut).format('0,0')}</strong> 个输出消息。
        </span>
      );
    } else {
      return (
        <span>
          每秒输入 {numeral(metrics.totalIn).format('0,0')} / 输出 {numeral(metrics.totalOut).format('0,0')} 个消息.
        </span>
      );
    }
  },
  render() {
    if (this._isLoading()) {
      return <Spinner text="加载生产量信息..."/>;
    }

    const nodeId = this.props.nodeId;
    const nodeMetrics = this.state.metrics[nodeId];
    const metrics = MetricsExtractor.getValuesForNode(nodeMetrics, this.metricNames);

    if (Object.keys(metrics).length === 0) {
      return (<span>无法加载生产量信息。</span>);
    }

    return this._formatThroughput(metrics);
  },
});

export default NodeThroughput;
