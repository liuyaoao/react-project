/// <reference path="../../../declarations/bluebird/bluebird.d.ts" />

const moment = require('moment');

import ApiRoutes = require('routing/ApiRoutes');
const fetch = require('logic/rest/FetchProvider').default;
const UserNotification = require('util/UserNotification');
const URLUtils = require('util/URLUtils');
const MessageFieldsFilter = require('logic/message/MessageFieldsFilter');

interface Field {
    name: string;
    value: string;
}

interface Message {
    id: string;
    index: number;
    fields: Array<Field>;
}

var MessagesStore = {
    loadMessage(index: string, messageId: string): Promise<Message> {
        var url = ApiRoutes.MessagesController.single(index.trim(), messageId.trim()).url;
        const promise = fetch('GET', URLUtils.qualifyUrl(url))
            .then(response => {
                const message = response.message;
                const fields = message.fields;
                const filteredFields = MessageFieldsFilter.filterFields(fields);
                const newMessage = {
                    id: message.id,
                    timestamp: moment(message.timestamp).unix(),
                    filtered_fields: filteredFields,
                    formatted_fields: filteredFields,
                    fields: fields,
                    index: response.index,
                    source_node_id: fields.gl2_source_node,
                    source_input_id: fields.gl2_source_input,
                    stream_ids: message.streams,
                };

                return newMessage;
            })
            .catch(errorThrown => {
                UserNotification.error("加载消息信息失败: " + errorThrown,
                    "不能加载消息信息");
            });
        return promise;
    },

    fieldTerms(index: string, string: string): Promise<Array<string>> {
        const url = ApiRoutes.MessagesController.analyze(index, string).url;
        const promise = fetch('GET', URLUtils.qualifyUrl(url))
            .then((response) => response.tokens)
            .catch((error) => {
                UserNotification.error("加载字段条件失败: " + error,
                    "不能加载字段条件.");
            });
        return promise;
    }
};

export = MessagesStore;
