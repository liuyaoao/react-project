import React, {PropTypes} from 'react';
import {Button, Row, Col, Well} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import numeral from 'numeral';

import EntityListItem from 'components/common/EntityListItem';
import ExtractorUtils from 'util/ExtractorUtils';

import ActionsProvider from 'injection/ActionsProvider';
const ExtractorsActions = ActionsProvider.getActions('Extractors');

import Routes from 'routing/Routes';

const ExtractorsListItem = React.createClass({
  propTypes: {
    extractor: PropTypes.object.isRequired,
    inputId: PropTypes.string.isRequired,
    nodeId: PropTypes.string.isRequired,
  },
  getInitialState() {
    return {
      showDetails: false,
    };
  },
  _toggleDetails() {
    this.setState({showDetails: !this.state.showDetails});
  },
  _deleteExtractor() {
    if (window.confirm(`确定要删除提取器 "${this.props.extractor.title} 吗？`)) {
      ExtractorsActions.delete.triggerPromise(this.props.inputId, this.props.extractor);
    }
  },
  _formatExtractorSubtitle() {
    return (
      <span>
		尝试从<em>{this.props.extractor.source_field}</em>{' '}
        <em>{this.props.extractor.target_field}</em>提取数据，{' '}
        {this.props.extractor.cursor_strategy === 'cut' && '不'}{' '}
        保持数据源完成。
      </span>
    );
  },
  _formatCondition() {
    if (this.props.extractor.condition_type === 'none') {
      return <div></div>;
    }

    return (
      <div className="configuration-section">
        <h4>条件</h4>
        <ul>
          <li>
            将只会当{' '}
            {this.props.extractor.condition_type === 'string' ? '包含字符串' : '匹配正则表达式'}{' '}
            <em>{this.props.extractor.condition_value}</em>
			的时候尝试运行
          </li>
        </ul>
      </div>
    );
  },
  _formatActions() {
    const actions = [];

    actions.push(
      <Button key={`extractor-details-${this.props.extractor.id}`} bsStyle="info" onClick={this._toggleDetails}>
        详情
      </Button>
    );
    actions.push(
      <LinkContainer key={`edit-extractor-${this.props.extractor.id}`}
                     to={Routes.edit_input_extractor(this.props.nodeId, this.props.inputId, this.props.extractor.id)}>
        <Button bsStyle="info">编辑</Button>
      </LinkContainer>
    );
    actions.push(<Button key={`delete-extractor-`} bsStyle="danger" onClick={this._deleteExtractor}>删除</Button>);

    return actions;
  },
  _formatOptions(options) {
    const attributes = Object.keys(options);
    return attributes.map(attribute => {
      return <li key={`${attribute}-${this.props.extractor.id}`}>{attribute}: {options[attribute]}</li>;
    });
  },
  _formatConfiguration(extractorConfig) {
    let formattedOptions = this._formatOptions(extractorConfig);
    if (formattedOptions.length === 0) {
      formattedOptions = <li>没有配置选项</li>;
    }

    return (
      <div className="configuration-section">
        <h4>配置</h4>
        <ul>
          {formattedOptions}
        </ul>
      </div>
    );
  },
  _formatConverter(key, converter) {
    return (
      <li key={`converter-${key}`}>
        {converter.type}
        {converter.config && <ul>{this._formatOptions(converter.config)}</ul>}
      </li>
    );
  },
  _formatConverters(converters) {
    const converterKeys = Object.keys(converters);
    const formattedConverters = converterKeys.map(converterKey => this._formatConverter(converterKey, converters[converterKey]));
    if (formattedConverters.length === 0) {
      return <div></div>;
    }

    return (
      <div className="configuration-section">
        <h4>转换器</h4>
        <ul>
          {formattedConverters}
        </ul>
      </div>
    );
  },
  _formatTimingMetrics(timing) {
    return (
      <dl className="metric-def metric-timer">
        <dt>第95个百分位：</dt>
        <dd>{numeral(timing['95th_percentile']).format('0,0.[00]')}&#956;s</dd>

        <dt>第8个百分位：</dt>
        <dd>{numeral(timing['98th_percentile']).format('0,0.[00]')}&#956;s</dd>

        <dt>第99个百分位：</dt>
        <dd>{numeral(timing['99th_percentile']).format('0,0.[00]')}&#956;s</dd>

        <dt>标准偏差：</dt>
        <dd>{numeral(timing.std_dev).format('0,0.[00]')}&#956;s</dd>

        <dt>平均值：</dt>
        <dd>{numeral(timing.mean).format('0,0.[00]')}&#956;s</dd>

        <dt>最小值：</dt>
        <dd>{numeral(timing.min).format('0,0.[00]')}&#956;s</dd>

        <dt>最大值：</dt>
        <dd>{numeral(timing.max).format('0,0.[00]')}&#956;s</dd>
      </dl>
    );
  },
  _formatMetrics(metrics) {
    let totalRate;
    if (metrics.total.rate) {
      totalRate = (
        <div className="meter" style={{marginBottom: 10}}>
          自启动以来共有 {numeral(metrics.total.rate.total).format('0,0')} 次调用，{' '}
          平均值为：{' '}
          {numeral(metrics.total.rate.one_minute).format('0,0.[00]')},{' '}
          {numeral(metrics.total.rate.five_minute).format('0,0.[00]')},{' '}
          {numeral(metrics.total.rate.fifteen_minute).format('0,0.[00]')}.
        </div>
      );
    }

    let totalTime;
    if (metrics.total.time) {
      totalTime = this._formatTimingMetrics(metrics.total.time);
    } else {
      totalTime = '还没有消息通过此处。';
    }

    let convertersTime;
    if (metrics.converters.time) {
      convertersTime = this._formatTimingMetrics(metrics.converters.time);
    } else {
      convertersTime = '还没有消息通过此处。';
    }

    return (
      <div>
        {totalRate}
        <Row>
          <Col md={6}>
            <h3 style={{display: 'inline'}}>总时间</h3><br />
            {totalTime}
          </Col>

          <Col md={6}>
            <h3 style={{display: 'inline'}}>转化器时间</h3><br />
            {convertersTime}
          </Col>
        </Row>
      </div>
    );
  },
  _formatDetails() {
    return (
      <div>
        <Col md={8}>
          <Well bsSize="small" className="configuration-well">
            {this._formatCondition()}
            {this._formatConfiguration(this.props.extractor.extractor_config)}
            {this._formatConverters(this.props.extractor.converters)}
          </Well>
        </Col>
        <Col md={4}>
          <div className="graylog-input-metrics">
            <h3>程序调用详情</h3>
            {this._formatMetrics(this.props.extractor.metrics)}
          </div>
        </Col>
      </div>
    );
  },
  render() {
    return (
      <EntityListItem key={`entry-list-${this.props.extractor.id}`}
                      title={this.props.extractor.title}
                      titleSuffix={ExtractorUtils.getReadableExtractorTypeName(this.props.extractor.type)}
                      description={this._formatExtractorSubtitle()}
                      actions={this._formatActions()}
                      contentRow={this.state.showDetails ? this._formatDetails() : null} />
    );
  },
});

export default ExtractorsListItem;
