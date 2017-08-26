import React from 'react';

const MessageCountRotationStrategySummary = React.createClass({
  propTypes: {
    config: React.PropTypes.object.isRequired,
  },

  render() {
    return (
      <div>
        <dl className="deflist">
          <dt>指数轮换策略:</dt>
          <dd>消息计数</dd>
          <dt>每个指标的最大文件数:</dt>
          <dd>{this.props.config.max_docs_per_index}</dd>
        </dl>
      </div>
    );
  },
});

export default MessageCountRotationStrategySummary;
