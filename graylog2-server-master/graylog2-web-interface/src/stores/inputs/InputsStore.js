import Reflux from 'reflux';

import URLUtils from 'util/URLUtils';
import fetch from 'logic/rest/FetchProvider';
import UserNotification from 'util/UserNotification';

import StoreProvider from 'injection/StoreProvider';
const InputStaticFieldsStore = StoreProvider.getStore('InputStaticFields');

import ActionsProvider from 'injection/ActionsProvider';
const InputsActions = ActionsProvider.getActions('Inputs');

const InputsStore = Reflux.createStore({
  listenables: [InputsActions],
  sourceUrl: '/system/inputs',
  inputs: undefined,
  input: undefined,

  init() {
    this.trigger({inputs: this.inputs, input: this.input});
    this.listenTo(InputStaticFieldsStore, this.list);
  },

  list() {
    const promise = fetch('GET', URLUtils.qualifyUrl(this.sourceUrl));
    promise
      .then(
        response => {
          this.inputs = response.inputs;
          this.trigger({inputs: this.inputs});

          return this.inputs;
        },
        error => {
          UserNotification.error('获取输入失败! 原因: ' + error,
            '无法检索输入');
        });

    InputsActions.list.promise(promise);
  },

  get(inputId) {
    const promise = fetch('GET', URLUtils.qualifyUrl(`${this.sourceUrl}/${inputId}`));

    promise
      .then(
        response => {
          this.input = response;
          this.trigger({input: this.input});

          return this.input;
        },
        error => {
          UserNotification.error(`获取输入的 ${inputId} 失败! 原因: ${error}`,
            '无法检索输入');
        });

    InputsActions.get.promise(promise);
  },

  create(input) {
    console.log('abc-input',URLUtils.qualifyUrl(this.sourceUrl));
    const promise = fetch('POST', URLUtils.qualifyUrl(this.sourceUrl), input);
    promise
      .then(
        () => {
          UserNotification.success(`输入的 '${input.title}' 启动成功`);
          InputsActions.list();
        },
        error => {
          UserNotification.error(`启动输入的 '${input.title}' 失败! 原因: ${error}`,
            '无法启动输入');
        });

    // InputsActions.create.promise(promise);
  },

  delete(input) {
    const inputId = input.id;
    const inputTitle = input.title;

    const promise = fetch('DELETE', URLUtils.qualifyUrl(`${this.sourceUrl}/${inputId}`));
    promise
      .then(
        () => {
          UserNotification.success(`输入的 '${inputTitle}' 删除成功`);
          InputsActions.list();
        },
        error => {
          UserNotification.error(`删除输入的 '${inputTitle}' 失败! 原因: ${error}`,
            '无法删除输入');
        });

    InputsActions.delete.promise(promise);
  },

  update(id, input) {
    const promise = fetch('PUT', URLUtils.qualifyUrl(`${this.sourceUrl}/${id}`), input);
    promise
      .then(
        () => {
          UserNotification.success(`输入的 '${input.title}' 修改成功`);
          InputsActions.list();
        },
        error => {
          UserNotification.error(`修改输入的 '${input.title}' 失败!原因: ${error}`,
            '无法更新输入');
        });

    InputsActions.update.promise(promise);
  },
});

InputsStore.inputsAsMap = (inputsList) => {
  const inputsMap = {};
  inputsList.forEach(input => {
    inputsMap[input.id] = input;
  });
  return inputsMap;
};

export default InputsStore;
