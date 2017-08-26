import React, {PropTypes} from 'react';

const StreamStateBadge = React.createClass({
  propTypes: {
    onClick: PropTypes.func.isRequired,
    stream: PropTypes.object.isRequired,
  },
  _onClick() {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this.props.stream);
    }
  },
  render() {
    if (!this.props.stream.disabled) {
      return null;
    }

    return (
      <span className="badge alert-danger stream-stopped" onClick={this._onClick} title="点击这里启动消息流"
            style={{marginLeft: 5, cursor: 'pointer'}}>
        已停止
      </span>
    );
  },
});

export default StreamStateBadge;
