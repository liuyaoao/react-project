import Reflux from 'reflux';

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

const InputStatesStore = Reflux.createStore({
  listenables: [],

  init() {
    this.list();
  },

  getInitialState() {
    return {inputStates: this.inputStates};
  },

  list() {
    const url = URLUtils.qualifyUrl(ApiRoutes.ClusterInputStatesController.list().url);
    return fetch('GET', url)
      .then((response) => {
        const result = {};
        Object.keys(response).forEach((node) => {
          response[node].forEach((input) => {
            if (!result[input.id]) {
              result[input.id] = {};
            }
            result[input.id][node] = input;
          });
        });
        this.inputStates = result;
        this.trigger({inputStates: this.inputStates});

        return result;
      });
  },

  _checkInputStateChangeResponse(input, response, action) {
    const nodes = Object.keys(response).filter(node => input.global ? true : node === input.node);
    let failedNodes = 0;
    nodes.forEach(node => {
      failedNodes = (response[node] === null ? failedNodes + 1 : failedNodes);
    });

    if (failedNodes === 0) {
      UserNotification.success(`请求至 ${action.toLowerCase()} 的输入值 '${input.title}' 已被成功发送。`,
        `输入值 '${input.title}' 即将被 ${action === 'START' ? '启动' : '停止'}`);
    } else if (failedNodes === nodes.length) {
      UserNotification.error(`请求至 ${action.toLowerCase()} 的输入值 '${input.title}' 发送失败。请在您的DeepLOG日志中查看更多信息。`,
        `输入值 '${input.title}' 无法被 ${action === 'START' ? '启动' : '停止'}`);
    } else {
      UserNotification.warning(`某些节点的请求至 ${action.toLowerCase()} 的输入值 '${input.title}' 发送失败。请在您的DeepLOG日志中查看更多信息。`,
        `输入值 '${input.title}' 无法在所有的节点中 ${action === 'START' ? '启动' : '停止'}`);
    }
  },

  start(input) {
    const url = URLUtils.qualifyUrl(ApiRoutes.ClusterInputStatesController.start(input.id).url);
    return fetch('PUT', url)
      .then(
        (response) => {
          this._checkInputStateChangeResponse(input, response, 'START');
          this.list();
        },
        error => {
          UserNotification.error(`启动输入值 '${input.title}' 发生了错误: ${error}`, `输入值 '${input.title}' 无法被启动`);
        });
  },

  stop(input) {
    const url = URLUtils.qualifyUrl(ApiRoutes.ClusterInputStatesController.stop(input.id).url);
    return fetch('DELETE', url)
      .then(
        (response) => {
          this._checkInputStateChangeResponse(input, response, 'STOP');
          this.list();
        },
        error => {
          UserNotification.error(`停止输入值 '${input.title}' 发生了错误: ${error}`, `输入值 '${input.title}' 无法被启动`);
        });
  },
});

export default InputStatesStore;
