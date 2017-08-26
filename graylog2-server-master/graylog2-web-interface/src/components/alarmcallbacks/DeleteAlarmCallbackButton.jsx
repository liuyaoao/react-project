import React from 'react';
import { Button } from 'react-bootstrap';

const DeleteAlarmCallbackButton = React.createClass({
  propTypes: {
    alarmCallback: React.PropTypes.object.isRequired,
    onClick: React.PropTypes.func.isRequired,
  },
  handleClick() {
    if (window.confirm('真的要删除回调吗？')) {
      this.props.onClick(this.props.alarmCallback);
    }
  },
  render() {
    return (
      <Button bsStyle="danger" onClick={this.handleClick}>
        删除回调
      </Button>
    );
  },
});

export default DeleteAlarmCallbackButton;
