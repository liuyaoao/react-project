import Reflux from 'reflux';
import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';

import fetch from 'logic/rest/FetchProvider';

import ActionsProvider from 'injection/ActionsProvider';
const LdapGroupsActions = ActionsProvider.getActions('LdapGroups');

const LdapGroupsStore = Reflux.createStore({
  listenables: [LdapGroupsActions],
  sourceUrl: '/system/ldap',
  groups: undefined,
  mapping: undefined,

  getInitialState() {
    return {groups: this.groups, mapping: this.mapping};
  },

  loadGroups() {
    const url = URLUtils.qualifyUrl(`${this.sourceUrl}/groups`);

    const promise = fetch('GET', url);
    promise.then(
      response => {
        this.groups = response;
        this.trigger({groups: this.groups});
      },
      error => {
        UserNotification.error(`加载LDAP组列表失败：${error}`,
          '无法加载LDAP组列表');
      }
    );

    LdapGroupsActions.loadGroups.promise(promise);
  },

  loadMapping() {
    const url = URLUtils.qualifyUrl(`${this.sourceUrl}/settings/groups`);

    const promise = fetch('GET', url);
    promise.then(
      response => {
        this.mapping = response;
        this.trigger({mapping: this.mapping});
      },
      error => {
        UserNotification.error(`加载LDAP组映射失败：${error}`,
          '无法加载LDAP组映射');
      }
    );

    LdapGroupsActions.loadMapping.promise(promise);
  },

  saveMapping(mapping) {
    const url = URLUtils.qualifyUrl(`${this.sourceUrl}/settings/groups`);

    const promise = fetch('PUT', url, mapping);
    promise.then(
      () => {
        this.loadMapping();
        UserNotification.success('LDAP组映射更新成功。');
      },
      error => {
        UserNotification.error(`更新LDAP组映射失败：${error}`,
          '无法更新LDAP组映射');
      }
    );

    LdapGroupsActions.saveMapping.promise(promise);
  },
});

export default LdapGroupsStore;
