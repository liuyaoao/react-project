import Reflux from 'reflux';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';
import fetch from 'logic/rest/FetchProvider';

const JournalStore = Reflux.createStore({
  sourceUrl: (nodeId) => `/cluster/${nodeId}/journal`,

  get(nodeId) {
    const promise = fetch('GET', URLUtils.qualifyUrl(this.sourceUrl(nodeId)));
    promise.catch(error => {
      UserNotification.error(`在节点 ${nodeId} 获取日志信息失败: ${error}`, '不能获取日志信息');
    });

    return promise;
  },
});

export default JournalStore;
