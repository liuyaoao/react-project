import React from 'react';
import numeral from 'numeral';

const SizeBasedRotationStrategySummary = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
  },

  render() {
    return (
      <div>
        <dl className="deflist">
          <dt>指数轮换策略:</dt>
          <dd>索引的大小</dd>
          <dt>最大的索引大小:</dt>
          <dd>{this.props.config.max_size} bytes ({numeral(this.props.config.max_size).format('0.0b')})</dd>
        </dl>
      </div>
    );
  },
});

export default SizeBasedRotationStrategySummary;
