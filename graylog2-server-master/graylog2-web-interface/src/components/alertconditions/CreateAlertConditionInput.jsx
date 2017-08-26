import React from 'react';
import { Row, Col, Input, Button, ButtonToolbar, DropdownButton, MenuItem, Alert } from 'react-bootstrap';

import jQuery from 'jquery';

import ActionsProvider from 'injection/ActionsProvider';
const AlertConditionsActions = ActionsProvider.getActions('AlertConditions');

import AlertConditionsFactory from 'logic/alertconditions/AlertConditionsFactory';

import AlertConditionForm from 'components/alertconditions/AlertConditionForm';

const CreateAlertConditionInput = React.createClass({
  propTypes: {
    streamId: React.PropTypes.string.isRequired,
  },
  getInitialState() {
    return {
      type: this.PLACEHOLDER,
      title: this.PLACEHOLDER
    };
  },
  PLACEHOLDER: '选择警报条件类型',
  alertConditionsFactory: new AlertConditionsFactory(),

  componentDidMount() {
    //hover时 dropdown显示
    var hoverTimeout;
    $('.dropdown').hover(function() {
        clearTimeout(hoverTimeout);
        $(this).addClass('open');
    }, function() {
        var $self = $(this);
        hoverTimeout = setTimeout(function() {
            $self.removeClass('open');
        }, 50);
    });
  },
  _onChange(evt) {
    this.setState({type: evt.currentTarget.name,title: evt.currentTarget.title});
  },
  _onSubmit(evt) {
    evt.preventDefault();
    const request = {
      type: this.state.type,
      parameters: this.refs.conditionForm.getValue(),
    };
    AlertConditionsActions.save(this.props.streamId, request);
  },
  _formatConditionForm(type) {
    return <AlertConditionForm ref="conditionForm" type={type}/>;
  },
  render() {
    const conditionForm = (this.state.type !== this.PLACEHOLDER ? this._formatConditionForm(this.state.type) : null);
    const availableTypes = jQuery.map(this.alertConditionsFactory.available(), (definition, value) => {
      return <MenuItem key={'type-option-' + value} name={value} title={definition.title + ' condition'}>{definition.title} condition</MenuItem>;
    });
    return (
      <Row className="content input-new">
        <Col md={12}>
          <h2 style={{marginBotton: '10px'}}>
            添加新的警报条件
          </h2>
          <p className="description">
            当配置的条件被满足时，将触发消息流警报。
          </p>

          <form className="form-inline" onSubmit={this._onSubmit}>
            <div className="form-group" style={{display: 'block'}}>
              <ButtonToolbar className="timerange-chooser nofloat">
                <DropdownButton className="add-alert-type form-control" title={this.state.title} onSelect={this._onChange}>
                  {availableTypes}
                </DropdownButton>
              </ButtonToolbar>
              {conditionForm}
              {conditionForm !== null && <Button type="submit" bsStyle="success" className="form-control add-alert">
                创建新的警报条件
              </Button>}
            </div>
          </form>
        </Col>
      </Row>
    );
  },
});

export default CreateAlertConditionInput;
