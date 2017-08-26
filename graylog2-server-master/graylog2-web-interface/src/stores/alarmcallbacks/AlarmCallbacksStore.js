import Reflux from 'reflux';

import ActionsProvider from 'injection/ActionsProvider';
const AlarmCallbacksActions = ActionsProvider.getActions('AlarmCallbacks');

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

const AlarmCallbacksStore = Reflux.createStore({
  listenables: [AlarmCallbacksActions],
  types: undefined,

  init() {
    this.available(undefined).then((types) => {
      this.types = types;
      this.trigger({types: types});
    });
  },

  getInitialState() {
    return {
      types: this.types,
    };
  },

  available(streamId) {
    const failCallback = (error) => {
      UserNotification.error('获取可用的报警回调种类失败，错误状态: ' + error.message,
        '无法检索可用的报警回调种类');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.available(streamId).url);
    const promise = fetch('GET', url).then((response) => {
      return response.types;
    }, failCallback);

    AlarmCallbacksActions.available.promise(promise);

    return promise;
  },
  list(streamId) {
    const failCallback = (error) => {
      UserNotification.error('获取报警回调失败，错误状态: ' + error.message,
        '无法检索报警回调');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.list(streamId).url);
    const promise = fetch('GET', url).then((response) => response.alarmcallbacks, failCallback);

    AlarmCallbacksActions.list.promise(promise);
  },
  save(streamId, alarmCallback) {
    const failCallback = (error) => {
      UserNotification.error('保存报警回调失败，错误状态: ' + error.message,
        '无法保存报警回调');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.create(streamId).url);

    const promise = fetch('POST', url, alarmCallback).catch(failCallback);

    AlarmCallbacksActions.save.promise(promise);
  },
  delete(streamId, alarmCallbackId) {
    const failCallback = (error) => {
      UserNotification.error('移除报警回调失败，错误状态: ' + error.message,
        '无法移除报警回调');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.delete(streamId, alarmCallbackId).url);

    const promise = fetch('DELETE', url).catch(failCallback);

    AlarmCallbacksActions.delete.promise(promise);
  },
  update(streamId, alarmCallbackId, deltas) {
    const failCallback = (error) => {
      UserNotification.error('修改报警回调\'' + alarmCallbackId + '\'失败，错误状态: ' + error.message,
        '无法修改报警回调');
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.AlarmCallbacksApiController.update(streamId, alarmCallbackId).url);

    const promise = fetch('PUT', url, deltas).catch(failCallback);

    AlarmCallbacksActions.update.promise(promise);
  },
});

export default AlarmCallbacksStore;
