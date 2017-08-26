/// <reference path="../../../declarations/bluebird/bluebird.d.ts" />

import ApiRoutes = require('routing/ApiRoutes');
const URLUtils = require('util/URLUtils');
const UserNotification = require('util/UserNotification');
const fetch = require('logic/rest/FetchProvider').default;

const ToolsStore = {
    testNaturalDate(text: string): Promise<string[]> {
        const url = ApiRoutes.ToolsApiController.naturalDateTest(text).url;
        const promise = fetch('GET', URLUtils.qualifyUrl(url));

        promise.catch((errorThrown) => {
            if (errorThrown.additional.status !== 422) {
                UserNotification.error("加载关键字预览失败! 原因: " + errorThrown,
                    "无法加载预览关键字");
            }
        });

        return promise;
    },
    testGrok(pattern: string, string: string): Promise<Object> {
        const url = ApiRoutes.ToolsApiController.grokTest().url;
        const promise = fetch('POST', URLUtils.qualifyUrl(url), {pattern: pattern, string: string});

        promise.catch((errorThrown) => {
            UserNotification.error('详细信息: ' + errorThrown,
                '我们无法运行获得提取器.请检查您的参数.');
        });

        return promise;
    },
    testJSON(flatten: boolean, listSeparator: string, keySeparator: string, kvSeparator: string, string: string): Promise<Object> {
        const url = ApiRoutes.ToolsApiController.jsonTest().url;
        const payload = {
            flatten: flatten,
            list_separator: listSeparator,
            key_separator: keySeparator,
            kv_separator: kvSeparator,
            string: string,
        };

        const promise = fetch('POST', URLUtils.qualifyUrl(url), payload);

        promise.catch((errorThrown) => {
            UserNotification.error('详细信息: ' + errorThrown,
                '我们无法运行JSON提取器.请检查您的参数.');
        });

        return promise;
    },
    testRegex(regex: string, string: string): Promise<Object> {
        const url = ApiRoutes.ToolsApiController.regexTest().url;
        const promise = fetch('POST', URLUtils.qualifyUrl(url), {regex: regex, string: string});

        promise.catch((errorThrown) => {
            UserNotification.error('详细信息: ' + errorThrown,
                '无法运行的正则表达式.请确保它是有效的.');
        });

        return promise;
    },
    testRegexReplace(regex: string, replacement: string, replaceAll: boolean, string: string): Promise<Object> {
        const url = ApiRoutes.ToolsApiController.regexReplaceTest().url;
        const payload = {
            regex: regex,
            replacement: replacement,
            replace_all: replaceAll,
            string: string
        };
        const promise = fetch('POST', URLUtils.qualifyUrl(url), payload);

        promise.catch((errorThrown) => {
            UserNotification.error('详细信息: ' + errorThrown,
                '无法运行的正则表达式.请确保它是有效的.');
        });

        return promise;
    },
    testSplitAndIndex(splitBy: string, index: number, string: string): Promise<Object> {
        const url = ApiRoutes.ToolsApiController.splitAndIndexTest().url;
        const payload = {
            split_by: splitBy,
            index: index,
            string: string,
        };

        const promise = fetch('POST', URLUtils.qualifyUrl(url), payload);

        promise.catch((errorThrown) => {
            UserNotification.error('详细信息: ' + errorThrown,
                '我们无法运行拆分和索引提取器.请检查您的参数.');
        });

        return promise;
    },
    testSubstring(beginIndex: number, endIndex: number, string: string): Promise<Object> {
        const url = ApiRoutes.ToolsApiController.substringTest().url;
        const payload = {
            start: beginIndex,
            end: endIndex,
            string: string,
        };

        const promise = fetch('POST', URLUtils.qualifyUrl(url), payload);

        promise.catch((errorThrown) => {
            UserNotification.error('详细信息: ' + errorThrown,
                '我们无法运行子提取器.请检查索引界限.');
        });

        return promise;
    },
};

export = ToolsStore;
