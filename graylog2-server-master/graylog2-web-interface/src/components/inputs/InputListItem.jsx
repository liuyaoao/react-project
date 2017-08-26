import React, { PropTypes } from 'react';
import Reflux from 'reflux';
import { Button, DropdownButton, MenuItem, Col, Well } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { EntityListItem, IfPermitted, LinkToNode, Spinner } from 'components/common';

import PermissionsMixin from 'util/PermissionsMixin';
import ApiRoutes from 'routing/ApiRoutes';
import Routes from 'routing/Routes';

import StoreProvider from 'injection/StoreProvider';
const InputTypesStore = StoreProvider.getStore('InputTypes');

import ActionsProvider from 'injection/ActionsProvider';
const InputsActions = ActionsProvider.getActions('Inputs');

import { InputForm, InputStateBadge, InputStateControl, InputStaticFields, InputThroughput, StaticFieldForm } from 'components/inputs';

const InputListItem = React.createClass({
  propTypes: {
    input: PropTypes.object.isRequired,
    currentNode: PropTypes.object.isRequired,
    permissions: PropTypes.array.isRequired,
  },
  mixins: [PermissionsMixin, Reflux.connect(InputTypesStore)],
  componentDidMount() {
    //hover时 dropdown显示
    var hoverTimeout;
    $('.dropdown').hover(function() {
        clearTimeout(hoverTimeout);
        $(this).addClass('open');
    }, function() {
        var $self = $(this);
        hoverTimeout = setTimeout(function() {
            $self.removeClass('open');
        }, 50);
    });
  },
  _deleteInput() {
    if (window.confirm(`您确定要删除输入值 '${this.props.input.title}'吗？`)) {
      InputsActions.delete(this.props.input);
    }
  },

  _openStaticFieldForm() {
    this.refs.staticFieldForm.open();
  },

  _getConfigurationOptions(inputAttributes) {
    const attributes = Object.keys(inputAttributes);
    return attributes.map(attribute => {
      return <li key={`${attribute}-${this.props.input.id}`}>{attribute}: {inputAttributes[attribute]}</li>;
    });
  },
  _editInput() {
    this.refs.configurationForm.open();
  },
  _updateInput(data) {
    InputsActions.update(this.props.input.id, data);
  },
  render() {
    if (!this.state.inputTypes) {
      return <Spinner />;
    }

    const input = this.props.input;
    const definition = this.state.inputDescriptions[input.type];

    const titleSuffix = (
      <span>
        {this.props.input.name}
        &nbsp;
        <InputStateBadge input={this.props.input} />
      </span>
    );

    const actions = [];

    if (this.isPermitted(this.props.permissions, ['searches:relative'])) {
      actions.push(
        <LinkContainer key={`received-messages-${this.props.input.id}`}
                       to={ApiRoutes.SearchController.index(`gl2_source_input:${this.props.input.id}`, 'relative', 28800).url}>
          <Button bsStyle="info">显示接收到的消息</Button>
        </LinkContainer>
      );
    }

    if (this.isPermitted(this.props.permissions, [`inputs:edit:${this.props.input.id}`])) {
      let extractorRoute;

      if (this.props.input.global) {
        extractorRoute = Routes.global_input_extractors(this.props.input.id);
      } else {
        extractorRoute = Routes.local_input_extractors(this.props.currentNode.node_id, this.props.input.id);
      }

      actions.push(
        <LinkContainer key={`manage-extractors-${this.props.input.id}`} to={extractorRoute}>
          <Button bsStyle="info">管理提取器</Button>
        </LinkContainer>
      );

      actions.push(<InputStateControl key={`input-state-control-${this.props.input.id}`} input={this.props.input}/>);
    }

    let showMetricsMenuItem;
    if (!this.props.input.global) {
      showMetricsMenuItem = (
        <LinkContainer to={Routes.filtered_metrics(this.props.input.node, this.props.input.id)}>
          <MenuItem key={`show-metrics-${this.props.input.id}`}>显示程序调用详情</MenuItem>
        </LinkContainer>
      );
    }

    actions.push(
      <DropdownButton key={`more-actions-${this.props.input.id}`}
                      title="更多操作"
                      id={`more-actions-dropdown-${this.props.input.id}`}
                      pullRight>
        <IfPermitted permissions={'inputs:edit:' + this.props.input.id}>
          <MenuItem key={`edit-input-${this.props.input.id}`}
                    onSelect={this._editInput}
                    disabled={definition === undefined}>
            编辑输入值
          </MenuItem>
        </IfPermitted>

        {showMetricsMenuItem}

        <IfPermitted permissions={'inputs:edit:' + this.props.input.id}>
          <MenuItem key={`add-static-field-${this.props.input.id}`} onSelect={this._openStaticFieldForm}>添加静态字段</MenuItem>
        </IfPermitted>

        <IfPermitted permissions="inputs:terminate">
          <MenuItem key={`divider-${this.props.input.id}`} divider/>
        </IfPermitted>
        <IfPermitted permissions="inputs:terminate">
          <MenuItem key={`delete-input-${this.props.input.id}`} onSelect={this._deleteInput}>删除输入值</MenuItem>
        </IfPermitted>
      </DropdownButton>
    );

    let subtitle;

    if (!this.props.input.global && this.props.input.node) {
      subtitle = (
        <span>
          在节点{' '}<LinkToNode nodeId={this.props.input.node}/>{' '}中
        </span>
      );
    }

    const inputForm = definition ?
        <InputForm ref="configurationForm" key={'edit-form-input-' + input.id}
                   globalValue={input.global} nodeValue={input.node}
                   configFields={definition.requested_configuration}
                   title={'编辑输入值 ' + input.title}
                   titleValue={input.title}
                   typeName={input.type} includeTitleField
                   submitAction={this._updateInput} values={input.attributes} /> : null;

    const additionalContent = (
      <div>
        <Col md={8}>
          <Well bsSize="small" className="configuration-well">
            <ul>
              {this._getConfigurationOptions(this.props.input.attributes)}
            </ul>
          </Well>
          <StaticFieldForm ref="staticFieldForm" input={this.props.input}/>
          <InputStaticFields input={this.props.input}/>
        </Col>
        <Col md={4}>
          <InputThroughput input={input} />
        </Col>
        {inputForm}
      </div>
    );

    return (
      <EntityListItem key={`entry-list-${this.props.input.id}`}
                      title={this.props.input.title}
                      titleSuffix={titleSuffix}
                      description={subtitle}
                      createdFromContentPack={!!this.props.input.content_pack}
                      actions={actions}
                      contentRow={additionalContent}/>
    );
  },
});

export default InputListItem;
