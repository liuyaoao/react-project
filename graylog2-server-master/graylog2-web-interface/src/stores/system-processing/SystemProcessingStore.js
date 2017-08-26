import Reflux from 'reflux';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import fetch from 'logic/rest/FetchProvider';

const SystemProcessingStore = Reflux.createStore({
  sourceUrl: (nodeId) => `/cluster/${nodeId}/processing`,

  pause(nodeId) {
    return fetch('POST', URLUtils.qualifyUrl(`${this.sourceUrl(nodeId)}/pause`))
      .then(
        () => {
          this.trigger({});
          UserNotification.success(`在节点 '${nodeId}' 消息处理成功暂停`);
        },
        error => {
          UserNotification.error(`在节点 '${nodeId}' 暂停消息处理失败: ${error}`,
            `在节点 '${nodeId}' 无法暂停消息处理`);
        }
      );
  },

  resume(nodeId) {
    return fetch('POST', URLUtils.qualifyUrl(`${this.sourceUrl(nodeId)}/resume`))
      .then(
        () => {
          this.trigger({});
          UserNotification.success(`在节点 '${nodeId}' 消息处理成功恢复`);
        },
        error => {
          UserNotification.error(`在节点 '${nodeId}' 恢复消息处理失败: ${error}`,
            `在节点 '${nodeId}' 无法恢复消息处理`);
        }
      );
  },
});

export default SystemProcessingStore;
