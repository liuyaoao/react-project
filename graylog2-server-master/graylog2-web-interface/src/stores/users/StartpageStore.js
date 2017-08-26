import Reflux from 'reflux';
import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import fetch from 'logic/rest/FetchProvider';

const StartpageStore = Reflux.createStore({
  listenables: [],
  sourceUrl: (username) => `/users/${username}`,

  set(username, type, id) {
    const url = URLUtils.qualifyUrl(this.sourceUrl(username));
    const payload = {};
    if (type && id) {
      payload.type = type;
      payload.id = id;
    }
    const promise = fetch('PUT', url, {startpage: payload})
      .then(
        () => {
          this.trigger();
          UserNotification.success('你的起始页修改成功')
        },
        (error) => UserNotification.error(`修改你的起始页失败：${error}`, '无法修改你的起始页')
      );

    return promise;
  },
});

export default StartpageStore;
