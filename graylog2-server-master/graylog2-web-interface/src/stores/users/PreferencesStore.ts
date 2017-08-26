const UserNotification = require('util/UserNotification');
const URLUtils = require('util/URLUtils');

const fetch = require('logic/rest/FetchProvider').default;

interface Preference {
  name: string;
  value: any;
}

interface PreferencesMap {
  [index: string]: any;
}

interface Data {
  preferences: PreferencesMap
}

var PreferencesStore = {
  URL: URLUtils.qualifyUrl('/users/'),
  convertPreferenceMapToArray(preferencesAsMap: PreferencesMap): Array<Preference> {
    preferencesAsMap = preferencesAsMap || {};
    var preferences = Object.keys(preferencesAsMap).map((name) => {
      return {
        name: name,
        value: preferencesAsMap[name]
      };
    });
    preferences = preferences.sort((t1: Preference, t2: Preference) => t1.name.localeCompare(t2.name));
    return preferences;
  },
  convertPreferenceArrayToMap: function (preferences: Array<Preference>): PreferencesMap {
    var preferencesAsMap: PreferencesMap = {};
    preferences.forEach((element) => {
      // TODO: Converting all preferences to booleans for now, we should change this when we support more types
      preferencesAsMap[element.name] = element.value === true || element.value === 'true';
    });
    return preferencesAsMap;
  },
  saveUserPreferences(preferences: Array<Preference>, callback: (preferences: Array<any>) => void): void {
    if (!this._userName) {
      throw new Error("在你能保存它们之前，需要先加载用户偏好");
    }
    var preferencesAsMap = this.convertPreferenceArrayToMap(preferences);
    var url = this.URL + this._userName + "/preferences";
    fetch('PUT', url, {preferences: preferencesAsMap}).then(() => {
      UserNotification.success("用户偏好保存成功");
      callback(preferences);
    }, (errorThrown) => {
      UserNotification.error("用户\"" + this._userName + "\"的偏好保存失败：" + errorThrown,
        "无法保存用户偏好");
    });
  },
  loadUserPreferences(userName: string, callback: (preferences: Array<any>) => void): void {
    this._userName = userName;

    var url = this.URL + userName;
    var successCallback = (data: Data) => {
      var sortedArray = this.convertPreferenceMapToArray(data.preferences);
      callback(sortedArray);
    };
    var failCallback = (errorThrown) => {
      UserNotification.error(
        "用户\"" + userName + "\"的偏好加载失败：" + errorThrown + "。请尝试重新加载页面",
        "无法从服务器获取用户偏好");
    };
    fetch('GET', url).then(successCallback, failCallback);
  }
};

export = PreferencesStore;
