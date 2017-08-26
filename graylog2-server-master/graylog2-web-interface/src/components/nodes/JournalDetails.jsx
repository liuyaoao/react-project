import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import { LinkContainer } from 'react-router-bootstrap';
import { ProgressBar, Row, Col, Alert } from 'react-bootstrap';
import numeral from 'numeral';
import moment from 'moment';
import {} from 'moment-duration-format';

import MetricsExtractor from 'logic/metrics/MetricsExtractor';

import ActionsProvider from 'injection/ActionsProvider';
const MetricsActions = ActionsProvider.getActions('Metrics');

import StoreProvider from 'injection/StoreProvider';
const MetricsStore = StoreProvider.getStore('Metrics');
const JournalStore = StoreProvider.getStore('Journal');

import { Spinner, Timestamp } from 'components/common';

import NumberUtils from 'util/NumberUtils';
import Routes from 'routing/Routes';

const JournalDetails = React.createClass({
  propTypes: {
    nodeId: PropTypes.string.isRequired,
  },
  mixins: [Reflux.connect(MetricsStore)],

  getInitialState() {
    return {
      journalInformation: undefined,
    };
  },

  componentDidMount() {
    JournalStore.get(this.props.nodeId).then(journalInformation => {
      this.setState({journalInformation: journalInformation}, this._listenToMetrics);
    });
  },

  componentWillUnmount() {
    if (this.metricNames) {
      Object.keys(this.metricNames).forEach(metricShortName => MetricsActions.remove(this.props.nodeId, this.metricNames[metricShortName]));
    }
  },

  _listenToMetrics() {
    // only listen for updates if the journal is actually turned on
    if (this.state.journalInformation.enabled) {
      this.metricNames = {
        append: 'org.graylog2.journal.append.1-sec-rate',
        read: 'org.graylog2.journal.read.1-sec-rate',
        segments: 'org.graylog2.journal.segments',
        entriesUncommitted: 'org.graylog2.journal.entries-uncommitted',
        utilizationRatio: 'org.graylog2.journal.utilization-ratio',
        oldestSegment: 'org.graylog2.journal.oldest-segment',
      };
      Object.keys(this.metricNames).forEach(metricShortName => MetricsActions.add(this.props.nodeId, this.metricNames[metricShortName]));
    }
  },

  _isLoading() {
    return !(this.state.metrics && this.state.journalInformation);
  },

  render() {
    if (this._isLoading()) {
      return <Spinner text="加载日志诊断..."/>;
    }

    const nodeId = this.props.nodeId;
    const nodeMetrics = this.state.metrics[nodeId];
    const journalInformation = this.state.journalInformation;

    if (!journalInformation.enabled) {
      return (
        <Alert bsStyle="warning">
          <i className="fa fa-exclamation-triangle"/>&nbsp; 此节点的硬盘日志被禁用了。
        </Alert>
      );
    }

    const metrics = this.metricNames ? MetricsExtractor.getValuesForNode(nodeMetrics, this.metricNames) : {};

    if (Object.keys(metrics).length === 0) {
      return (
        <Alert bsStyle="warning">
          <i className="fa fa-exclamation-triangle"/>&nbsp; 日志诊断不可用。
        </Alert>
      );
    }

    const oldestSegment = moment(metrics.oldestSegment);
    let overcommittedWarning;
    if (metrics.utilizationRatio >= 1) {
      overcommittedWarning = (
        <span>
          <strong>Warning!</strong> 日志使用率超过了定义的最大值。
          {' '}<LinkContainer to={Routes.SYSTEM.OVERVIEW}><a>点击此处</a></LinkContainer> 获取更多信息。<br/>
        </span>
      );
    }

    return (
      <Row className="row-sm">
        <Col md={6}>
          <h3>配置</h3>
          <dl className="system-journal">
            <dt>路径:</dt>
            <dd>{journalInformation.journal_config.directory}</dd>
            <dt>最早进入:</dt>
            <dd><Timestamp dateTime={oldestSegment} relative/></dd>
            <dt>最大空间:</dt>
            <dd>{numeral(journalInformation.journal_config.max_size).format('0,0 b')}</dd>
            <dt>最大年龄:</dt>
            <dd>{moment.duration(journalInformation.journal_config.max_age).format('d [天] h [小时] m [分]')}</dd>
            <dt>清洗策略:</dt>
            <dd>
              每 {numeral(journalInformation.journal_config.flush_interval).format('0,0')} 个消息
              {' '}或 {moment.duration(journalInformation.journal_config.flush_age).format('h [小时] m [分] s [秒]')}
            </dd>
          </dl>
        </Col>
        <Col md={6} className="journal-details-usage">
          <h3>使用率</h3>

          <ProgressBar now={metrics.utilizationRatio * 100}
                       label={NumberUtils.formatPercentage(metrics.utilizationRatio)}/>

          {overcommittedWarning}

          <strong>日志包含{numeral(metrics.entriesUncommitted).format('0,0')} 个未执行的消息</strong>
          {' '} 于 {metrics.segments} 个部分.<br/>
          <strong>{numeral(metrics.append).format('0,0')} 个消息</strong>
          {' '}被扩展，{' '}
          <strong>{numeral(metrics.read).format('0,0')} 个消息</strong> 被读取于最近几秒内。
        </Col>
      </Row>
    );
  },
});

export default JournalDetails;
