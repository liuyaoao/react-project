/// <reference path="../../../declarations/bluebird/bluebird.d.ts" />

import ApiRoutes = require('routing/ApiRoutes');
const URLUtils = require('util/URLUtils');
const fetch = require('logic/rest/FetchProvider').default;

const UserNotification = require('util/UserNotification');

interface UsageStatsOptOutState {
    opt_out: boolean
}

var UsageStatsOptOutStore = {
    pluginEnabled(): Promise<boolean> {
        var url = URLUtils.qualifyUrl(ApiRoutes.UsageStatsApiController.pluginEnabled().url);
        var promise = fetch('GET', url);

        promise = promise
            .then(response => {
                return response.enabled;
            })
            .catch(() => {
                // When the plugin is not loaded the CORS options request will fail and we can't tell at this point
                // what was the cause for the problem. Therefore, we return false and don't notify the user.
                return false;
            });

        return promise;
    },
    getOptOutState(): Promise<UsageStatsOptOutState> {
        var url = URLUtils.qualifyUrl(ApiRoutes.UsageStatsApiController.setOptOutState().url);
        var promise = fetch('GET', url);

        promise = promise.catch(() => {
            // When the plugin is not loaded the CORS options request will fail and we can't tell at this point
            // what was the cause for the problem. Therefore, we return false and don't notify the user.
            return null;
        });

        return promise;
    },
    setOptOut(notify: boolean): Promise<boolean> {
        return this._sendOptOutState({opt_out: true}, () => {
            if (notify === true) {
                UserNotification.success("将发送没有匿名统计数据.", "退出创建");
            }
        }, (error) => {
            UserNotification.error("请重试",
                "设置匿名使用统计资料退出失败: " + error);
        });
    },
    setOptIn(notify: boolean): Promise<boolean> {
        return this._sendOptOutState({opt_out: false}, () => {
            if (notify === true) {
                UserNotification.success("感谢您帮助我们做出更好的DeepLOG!");
            }
        }, (error) => {
            UserNotification.error("请重试",
                "Opt-in failed: " + error);
        });
    },
    _sendOptOutState(optOutState: UsageStatsOptOutState, success: Function, error: Function): Promise<boolean> {
        var url = URLUtils.qualifyUrl(ApiRoutes.UsageStatsApiController.setOptOutState().url);
        var promise = fetch('POST', url, JSON.stringify(optOutState));

        promise
            .then(() => success())
            .catch((error) => error(error));

        return promise;
    }
};

module.exports = UsageStatsOptOutStore;
