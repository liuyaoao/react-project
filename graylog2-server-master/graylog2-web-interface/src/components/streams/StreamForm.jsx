'use strict';

var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var BootstrapModalForm = require('../bootstrap/BootstrapModalForm');
var Input = require('react-bootstrap').Input;

var StreamForm = React.createClass({
    propTypes: {
      onSubmit: React.PropTypes.func.isRequired,
    },
    mixins: [LinkedStateMixin],
    getInitialState() {
        return this._getValuesFromProps(this.props);
    },
    getDefaultProps() {
        return {
            stream: {title: "", description: ""}
        };
    },
    _resetValues() {
        this.setState(this._getValuesFromProps(this.props));
    },
    _getValuesFromProps(props) {
        return {
            title: props.stream.title,
            description: props.stream.description
        };
    },
    _onSubmit(evt) {
        this.props.onSubmit(this.props.stream.id, {title: this.state.title, description: this.state.description});
        this.refs.modal.close();
    },
    open() {
        this._resetValues();
        this.refs.modal.open();
    },
    close() {
        this.refs.modal.close();
    },
    render() {
        return (
            <BootstrapModalForm ref="modal"
                                title={this.props.title}
                                onSubmitForm={this._onSubmit}
                                submitButtonText="保存">
                <Input type='text' required={true} label='标题' placeholder='这个流的描述性名称' valueLink={this.linkState('title')} autoFocus />
                <Input type='text' required={true} label='描述' placeholder='什么样的消息被路由到这条流？' valueLink={this.linkState('description')}/>
            </BootstrapModalForm>
        );
    }
});

module.exports = StreamForm;
