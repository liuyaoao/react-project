import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import numeral from 'numeral';

import { Pluralize, Spinner } from 'components/common';

import MetricsExtractor from 'logic/metrics/MetricsExtractor';

import StoreProvider from 'injection/StoreProvider';
const MetricsStore = StoreProvider.getStore('Metrics');

import ActionsProvider from 'injection/ActionsProvider';
const MetricsActions = ActionsProvider.getActions('Metrics');

const JournalState = React.createClass({
  propTypes: {
    nodeId: PropTypes.string.isRequired,
  },
  mixins: [Reflux.connect(MetricsStore)],
  componentWillMount() {
    this.metricNames = {
      append: 'org.graylog2.journal.append.1-sec-rate',
      read: 'org.graylog2.journal.read.1-sec-rate',
      segments: 'org.graylog2.journal.segments',
      entriesUncommitted: 'org.graylog2.journal.entries-uncommitted',
    };
    Object.keys(this.metricNames).forEach(metricShortName => MetricsActions.add(this.props.nodeId, this.metricNames[metricShortName]));
  },
  componentWillUnmount() {
    Object.keys(this.metricNames).forEach(metricShortName => MetricsActions.remove(this.props.nodeId, this.metricNames[metricShortName]));
  },
  _isLoading() {
    return !this.state.metrics;
  },
  render() {
    if (this._isLoading()) {
      return <Spinner text="加载日志诊断信息..."/>;
    }

    const nodeId = this.props.nodeId;
    const nodeMetrics = this.state.metrics[nodeId];
    const metrics = MetricsExtractor.getValuesForNode(nodeMetrics, this.metricNames);

    if (Object.keys(metrics).length === 0) {
      return <span>日志诊断信息不可用</span>;
    }

    return (
      <span>
        日志包含 <strong>{numeral(metrics.entriesUncommitted).format('0,0')} 个未执行的消息</strong> 于 {metrics.segments}
        {' '}个部分.{' '}
        <strong>{numeral(metrics.append).format('0,0')} 个消息</strong> 被扩展, <strong>
        {numeral(metrics.read).format('0,0')} 个消息</strong> 被读取于最近几秒内。
      </span>
    );
  },
});

export default JournalState;
