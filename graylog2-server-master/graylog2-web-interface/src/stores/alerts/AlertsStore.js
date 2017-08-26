import Reflux from 'reflux';

import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';

import ActionsProvider from 'injection/ActionsProvider';
const AlertsActions = ActionsProvider.getActions('Alerts');

const AlertsStore = Reflux.createStore({
  listenables: [AlertsActions],

  list(stream, since) {
    const url = URLUtils.qualifyUrl(ApiRoutes.AlertsApiController.list(stream.id, since).url);
    const promise = fetch('GET', url);
    promise
      .then(
        response => this.trigger({ alerts: response }),
        error => {
          UserNotification.error(`获取警报流 "${stream.title}" 失败! 原因: ${error.message}`,
            `无法检索流警报 "${stream.title}".`);
        });

    AlertsActions.list.promise(promise);
  },

  listPaginated(streamId, skip, limit) {
    const url = URLUtils.qualifyUrl(ApiRoutes.AlertsApiController.listPaginated(streamId, skip, limit).url);
    const promise = fetch('GET', url);
    promise
      .then(
        response => this.trigger({ alerts: response }),
        error => {
          UserNotification.error(`获取警报失败! 原因: ${error.message}`, '无法检索警报.');
        });

    AlertsActions.listPaginated.promise(promise);
  },

  listAllStreams(since) {
    const url = URLUtils.qualifyUrl(ApiRoutes.AlertsApiController.listAllStreams(since).url);
    const promise = fetch('GET', url);
    promise
      .then(
        response => this.trigger({ alerts: response }),
        error => {
          UserNotification.error(`获取警报失败! 原因: ${error.message}`, '无法检索警报.');
        });

    AlertsActions.listAllStreams.promise(promise);
  },
});

export default AlertsStore;
