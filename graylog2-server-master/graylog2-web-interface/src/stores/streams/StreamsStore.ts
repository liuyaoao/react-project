const UserNotification = require('util/UserNotification');
const URLUtils = require('util/URLUtils');
import ApiRoutes = require('routing/ApiRoutes');
const fetch = require('logic/rest/FetchProvider').default;

interface Stream {
  id: string;
  title: string;
  description: string;
  creatorUser: string;
  createdAt: number;
}

interface TestMatchResponse {
  matches: boolean;
  rules: any;
}

interface Callback {
  (): void;
}

interface StreamSummaryResponse {
  total: number;
  streams: Array<Stream>;
}

class StreamsStore {
  private callbacks: Array<Callback> = [];

  listStreams() {
    const url = "/streams";
    const promise = fetch('GET', URLUtils.qualifyUrl(url))
        .then((result: StreamSummaryResponse) => result.streams)
        .catch((errorThrown) => {
          UserNotification.error("加载流失败! 原因: " + errorThrown,
              "无法加载流");
        });
    return promise;
  }
  load(callback: ((streams: Array<Stream>) => void)) {
    this.listStreams().then(streams => {
      callback(streams);
    });
  }
  get(streamId: string, callback: ((stream: Stream) => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("流加载失败! 原因: " + errorThrown,
        "无法获取流");
    };

    const url = ApiRoutes.StreamsApiController.get(streamId).url;
    fetch('GET', URLUtils.qualifyUrl(url)).then(callback, failCallback);
  }
  remove(streamId: string, callback: (() => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("删除流失败! 原因: " + errorThrown,
        "无法删除流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.delete(streamId).url);
    fetch('DELETE', url).then(callback, failCallback).then(this._emitChange.bind(this));
  }
  pause(streamId: string, callback: (() => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("暂停流失败! 原因: " + errorThrown,
        "无法暂停流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.pause(streamId).url);
    fetch('POST', url).then(callback, failCallback).then(this._emitChange.bind(this));
  }
  resume(streamId: string, callback: (() => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("恢复流失败! 原因: " + errorThrown,
        "无法恢复流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.resume(streamId).url);
    fetch('POST', url)
      .then(callback, failCallback).then(this._emitChange.bind(this));
  }
  save(stream: any, callback: ((streamId: string) => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("保存流失败! 原因: " + errorThrown,
        "不能保存流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.create().url);
    fetch('POST', url, stream)
      .then(callback, failCallback).then(this._emitChange.bind(this));
  }
  update(streamId: string, data: any, callback: (() => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("更新流失败! 原因: " + errorThrown,
        "不能更新流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.update(streamId).url);
    fetch('PUT', url, data)
      .then(callback, failCallback).then(this._emitChange.bind(this));
  }
  cloneStream(streamId: string, data: any, callback: (() => void)) {
    const failCallback = (errorThrown) => {
      UserNotification.error("克隆流失败! 原因: " + errorThrown,
        "无法克隆流");
    };

    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.cloneStream(streamId).url);
    fetch('POST', url, data)
      .then(callback, failCallback).then(this._emitChange.bind(this));
  }
  removeOutput(streamId: string, outputId: string, callback: (errorThrown) => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.StreamOutputsApiController.delete(streamId, outputId).url);

    fetch('DELETE', url).then(callback, (errorThrown) => {
      UserNotification.error("从消息流中删除输出失败! 原因: " + errorThrown,
        "无法从流中删除输出");
    }).then(this._emitChange.bind(this));
  }
  addOutput(streamId: string, outputId: string, callback: (errorThrown) => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.StreamOutputsApiController.add(streamId, outputId).url);
    fetch('POST', url, {outputs: [outputId]}).then(callback, (errorThrown) => {
      UserNotification.error("添加输出到流失败! 原因: " + errorThrown,
        "不能添加输出流");
    }).then(this._emitChange.bind(this));
  }
  testMatch(streamId: string, message: any, callback: (response: TestMatchResponse) => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.StreamsApiController.testMatch(streamId).url);
    fetch('POST', url, message).then(callback, (error) => {
      UserNotification.error("流的测试流规则失败!原因: " + error.message,
        "无法测试流的流规则");
    });
  }
  addReceiver(streamId: string, type: string, entity: string, callback: () => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.StreamAlertsApiController.addReceiver(streamId, type, entity).url);
    fetch('POST', url).then(callback, (error) => {
      UserNotification.error("添加流收到错误的警告: " + error.message,
          "不能添加流警报接收器");
    }).then(this._emitChange.bind(this));
  }
  deleteReceiver(streamId: string, type: string, entity: string, callback: () => void) {
    const url = URLUtils.qualifyUrl(ApiRoutes.StreamAlertsApiController.deleteReceiver(streamId, type, entity).url);
    fetch('DELETE', url).then(callback, (error) => {
      UserNotification.error("删除流收到错误的警告: " + error.message,
          "无法删除流警报接收器");
    }).then(this._emitChange.bind(this));
  }
  sendDummyAlert(streamId: string) {
    const url = URLUtils.qualifyUrl(ApiRoutes.StreamAlertsApiController.sendDummyAlert(streamId).url);
    const promise = fetch('POST', url);
    return promise;
  }
  onChange(callback: Callback) {
    this.callbacks.push(callback);
  }
  _emitChange() {
    this.callbacks.forEach((callback) => callback());
  }
}

const streamsStore = new StreamsStore();
export = streamsStore;
