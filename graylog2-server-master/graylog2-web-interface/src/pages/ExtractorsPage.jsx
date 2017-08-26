import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import {DropdownButton, MenuItem} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import PageHeader from 'components/common/PageHeader';
import ExtractorsList from 'components/extractors/ExtractorsList';
import Spinner from 'components/common/Spinner';
import DocumentationLink from 'components/support/DocumentationLink';

import Routes from 'routing/Routes';
import DocsHelper from 'util/DocsHelper';

import ActionsProvider from 'injection/ActionsProvider';
const NodesActions = ActionsProvider.getActions('Nodes');
const InputsActions = ActionsProvider.getActions('Inputs');

import StoreProvider from 'injection/StoreProvider';
const NodesStore = StoreProvider.getStore('Nodes');
const InputsStore = StoreProvider.getStore('Inputs');

const ExtractorsPage = React.createClass({
  propTypes: {
    params: PropTypes.object.isRequired,
  },
  mixins: [Reflux.connect(InputsStore), Reflux.listenTo(NodesStore, 'onNodesChange')],
  getInitialState() {
    return {
      input: undefined,
      node: undefined,
    };
  },
  componentDidMount() {
    InputsActions.get.triggerPromise(this.props.params.inputId);
    NodesActions.list.triggerPromise();
  },
  onNodesChange(nodes) {
    let inputNode;
    if (this.props.params.nodeId) {
      inputNode = nodes.nodes[this.props.params.nodeId];
    } else {
      const nodeIds = Object.keys(nodes.nodes);
      for (let i = 0; i < nodeIds.length && !inputNode; i++) {
        const tempNode = nodes.nodes[nodeIds[i]];
        if (tempNode.is_master) {
          inputNode = tempNode;
        }
      }
    }

    if (!this.state.node || this.state.node.node_id !== inputNode.node_id) {
      this.setState({ node: inputNode });
    }
  },
  _isLoading() {
    return !(this.state.input && this.state.node);
  },
  render() {
    if (this._isLoading()) {
      return <Spinner/>;
    }

    return (
      <div>
        <PageHeader title={<span><em>{this.state.input.title}</em>的提取器</span>}>
          <span>
			提取器应用于此输入值接收的任何消息。使用提取器来提取和转义任何文本信息至指定字段，以便您以后更方便地过滤和分析它们。{' '}
			比如：从一个日志消息中提起提取HTTP请求代码，将其转义为一个数字字段，并且在此消息中赋予它一个名为<em>http_response_code</em>的值。
          </span>

          <DropdownButton bsStyle="info" bsSize="large" id="extractor-actions-dropdown" title="操作" pullRight>
            <LinkContainer to={Routes.import_extractors(this.state.node.node_id, this.state.input.id)}>
              <MenuItem>导入提取器</MenuItem>
            </LinkContainer>
            <LinkContainer to={Routes.export_extractors(this.state.node.node_id, this.state.input.id)}>
              <MenuItem>导出提取器</MenuItem>
            </LinkContainer>
          </DropdownButton>
        </PageHeader>
        <ExtractorsList input={this.state.input} node={this.state.node} />
      </div>
    );
  },
});

export default ExtractorsPage;
