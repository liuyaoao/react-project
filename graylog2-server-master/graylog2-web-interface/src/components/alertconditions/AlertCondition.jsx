import React from 'react';
import { Row, Col, Badge, Button } from 'react-bootstrap';

import AlertConditionsFactory from 'logic/alertconditions/AlertConditionsFactory';

import ActionsProvider from 'injection/ActionsProvider';
const AlertConditionsActions = ActionsProvider.getActions('AlertConditions');

import UnknownAlertCondition from 'components/alertconditions/UnknownAlertCondition';
import AlertConditionForm from 'components/alertconditions/AlertConditionForm';

const AlertCondition = React.createClass({
  propTypes: {
    alertCondition: React.PropTypes.object.isRequired,
  },
  getInitialState() {
    return {
      edit: false,
    };
  },
  _onEdit() {
    this.setState({edit: !this.state.edit});
  },
  _onDelete() {
    if (window.confirm('真的要删除报警条件吗？')) {
      AlertConditionsActions.delete(this.props.alertCondition.stream_id, this.props.alertCondition.id);
    }
  },
  _onUpdate(event) {
    event.preventDefault();
    const request = {
      type: this.props.alertCondition.type,
      parameters: this.refs.updateForm.getValue(),
    };
    AlertConditionsActions.update.triggerPromise(this.props.alertCondition.stream_id, this.props.alertCondition.id, request)
    .then(() => {
      this.setState({edit: false});
    });
  },
  render() {
    const alertCondition = this.props.alertCondition;
    const alertConditionType = new AlertConditionsFactory().get(alertCondition.type);
    if (!alertConditionType) {
      return <UnknownAlertCondition alertCondition={alertCondition} />;
    }
    return (
      <span>
        <Row className="alert-condition" data-condition-id={alertCondition.id}>
          <Col md={9}>
            <h3>{alertConditionType.title}条件{alertCondition.in_grace && <Badge className="badge-info">在宽限期内</Badge>}</h3>
            <alertConditionType.summary alertCondition={alertCondition} />
            {' '}
            {this.state.edit &&
            <form onSubmit={this._onUpdate}>
              <AlertConditionForm ref="updateForm" type={alertCondition.type} alertCondition={alertCondition.parameters} />
              {' '}
              <Button bsStyle="info" type="submit">保存</Button>
            </form>}
          </Col>

          <Col md={3} style={{textAlign: 'right'}}>
            <Button bsStyle="success" onClick={this._onEdit}>修改条件</Button>
            {' '}
            <Button bsStyle="danger" onClick={this._onDelete}>删除条件</Button>
          </Col>
        </Row>
      </span>
    );
  },
});

export default AlertCondition;
