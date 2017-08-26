import Reflux from 'reflux';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import fetch from 'logic/rest/FetchProvider';

const SystemLoadBalancerStore = Reflux.createStore({
  sourceUrl: (nodeId) => `/cluster/${nodeId}/lbstatus`,

  override(nodeId, status) {
    return fetch('PUT', URLUtils.qualifyUrl(`${this.sourceUrl(nodeId)}/override/${status}`))
      .then(
        () => {
          this.trigger({});
          UserNotification.success(`在节点 '${nodeId}' 负载均衡状态成功地变为 '${status}' `);
        },
        error => {
          UserNotification.error(`在节点 '${nodeId}' 更改负载均衡状态失败: ${error}`,
            `在节点 '${nodeId}' 无法将负载均衡状态变为 '${status}' `);
        }
      );
  },
});

export default SystemLoadBalancerStore;
