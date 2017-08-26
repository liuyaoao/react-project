const UserNotification = require('util/UserNotification');
const URLUtils = require('util/URLUtils');
import ApiRoutes = require('routing/ApiRoutes');
const fetch = require('logic/rest/FetchProvider').default;

class AlarmCallbackHistoryStore {
    listForAlert(streamId: String, alertId: String) {
        var failCallback = (error) => {
            UserNotification.error("获取报警回调历史失败! 原因: " + error,
                "无法检索报警回调历史.");
        };
        var url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbackHistoryApiController.list(streamId, alertId).url);

        return fetch('GET', url)
          .then(
            response => response.histories,
            failCallback
          );
    }
}
const alarmCallbackHistoryStore = new AlarmCallbackHistoryStore();
module.exports = alarmCallbackHistoryStore;
