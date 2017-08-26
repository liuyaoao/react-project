import Reflux from 'reflux';
import Qs from 'qs';
import fetch from 'logic/rest/FetchProvider';

import ApiRoutes from 'routing/ApiRoutes';
import Routes from 'routing/Routes';

import ActionsProvider from 'injection/ActionsProvider';
const SavedSearchesActions = ActionsProvider.getActions('SavedSearches');

import StoreProvider from 'injection/StoreProvider';
const SearchStore = StoreProvider.getStore('Search');

import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';

const SavedSearchesStore = Reflux.createStore({
  listenables: [SavedSearchesActions],
  sourceUrl: '/search/saved',
  savedSearches: undefined,

  init() {
    this.trigger({savedSearches: this.savedSearches});
  },

  list() {
    const promise = fetch('GET', URLUtils.qualifyUrl(URLUtils.concatURLPath(this.sourceUrl)))
      .then(response => {
        this.savedSearches = response.searches;
        this.trigger({savedSearches: this.savedSearches});
      })
      .catch(error => {
        UserNotification.error('获取已保存的搜索失败! 原因: ' + error,
          '无法获取已保存的搜索');
      });

    SavedSearchesActions.list.promise(promise);
  },

  getSavedSearch(searchId) {
    let currentSavedSearch;
    for (let i = 0; i < this.savedSearches.length && !currentSavedSearch; i++) {
      if (this.savedSearches[i].id === searchId) {
        currentSavedSearch = this.savedSearches[i];
      }
    }

    return currentSavedSearch;
  },

  isValidTitle(searchId, title) {
    for (let i = 0; i < this.savedSearches.length; i++) {
      const savedSearch = this.savedSearches[i];
      if (savedSearch.id !== searchId && savedSearch.title === title) {
        return false;
      }
    }

    return true;
  },

  execute(searchId, streamId, width) {
    const savedSearch = this.getSavedSearch(searchId);
    if (!savedSearch) {
      // show notification
      SavedSearchesActions.load.triggerPromise();
      return;
    }

    const searchQuery = {
      saved: searchId,
      width: width,
    };
    for (const paramName in savedSearch.query) {
      if (Object.hasOwnProperty.call(savedSearch.query, paramName)) {
        const effectiveParamName = (paramName.toLowerCase() === 'query' ? 'q' : paramName.toLowerCase());
        searchQuery[effectiveParamName] = savedSearch.query[paramName];
      }
    }

    let url;
    if (streamId) {
      url = Routes.stream_search(streamId);
    } else {
        if(window.isFilterSearch){
            url = Routes.FILTERSEARCH;
        }else{
            url = Routes.SEARCH;
        }

    }
    url = `${url}?${Qs.stringify(searchQuery)}`;
    URLUtils.openLink(url, false);
  },

  _createOrUpdate(title, searchId) {
    const originalSearchParams = SearchStore.getOriginalSearchParamsWithFields();
    const queryParams = originalSearchParams.set('rangeType', originalSearchParams.get('range_type')).delete('range_type');
    const params = {title: title, query: queryParams.toJS()};

    let url;
    let verb;

    if (!searchId) {
      url = ApiRoutes.SavedSearchesApiController.create().url;
      verb = 'POST';
    } else {
      url = ApiRoutes.SavedSearchesApiController.update(searchId).url;
      verb = 'PUT';
    }

    return fetch(verb, URLUtils.qualifyUrl(url), JSON.stringify(params));
  },

  create(title) {
    const promise = this._createOrUpdate(title);
    promise
      .then(() => {
        UserNotification.success(`搜索条件保存为 "${title}".`);
        SavedSearchesActions.list.triggerPromise();
      })
      .catch(error => {
        UserNotification.error('保存搜索条件失败: ' + error,
          '无法保存搜索条件');
      });

    SavedSearchesActions.create.promise(promise);
  },

  update(searchId, title) {
    const promise = this._createOrUpdate(title, searchId);
    promise
      .then(() => {
        UserNotification.success(`保存搜索 "${title}" 已更新.`);
        SavedSearchesActions.list.triggerPromise();
      })
      .catch(error => {
        UserNotification.error(`更新保存的搜索 "${title}" 失败! 原因: ${error}`,
          '无法更新保存的搜索');
      });

    SavedSearchesActions.update.promise(promise);
  },

  delete(searchId) {
    const url = ApiRoutes.SavedSearchesApiController.delete(searchId).url;
    const promise = fetch('DELETE', URLUtils.qualifyUrl(url));
    promise
      .then(() => {
        UserNotification.success(`保存的搜索 "${this.savedSearches[searchId]}" 成功删除.`);
        SearchStore.savedSearchDeleted(searchId);
      })
      .catch(error => {
        UserNotification.error(`删除保存的搜索 "${this.savedSearches[searchId]}" 失败! 原因: ${error}`,
          '无法删除保存的搜索');
      });

    SavedSearchesActions.delete.promise(promise);
  },
});

export default SavedSearchesStore;
