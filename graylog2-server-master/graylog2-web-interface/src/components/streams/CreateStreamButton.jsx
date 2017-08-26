'use strict';

var React = require('react');
var Button = require('react-bootstrap').Button;
var StreamForm = require('./StreamForm');

var CreateStreamButton = React.createClass({
    propTypes: {
      onSave: React.PropTypes.func.isRequired,
    },
    onClick() {
        this.refs.streamForm.open();
    },
    render() {
        return (
            <span>
                <Button bsSize={this.props.bsSize} bsStyle={this.props.bsStyle} className={this.props.className} onClick={this.onClick}>
                    {this.props.buttonText || "创建消息流"}
                </Button>
                <StreamForm ref='streamForm' title='正在创建消息流' onSubmit={this.props.onSave} />
            </span>
        );
    }
});

module.exports = CreateStreamButton;
