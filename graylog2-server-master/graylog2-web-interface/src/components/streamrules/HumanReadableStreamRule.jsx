'use strict';

var React = require('react');

var HumanReadableStreamRule = React.createClass({
    FIELD_PRESENCE_RULE_TYPE: 5,
    _getTypeForInteger(type, streamRuleTypes) {
        if (streamRuleTypes) {
            return streamRuleTypes.filter((streamRuleType) => {
                return String(streamRuleType.id) === String(type);
            })[0];
        } else {
            return undefined;
        }
    },
    _formatRuleValue(streamRule) {
        if (String(streamRule.type) !== String(this.FIELD_PRESENCE_RULE_TYPE)) {
            if (streamRule.value) {
                return streamRule.value;
            } else {
                return "<empty>";
            }
        } else {
            return null;
        }
    },
    _formatRuleField(streamRule) {
        if (streamRule.field) {
            return streamRule.field;
        } else {
            return "<empty>";
        }
    },
    render() {
        var streamRule = this.props.streamRule;
        var streamRuleType = this._getTypeForInteger(streamRule.type, this.props.streamRuleTypes);
        var negation = (streamRule.inverted ? "不 " : null);
        var longDesc = (streamRuleType ? streamRuleType.long_desc : null);
        return (
            <span><em>{this._formatRuleField(streamRule)}</em>{negation}需要{longDesc}<em>{this._formatRuleValue(streamRule)}</em></span>
        );
    }
});

module.exports = HumanReadableStreamRule;
