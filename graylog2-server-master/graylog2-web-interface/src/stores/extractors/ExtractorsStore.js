import Reflux from 'reflux';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

import ActionsProvider from 'injection/ActionsProvider';
const ExtractorsActions = ActionsProvider.getActions('Extractors');

import ExtractorUtils from 'util/ExtractorUtils';
import Promise from 'bluebird';

import URLUtils from 'util/URLUtils';
import UserNotification from 'util/UserNotification';

function getExtractorDTO(extractor) {
  const converters = {};
  extractor.converters.forEach(converter => {
    converters[converter.type] = converter.config;
  });

  const conditionValue = extractor.condition_type && extractor.condition_type !== 'none' ? extractor.condition_value : '';

  return {
    title: extractor.title,
    cut_or_copy: extractor.cursor_strategy || 'copy',
    source_field: extractor.source_field,
    target_field: extractor.target_field,
    extractor_type: extractor.type || extractor.extractor_type, // "extractor_type" needed for imports
    extractor_config: extractor.extractor_config,
    converters: converters,
    condition_type: extractor.condition_type || 'none',
    condition_value: conditionValue,
    order: extractor.order,
  };
}

const ExtractorsStore = Reflux.createStore({
  listenables: [ExtractorsActions],
  sourceUrl: '/system/inputs/',
  extractors: undefined,
  extractor: undefined,

  init() {
    this.trigger({extractors: this.extractors, extractor: this.extractor});
  },

  list(inputId) {
    const promise = fetch('GET', URLUtils.qualifyUrl(URLUtils.concatURLPath(this.sourceUrl, inputId, 'extractors')));
    promise.then(response => {
      this.extractors = response.extractors;
      this.trigger({extractors: this.extractors});
    });

    ExtractorsActions.list.promise(promise);
  },

  // Creates an basic extractor object that we can use to create new extractors.
  new(type, field) {
    if (ExtractorUtils.EXTRACTOR_TYPES.indexOf(type) === -1) {
      throw new Error('Invalid extractor type provided: ' + type);
    }

    return {
      type: type,
      source_field: field,
      converters: [],
      extractor_config: {},
      target_field: '',
    };
  },

  get(inputId, extractorId) {
    const promise = fetch('GET', URLUtils.qualifyUrl(URLUtils.concatURLPath(this.sourceUrl, inputId, 'extractors', extractorId)));
    promise.then(response => {
      this.extractor = response;
      this.trigger({extractor: this.extractor});
    });

    ExtractorsActions.get.promise(promise);
  },

  save(inputId, extractor) {
    let promise;

    if (extractor.id) {
      promise = this.update(inputId, extractor, true);
    } else {
      promise = this.create(inputId, extractor, true);
    }

    ExtractorsActions.save.promise(promise);
  },

  _silentExtractorCreate(inputId, extractor) {
    const url = URLUtils.qualifyUrl(ApiRoutes.ExtractorsController.create(inputId).url);
    return fetch('POST', url, getExtractorDTO(extractor));
  },

  create(inputId, extractor, calledFromMethod) {
    const promise = this._silentExtractorCreate(inputId, extractor);
    promise
      .then(() => {
        UserNotification.success(`提取器 ${extractor.title} 创建成功`);
        if (this.extractor) {
          ExtractorsActions.get.triggerPromise(inputId, extractor.id);
        }
      })
      .catch(error => {
        UserNotification.error('创建提取器失败: ' + error,
          '不能创建提取器');
      });

    if (!calledFromMethod) {
      ExtractorsActions.create.promise(promise);
    }
    return promise;
  },

  update(inputId, extractor, calledFromMethod) {
    const url = URLUtils.qualifyUrl(ApiRoutes.ExtractorsController.update(inputId, extractor.id).url);

    const promise = fetch('PUT', url, getExtractorDTO(extractor));
    promise
      .then(() => {
        UserNotification.success(`提取器 "${extractor.title}" 修改成功`);
        if (this.extractor) {
          ExtractorsActions.get.triggerPromise(inputId, extractor.id);
        }
      })
      .catch(error => {
        UserNotification.error('修改提取器失败: ' + error,
          '不能修改提取器');
      });

    if (!calledFromMethod) {
      ExtractorsActions.update.promise(promise);
    }
    return promise;
  },

  delete(inputId, extractor) {
    const url = URLUtils.qualifyUrl(ApiRoutes.ExtractorsController.delete(inputId, extractor.id).url);

    const promise = fetch('DELETE', url);
    promise
      .then(() => {
        UserNotification.success(`提取器 "${extractor.title}" 删除成功`);
        if (this.extractors) {
          ExtractorsActions.list.triggerPromise(inputId);
        }
      })
      .catch(error => {
        UserNotification.error('删除提取器失败: ' + error,
          `不能删除提取器 ${extractor.title}`);
      });

    ExtractorsActions.delete.promise(promise);
  },

  order(inputId, orderedExtractors) {
    const url = URLUtils.qualifyUrl(ApiRoutes.ExtractorsController.order(inputId).url);
    const orderedExtractorsMap = {};
    orderedExtractors.forEach((extractor, idx) => orderedExtractorsMap[idx] = extractor.id);

    const promise = fetch('POST', url, {order: orderedExtractorsMap});
    promise.then(() => {
      UserNotification.success('提取位置更新成功');
      if (this.extractors) {
        ExtractorsActions.list.triggerPromise(inputId);
      }
    });
    promise.catch(error => {
      UserNotification.error('更改提取位置失败: ' + error,
        '无法更新提取位置');
    });

    ExtractorsActions.order.promise(promise);
  },

  import(inputId, extractors) {
    let successfulImports = 0;
    let failedImports = 0;
    const promises = [];

    extractors.forEach((extractor) => {
      const promise = this._silentExtractorCreate(inputId, extractor);
      promise
        .then(() => successfulImports++)
        .catch(() => failedImports++);
      promises.push(promise);
    });

    Promise.settle(promises).then(() => {
      if (failedImports === 0) {
        UserNotification.success(`导入的结果: ${successfulImports} extractor(s) imported.`,
          '导入操作成功');
      } else {
        UserNotification.warning(`导入的结果: ${successfulImports} extractor(s) imported, ${failedImports} error(s).`,
          '导入操作完成');
      }
    });
  },
});

export default ExtractorsStore;
