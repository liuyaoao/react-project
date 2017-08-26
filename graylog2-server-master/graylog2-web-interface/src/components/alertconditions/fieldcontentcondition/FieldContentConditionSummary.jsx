import React from 'react';

import GracePeriodSummary from 'components/alertconditions/GracePeriodSummary';
import BacklogSummary from 'components/alertconditions/BacklogSummary';

const FieldContentConditionSummary = React.createClass({
  propTypes: {
    alertCondition: React.PropTypes.object.isRequired,
  },
  _formatMatcher(field, value) {
    return <span>{'<' + field + ':"' + value + '">'}</span>;
  },
  render() {
    const alertCondition = this.props.alertCondition;
    const field = alertCondition.parameters.field;
    const value = alertCondition.parameters.value;

    return (
      <span>
        当接收到的{this._formatMatcher(field, value)}消息匹配时触发警报。
        {' '}
        <GracePeriodSummary alertCondition={alertCondition} />
        {' '}
        <BacklogSummary alertCondition={alertCondition}/>
      </span>
    );
  },
});

export default FieldContentConditionSummary;
