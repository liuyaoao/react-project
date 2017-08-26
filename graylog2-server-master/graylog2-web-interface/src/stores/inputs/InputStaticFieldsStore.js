import Reflux from 'reflux';

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

const InputStaticFieldsStore = Reflux.createStore({
  listenables: [],
  sourceUrl: (inputId) => `/system/inputs/${inputId}/staticfields`,

  create(input, name, value) {
    const url = URLUtils.qualifyUrl(this.sourceUrl(input.id));
    const promise = fetch('POST', url, {key: name, value: value});
    promise
      .then(() => {
        this.trigger({});
        UserNotification.success(`静态字段 '${name}' 添加到 '${input.title}' 成功`);
      })
      .catch(error => {
        UserNotification.error(`添加静态字段失败: ${error}`,
          `输入的 '${input.title}' 无法添加静态字段`);
      });

    return promise;
  },

  destroy(input, name) {
    const url = URLUtils.qualifyUrl(`${this.sourceUrl(input.id)}/${name}`);
    const promise = fetch('DELETE', url);
    promise
      .then(() => {
        this.trigger({});
        UserNotification.success(`静态字段 '${name}' 从 '${input.title}' 删除成功`);
      })
      .catch(error => {
        UserNotification.error(`删除静态字段失败: ${error}`,
          `不能删除静态字段 '${name} 从输入的 '${input.title}'`);
      });

    return promise;
  },
});

export default InputStaticFieldsStore;
