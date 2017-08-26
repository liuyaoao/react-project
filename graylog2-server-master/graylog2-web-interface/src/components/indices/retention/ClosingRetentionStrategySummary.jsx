import React from 'react';

const ClosingRetentionStrategySummary = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
  },

  render() {
    return (
      <div>
        <dl className="deflist">
          <dt>指数保持策略:</dt>
          <dd>关闭</dd>
          <dt>指标的最大值:</dt>
          <dd>{this.props.config.max_number_of_indices}</dd>
        </dl>
      </div>
    );
  },
});

export default ClosingRetentionStrategySummary;
