const UserNotification = require("util/UserNotification");
const URLUtils = require('util/URLUtils');

const fetch = require('logic/rest/FetchProvider').default;

interface GrokPattern {
  id: string;
  name: string;
  pattern: string;
}

const GrokPatternsStore = {
  URL: URLUtils.qualifyUrl('/system/grok'),

  loadPatterns(callback: (patterns: Array<GrokPattern>) => void) {
    var failCallback = (error) => {
      UserNotification.error("加载Grok表达式失败：" + error.message,
        "无法加载Grok表达式");
    };
    // get the current list of patterns and sort it by name
    fetch('GET', this.URL).then((resp: any) => {
      const patterns = resp.patterns;
      patterns.sort((pattern1: GrokPattern, pattern2: GrokPattern) => {
        return pattern1.name.toLowerCase().localeCompare(pattern2.name.toLowerCase());
      });
      callback(patterns);
    }, failCallback);
  },

  savePattern(pattern: GrokPattern, callback: () => void) {
    var failCallback = (error) => {
      UserNotification.error("保存Grok表达式 \"" + pattern.name + "\" 失败：" + error.message,
        "无法保存Grok表达式");
    };

    const requestPatterb = {
      id: pattern.id,
      pattern: pattern.pattern,
      name: pattern.name,
      'content_pack': pattern['content_pack'],
    };

    let url = this.URL;
    let method;
    if (pattern.id === "") {
      method = 'POST';
    } else {
      url += '/' + pattern.id;
      method = 'PUT';
    }
    fetch(method, url, requestPatterb).then(() => {
      callback();
      var action = pattern.id === "" ? "创建" : "更新";
      var message = "Grok表达式 \"" + pattern.name + "\" " + action + "成功" ;
      UserNotification.success(message);
    }).catch(failCallback);
  },

  deletePattern(pattern: GrokPattern, callback: () => void) {
    var failCallback = (error) => {
      UserNotification.error("删除Grok表达式 \"" + pattern.name + "\" 失败：" + error.message,
        "无法删除Grok表达式");
    };
    fetch('DELETE', this.URL + "/" + pattern.id).then(() => {
      callback();
      UserNotification.success("Grok表达式 \"" + pattern.name + "\" 删除成功");
    }).catch(failCallback);
  },

  bulkImport(patterns: string[], replaceAll: boolean) {
    var failCallback = (error) => {
      UserNotification.error("导入Grok表达式文件失败：" + error.message,
        "无法加载Grok表达式");
    };

    const promise = fetch('PUT', this.URL, {patterns: patterns});

    promise.catch(failCallback);

    return promise;
  },
};

module.exports = GrokPatternsStore;
