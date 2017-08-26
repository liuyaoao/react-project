import React from 'react';
import jQuery from 'jquery';

import {TypeAheadFieldInput} from 'components/common';
import GracePeriodInput from 'components/alertconditions/GracePeriodInput';

const FieldContentConditionForm = React.createClass({
  propTypes: {
    alertCondition: React.PropTypes.object,
  },
  getDefaultProps() {
    return {
      alertCondition: {
        field: '',
        value: '',
      },
    };
  },
  getInitialState() {
    return {
      field: this.props.alertCondition.field,
    };
  },
  getValue() {
    return jQuery.extend({
      field: this.state.field,
      value: this.refs.value.value,
    }, this.refs.gracePeriod.getValue());
  },
  _onFieldChange(event) {
    this.setState({field: event.target.value});
  },
  render() {
    const alertCondition = this.props.alertCondition;
    return (
      <span>
        当消息到达{' '}
        <TypeAheadFieldInput ref="fieldInput"
                             type="text"
                             autoComplete="off"
                             defaultValue={alertCondition.field}
                             onChange={this._onFieldChange}
                             required /> 时触发警报
        <br />
        设置{' '}
        <input ref="value" type="text" className="form-control" autoComplete="off" required defaultValue={alertCondition.value}/>
        {' '}
        <GracePeriodInput ref="gracePeriod" alertCondition={alertCondition}/>
      </span>
    );
  },
});

export default FieldContentConditionForm;
