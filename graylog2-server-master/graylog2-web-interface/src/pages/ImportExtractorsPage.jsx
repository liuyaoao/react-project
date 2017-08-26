import React, {PropTypes} from 'react';
import Reflux from 'reflux';

import PageHeader from 'components/common/PageHeader';
import Spinner from 'components/common/Spinner';
import ImportExtractors from 'components/extractors/ImportExtractors';

import ActionsProvider from 'injection/ActionsProvider';
const InputsActions = ActionsProvider.getActions('Inputs');

import StoreProvider from 'injection/StoreProvider';
const InputsStore = StoreProvider.getStore('Inputs');

const ImportExtractorsPage = React.createClass({
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
    InputsActions.get.triggerPromise(this.props.params.inputId).then(input => this.setState({input: input}));
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
        <PageHeader title={<span>为<em>{this.state.input.title}</em>导入提取器 </span>}> 
          <span>
			导出的提取器可以被导入至一个输入值。您所需要的仅仅是从其他DeepLOG设置中导出的JSON格式的提取器。
          </span>
        </PageHeader>
        <ImportExtractors input={this.state.input}/>
      </div>
    );
  },
});

export default ImportExtractorsPage;
