'use strict';

var React = require('react');
var StreamRuleForm = require('./StreamRuleForm');
var PermissionsMixin = require('../../util/PermissionsMixin');
var HumanReadableStreamRule = require('./HumanReadableStreamRule');

import StoreProvider from 'injection/StoreProvider';
const StreamRulesStore = StoreProvider.getStore('StreamRules');

var UserNotification = require('../../util/UserNotification');

var StreamRule = React.createClass({
    mixins: [PermissionsMixin],
    _onEdit(event) {
        event.preventDefault();
        this.refs.streamRuleForm.open();
    },
    _onDelete(event) {
        event.preventDefault();
        if (window.confirm("你真的想要删除这条消息流规则吗？")) {
            StreamRulesStore.remove(this.props.stream.id, this.props.streamRule.id, () => {
                if (this.props.onDelete) {
                    this.props.onDelete(this.props.streamRule.id);
                }
                UserNotification.success("消息流规则已经成功删除", "成功");
            });
        }
    },
    _onSubmit(streamRuleId, data) {
        StreamRulesStore.update(this.props.stream.id, streamRuleId, data, () => {
            if (this.props.onSubmit) {
                this.props.onSubmit(streamRuleId, data);
            }
            UserNotification.success("消息流规则已经成功修改", "成功");
        });
    },
    _formatActionItems() {
        return (
            <span>
                <a href="#" onClick={this._onDelete}>
                    <i className="fa fa-trash-o"></i>
                </a>

                {' '}

                <a href="#" onClick={this._onEdit}>
                    <i className="fa fa-edit"></i>
                </a>
            </span>
        );
    },
    _getMatchDataClassNames() {
        return (this.props.matchData.rules[this.props.streamRule.id] ? "成功报告" : "危险报警");
    },
    render() {
        var streamRule = this.props.streamRule;
        var streamRuleTypes = this.props.streamRuleTypes;
        var actionItems = (this.isPermitted(this.props.permissions, ['streams:edit:'+this.props.stream.id]) ? this._formatActionItems() : "");
        var className = (this.props.matchData ? this._getMatchDataClassNames() : "");
        return (
            <li className={className}>
                {actionItems} <HumanReadableStreamRule streamRule={streamRule} streamRuleTypes={streamRuleTypes} />
                <StreamRuleForm ref='streamRuleForm' streamRule={streamRule} streamRuleTypes={streamRuleTypes}
                                title="修改消息流规则" onSubmit={this._onSubmit}/>
            </li>
        );
    }
});

module.exports = StreamRule;
