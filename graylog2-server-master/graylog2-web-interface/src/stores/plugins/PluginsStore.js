import Reflux from 'reflux';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import fetch from 'logic/rest/FetchProvider';

const PluginsStore = Reflux.createStore({
  sourceUrl: (nodeId) => `/cluster/${nodeId}/plugins`,

  list(nodeId) {
    const promise = fetch('GET', URLUtils.qualifyUrl(this.sourceUrl(nodeId)))
      .then(
        (response) => response.plugins,
        (error) => UserNotification.error(`在节点 "${nodeId}" 获取插件失败: ${error}`, '无法获取插件')
      );

    return promise;
  },
});

export default PluginsStore;
