import Reflux from 'reflux';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import fetch from 'logic/rest/FetchProvider';

const SystemShutdownStore = Reflux.createStore({
  sourceUrl: (nodeId) => `/cluster/${nodeId}/shutdown`,

  shutdown(nodeId) {
    return fetch('POST', URLUtils.qualifyUrl(this.sourceUrl(nodeId)))
      .then(
        () => {
          this.trigger({});
          UserNotification.success(`节点 '${nodeId}' 将关闭`);
        },
        error => {
          UserNotification.error(`关闭节点 '${nodeId}' 失败: ${error}`,
            `无法发出关机信号到节点 '${nodeId}'`);
        }
      );
  },
});

export default SystemShutdownStore;
