'use strict';

var React = require('react');
var LinkedStateMixin = require('react-addons-linked-state-mixin');
var BootstrapModalForm = require('../bootstrap/BootstrapModalForm');
var Input = require('react-bootstrap').Input;
var HumanReadableStreamRule = require('./HumanReadableStreamRule');
var Col = require('react-bootstrap').Col;
var TypeAheadFieldInput = require('../common/TypeAheadFieldInput');

var DocumentationLink = require('../support/DocumentationLink');
var DocsHelper = require('../../util/DocsHelper');
var Version = require('../../util/Version');

var StreamRuleForm = React.createClass({
    mixins: [LinkedStateMixin],
    FIELD_PRESENCE_RULE_TYPE: 5,
    getInitialState() {
        return this.props.streamRule;
    },
    getDefaultProps() {
        return {
            streamRule: {field: "", type: 1, value: "", inverted: false}
        };
    },
    _resetValues() {
        this.setState(this.props.streamRule);
    },
    _onSubmit(evt) {
        if (this.state.type === this.FIELD_PRESENCE_RULE_TYPE) {
            this.state.value = "";
        }
        this.props.onSubmit(this.props.streamRule.id, this.state);
        this.refs.modal.close();
    },
    _formatStreamRuleType(streamRuleType) {
        return <option key={'streamRuleType'+streamRuleType.id}
                       value={streamRuleType.id}>{streamRuleType.short_desc}</option>;
    },
    open() {
        this._resetValues();
        this.refs.modal.open();
    },
    close() {
        this.refs.modal.close();
    },
    render() {
        var streamRuleTypes = this.props.streamRuleTypes.map(this._formatStreamRuleType);
        var valueBox = (String(this.state.type) !== String(this.FIELD_PRESENCE_RULE_TYPE) ?
            <Input type='text' required={true} label='值' valueLink={this.linkState('value')}/> : "");
        return (
            <BootstrapModalForm ref='modal'
                                title={this.props.title}
                                onSubmitForm={this._onSubmit}
                                submitButtonText="保存">
                <div>
                    <Col md={8}>
                        <TypeAheadFieldInput ref='fieldInput'
                                             type='text'
                                             required={true}
                                             label='属性'
                                             valueLink={this.linkState('field')}
                                             autoFocus />
                        <Input type='select' required={true} label='种类' valueLink={this.linkState('type')}>
                            {streamRuleTypes}
                        </Input>
                        {valueBox}
                        <Input type='checkbox' label='倒置' checkedLink={this.linkState('inverted')}/>

                        <p>
                            <strong>结果:</strong>
                            {' '}
                            属性 <HumanReadableStreamRule streamRule={this.state}
                                                           streamRuleTypes={this.props.streamRuleTypes}/>
                        </p>
                    </Col>
                    <Col md={4}>
                        <div className="well well-sm matcher-github">
                            服务器将尝试转换为基于匹配类型尽可能好的字符串或数字。

                            <br /><br />
                            使用java正则表达式语法。
                        </div>
                    </Col>
                </div>
            </BootstrapModalForm>
        );
    }
});

module.exports = StreamRuleForm;
