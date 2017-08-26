import React, {PropTypes} from 'react';
import Reflux from 'reflux';

import Spinner from 'components/common/Spinner';
import PageHeader from 'components/common/PageHeader';
import DocumentationLink from 'components/support/DocumentationLink';
import EditExtractor from 'components/extractors/EditExtractor';

import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';

import StoreProvider from 'injection/StoreProvider';
const ExtractorsStore = StoreProvider.getStore('Extractors');
const InputsStore = StoreProvider.getStore('Inputs');
const MessagesStore = StoreProvider.getStore('Messages');

import ActionsProvider from 'injection/ActionsProvider';
const InputsActions = ActionsProvider.getActions('Inputs');

const CreateExtractorsPage = React.createClass({
  propTypes: {
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(InputsStore)],
  getInitialState() {
    const { query } = this.props.location;

    return {
      extractor: ExtractorsStore.new(query.extractor_type, query.field),
      input: undefined,
      exampleMessage: undefined,
      extractorType: query.extractor_type,
      field: query.field,
      exampleIndex: query.example_index,
      exampleId: query.example_id,
    };
  },
  componentDidMount() {
    InputsActions.get.triggerPromise(this.props.params.inputId);
    MessagesStore.loadMessage(this.state.exampleIndex, this.state.exampleId)
      .then(message => this.setState({exampleMessage: message}));
  },
  _isLoading() {
    return !(this.state.input && this.state.exampleMessage);
  },
  _extractorSaved() {
    let url;
    if (this.state.input.global) {
      url = Routes.global_input_extractors(this.props.params.inputId);
    } else {
      url = Routes.local_input_extractors(this.props.params.nodeId, this.props.params.inputId);
    }

    this.props.history.pushState(null, url);
  },
  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }

    return (
      <div>
        <PageHeader title={<span>为输入日志 <em>{this.state.input.title}</em> 创建新的提取器</span>}>
          <span>
						提取器应用于此输入值接收的任何消息。使用提取器来提取和转义任何文本信息至指定字段，以便您以后更方便地过滤和分析它们。
          </span>

        </PageHeader>
        <EditExtractor action="create"
                       extractor={this.state.extractor}
                       inputId={this.state.input.id}
                       exampleMessage={this.state.exampleMessage.fields[this.state.field]}
                       onSave={this._extractorSaved}/>
      </div>
    );
  },
});

export default CreateExtractorsPage;
