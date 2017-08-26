import React from 'react';

const BacklogSummary = React.createClass({
  propTypes: {
    alertCondition: React.PropTypes.object.isRequired,
  },
  _formatMessageCount(count) {
    if (count === 0) {
      return '不包括任何消息';
    }

    if (count === 1) {
      return '包括最后的一条消息';
    }

    return '包括最后的' + count + '条消息';
  },
  render() {
    const backlog = this.props.alertCondition.parameters.backlog;
    return (
      <span>{this._formatMessageCount(backlog)}在警报通知。</span>
    );
  },
});

export default BacklogSummary;
