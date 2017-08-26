import React, {PropTypes} from 'react';
import Reflux from 'reflux';

import PageHeader from 'components/common/PageHeader';
import Spinner from 'components/common/Spinner';
import ExportExtractors from 'components/extractors/ExportExtractors';

import ActionsProvider from 'injection/ActionsProvider';
const InputsActions = ActionsProvider.getActions('Inputs');

import StoreProvider from 'injection/StoreProvider';
const InputsStore = StoreProvider.getStore('Inputs');

const ExportExtractorsPage = React.createClass({
  propTypes: {
    params: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(InputsStore)],
  getInitialState() {
    return {
      input: undefined,
    };
  },
  componentDidMount() {
    InputsActions.get.triggerPromise(this.props.params.inputId);
  },
  _isLoading() {
    return !this.state.input;
  },
  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }

    return (
      <div>
        <PageHeader title={<span>为<em>{this.state.input.title}</em>导出提取器</span>}>
          <span>
			输入值的提取器可以以JSON格式的形式被导出并被其他的系统导入。
          </span>
        </PageHeader>
        <ExportExtractors input={this.state.input}/>
      </div>
    );
  },
});

export default ExportExtractorsPage;
