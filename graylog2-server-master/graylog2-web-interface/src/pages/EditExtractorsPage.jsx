import React, {PropTypes} from 'react';
import Reflux from 'reflux';

import Spinner from 'components/common/Spinner';
import PageHeader from 'components/common/PageHeader';
import DocumentationLink from 'components/support/DocumentationLink';
import EditExtractor from 'components/extractors/EditExtractor';

import DocsHelper from 'util/DocsHelper';
import Routes from 'routing/Routes';

import ActionsProvider from 'injection/ActionsProvider';
const InputsActions = ActionsProvider.getActions('Inputs');
const ExtractorsActions = ActionsProvider.getActions('Extractors');

import StoreProvider from 'injection/StoreProvider';
const ExtractorsStore = StoreProvider.getStore('Extractors');
const InputsStore = StoreProvider.getStore('Inputs');
const UniversalSearchstore = StoreProvider.getStore('UniversalSearch');

const EditExtractorsPage = React.createClass({
  propTypes: {
    params: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(ExtractorsStore), Reflux.connect(InputsStore)],
  getInitialState() {
    return {
      extractor: undefined,
      input: undefined,
      exampleMessage: undefined,
    };
  },
  componentDidMount() {
    InputsActions.get.triggerPromise(this.props.params.inputId);
    ExtractorsActions.get.triggerPromise(this.props.params.inputId, this.props.params.extractorId);
    UniversalSearchstore.search('relative', 'gl2_source_input:' + this.props.params.inputId + ' OR gl2_source_radio_input:' + this.props.params.inputId, { range: 0 }, undefined, 1)
      .then((response) => {
        if (response.total_results > 0) {
          this.setState({exampleMessage: response.messages[0]});
        } else {
          this.setState({exampleMessage: {}});
        }
      });
  },
  _isLoading() {
    return !(this.state.input && this.state.extractor && this.state.exampleMessage);
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
    // TODO:
    // - Redirect when extractor or input were deleted

    if (this._isLoading()) {
      return <Spinner/>;
    }

    return (
      <div>
        <PageHeader
          title={<span>为输入值 <em>{this.state.input.title}</em> 编辑提取器 <em>{this.state.extractor.title}</em></span>}>
          <span>
						提取器应用于此输入值接收的任何消息。使用提取器来提取和转义任何文本信息至指定字段，以便您以后更方便地过滤和分析它们。
          </span>
        </PageHeader>
        <EditExtractor action="edit"
                       extractor={this.state.extractor}
                       inputId={this.state.input.id}
                       exampleMessage={this.state.exampleMessage.fields ? this.state.exampleMessage.fields[this.state.extractor.source_field] : undefined}
                       onSave={this._extractorSaved}/>
      </div>
    );
  },
});

export default EditExtractorsPage;
