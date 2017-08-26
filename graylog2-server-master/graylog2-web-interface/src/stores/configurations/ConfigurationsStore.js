import Reflux from 'reflux';
import URLUtils from 'util/URLUtils';
import fetch from 'logic/rest/FetchProvider';
import UserNotification from 'util/UserNotification';

import ActionsProvider from 'injection/ActionsProvider';
const ConfigurationActions = ActionsProvider.getActions('Configuration');

const urlPrefix = '/system/cluster_config';

const ConfigurationsStore = Reflux.createStore({
  listenables: [ConfigurationActions],

  configuration: {},

  _url(path) {
    return URLUtils.qualifyUrl(urlPrefix + path);
  },

  list(configType) {
    const promise = fetch('GET', this._url(`/${configType}`));
    promise.then((response) => {
      this.configuration[configType] = response;
      this.trigger({configuration: this.configuration});
    });

    ConfigurationActions.list.promise(promise);
  },

  listSearchesClusterConfig() {
    const promise = fetch('GET', this._url('/org.graylog2.indexer.searches.SearchesClusterConfig')).then((response) => {
      this.trigger({searchesClusterConfig: response});
    });

    ConfigurationActions.listSearchesClusterConfig.promise(promise);
  },

  listMessageProcessorsConfig(configType) {
    const promise = fetch('GET', URLUtils.qualifyUrl('/system/messageprocessors/config')).then((response) => {
      this.configuration[configType] = response;
      this.trigger({configuration: this.configuration});
    });

    ConfigurationActions.listMessageProcessorsConfig.promise(promise);
  },

  update(configType, config) {
    const promise = fetch('PUT', this._url(`/${configType}`), config);

    promise.then(
      response => {
        this.configuration[configType] = response;
        this.trigger({configuration: this.configuration});
        UserNotification.success('更新配置成功');
      },
      error => {
        UserNotification.error(`更新搜索配置失败: ${error}`, `无法更新搜索配置: ${configType}`);
      });

    ConfigurationActions.update.promise(promise);
  },

  updateMessageProcessorsConfig(configType, config) {
    const promise = fetch('PUT', URLUtils.qualifyUrl('/system/messageprocessors/config'), config);

    promise.then(
      response => {
        this.configuration[configType] = response;
        this.trigger({configuration: this.configuration});
        UserNotification.success('更新配置成功');
      },
      error => {
        UserNotification.error(`消息处理器配置更新失败: ${error}`, `无法更新配置: ${configType}`);
      });

    ConfigurationActions.updateMessageProcessorsConfig.promise(promise);
  },
});

export default ConfigurationsStore;
