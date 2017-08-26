import React from 'react';
import numeral from 'numeral';

const HistogramDetails = React.createClass({
  propTypes: {
    metric: React.PropTypes.object.isRequired,
  },
  render() {
    const histogram = this.props.metric.metric;
    return (
      <dl className="metric-def metric-histogram">
        <dt>第95个百分位：</dt>
        <dd><span className="number-format">{numeral(histogram.time['95th_percentile']).format('0,0.[00]')}</span></dd>
        <dt>第98个百分位：</dt>
        <dd><span className="number-format">{numeral(histogram.time['98th_percentile']).format('0,0.[00]')}</span></dd>
        <dt>第99个百分位：</dt>
        <dd><span className="number-format">{numeral(histogram.time['99th_percentile']).format('0,0.[00]')}</span></dd>
        <dt>标准偏差：</dt>
        <dd><span className="number-format">{numeral(histogram.time.std_dev).format('0,0.[00]')}</span></dd>
        <dt>平均值：</dt>
        <dd><span className="number-format">{numeral(histogram.time.mean).format('0,0.[00]')}</span></dd>
        <dt>最小值：</dt>
        <dd><span className="number-format">{numeral(histogram.time.min).format('0,0.[00]')}</span></dd>
        <dt>最大值：</dt>
        <dd><span className="number-format">{numeral(histogram.time.max).format('0,0.[00]')}</span></dd>
        <dt>共计：</dt>
        <dd><span className="number-format">{numeral(histogram.count).format('0,0')}</span></dd>
      </dl>
    );
  },
});

export default HistogramDetails;
