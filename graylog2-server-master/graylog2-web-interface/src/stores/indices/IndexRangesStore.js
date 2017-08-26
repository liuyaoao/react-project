import Reflux from 'reflux';

import UserNotification from 'util/UserNotification';
import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';

import ActionsProvider from 'injection/ActionsProvider';
const IndexRangesActions = ActionsProvider.getActions('IndexRanges');

const IndexRangesStore = Reflux.createStore({
  listenables: [IndexRangesActions],
  indexRanges: undefined,

  getInitialState() {
    return { indexRanges: this.indexRanges };
  },
  init() {
    IndexRangesActions.list();
  },
  list() {
    const url = URLUtils.qualifyUrl(ApiRoutes.IndexRangesApiController.list().url);
    const promise = fetch('GET', url).then((response) => {
      this.indexRanges = response.ranges;

      this.trigger(this.getInitialState());
    });

    IndexRangesActions.list.promise(promise);
  },
  recalculate() {
    const url = URLUtils.qualifyUrl(ApiRoutes.IndexRangesApiController.rebuild().url);
    const promise = fetch ('POST', url);
    promise
      .then(UserNotification.success('指数范围将马上重新计算'))
      .catch((error) => {
        UserNotification.error(`无法创建开始重新计算指标范围的工作，原因: ${error}`,
          '错误的起始再计算指标范围');
      });

    IndexRangesActions.recalculate.promise(promise);
  },
  recalculateIndex(indexName) {
    const url = URLUtils.qualifyUrl(ApiRoutes.IndexRangesApiController.rebuildSingle(indexName).url);
    const promise = fetch ('POST', url);
    promise
      .then(UserNotification.success(`${indexName}指数范围将马上重新计算`))
      .catch((error) => {
        UserNotification.error(`无法创建工作为${indexName}的起始指标范围计算，原因: ${error}`,
          `错误的起始再计算指标范围${indexName}`);
      });

    IndexRangesActions.recalculateIndex.promise(promise);
  },
});

export default IndexRangesStore;
