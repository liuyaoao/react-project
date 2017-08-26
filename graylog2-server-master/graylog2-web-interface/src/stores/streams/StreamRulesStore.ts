import ApiRoutes = require('routing/ApiRoutes');

const UserNotification = require('util/UserNotification');
const URLUtils = require('util/URLUtils');
const fetch = require('logic/rest/FetchProvider').default;

interface StreamRuleType {
    id: number;
    short_desc: string;
    long_desc: string;
}

interface StreamRule {
    field: string;
    type: number;
    value: string;
    inverted: boolean;
}

interface Callback {
    (): void;
}

class StreamRulesStore {
    private callbacks: Array<Callback> = [];

    types(callback: ((streamRuleTypes: Array<StreamRuleType>) => void)) {
        var url = "/streams/null/rules/types";
        var promise = fetch('GET', URLUtils.qualifyUrl(url));

        return promise;
    }
    list(streamId: string, callback: ((streamRules: Array<StreamRule>) => void)) {
        var failCallback = (error) => {
            UserNotification.error("获取流规则失败! 原因: " + error,
                "无法检索流规则");
        };

        fetch('GET', URLUtils.qualifyUrl(ApiRoutes.StreamRulesApiController.list(streamId).url)).then(callback, failCallback);
    }
    update(streamId: string, streamRuleId: string, data: StreamRule, callback: (() => void)) {
        var failCallback = (error) => {
            UserNotification.error("更新流规则失败! 原因: " + error,
                "无法更新流规则");
        };

        var url = URLUtils.qualifyUrl(ApiRoutes.StreamRulesApiController.update(streamId, streamRuleId).url);
        var request = {field: data.field, type: data.type, value: data.value, inverted: data.inverted};

        fetch('PUT', url, request).then(callback, failCallback).then(this._emitChange.bind(this));
    }
    remove(streamId: string, streamRuleId: string, callback: (() => void)) {
        var failCallback = (error) => {
            UserNotification.error("删除流规则失败! 原因: " + error,
                "无法删除流规则");
        };

        var url = URLUtils.qualifyUrl(ApiRoutes.StreamRulesApiController.delete(streamId, streamRuleId).url);
        fetch('DELETE', url).then(callback, failCallback).then(this._emitChange.bind(this));
    }
    create(streamId: string, data: StreamRule, callback: (() => void)) {
        var failCallback = (error) => {
            UserNotification.error("创建流规则失败! 原因: " + error,
                "无法创建流规则");
        };

        var url = URLUtils.qualifyUrl(ApiRoutes.StreamRulesApiController.create(streamId).url);

        fetch('POST', url, data).then(callback, failCallback).then(this._emitChange.bind(this));
    }
    onChange(callback) {
        this.callbacks.push(callback);
    }
    _emitChange() {
        this.callbacks.forEach((callback) => callback());
    }
}

var streamRulesStore = new StreamRulesStore();

export = streamRulesStore;
