import React, {PropTypes} from 'react';
import {Row, Col, Input, Button} from 'react-bootstrap';

import DocumentationLink from 'components/support/DocumentationLink';
import DocsHelper from 'util/DocsHelper';

import UserNotification from 'util/UserNotification';
import FormUtils from 'util/FormsUtils';

import StoreProvider from 'injection/StoreProvider';
const ToolsStore = StoreProvider.getStore('Tools');

const RegexExtractorConfiguration = React.createClass({
  propTypes: {
    configuration: PropTypes.object.isRequired,
    exampleMessage: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onExtractorPreviewLoad: PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      trying: false,
    };
  },
  _onChange(key) {
    return (event) => {
      this.props.onExtractorPreviewLoad(undefined);
      const newConfig = this.props.configuration;
      newConfig[key] = FormUtils.getValueFromInput(event.target);
      this.props.onChange(newConfig);
    };
  },
  _onTryClick() {
    this.setState({trying: true});

    const promise = ToolsStore.testRegex(this.props.configuration.regex_value, this.props.exampleMessage);
    promise.then(result => {
      if (!result.matched) {
        UserNotification.warning('正则表达式不匹配。');
        return;
      }

      if (!result.match) {
        UserNotification.warning('正则表达式在提取器中不包含任何匹配器组。');
        return;
      }

      const preview = (result.match.match ? <samp>{result.match.match}</samp> : '');
      this.props.onExtractorPreviewLoad(preview);
    });

    promise.finally(() => this.setState({trying: false}));
  },
  _isTryButtonDisabled() {
    return this.state.trying || !this.props.configuration.regex_value || !this.props.exampleMessage;
  },
  render() {
    const helpMessage = (
      <span>
		应用于提取器的正则表达式。使用的是一个组匹配器。
      </span>
    );

    return (
      <div>
        <Input label="正则表达式"
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               help={helpMessage}>
          <Row className="row-sm">
            <Col md={11}>
              <input type="text" id="regex_value" className="form-control"
                     defaultValue={this.props.configuration.regex_value}
                     placeholder="^.*string(.+)$"
                     onChange={this._onChange('regex_value')}
                     required/>
            </Col>
            <Col md={1} className="text-right">
              <Button bsStyle="info" onClick={this._onTryClick} disabled={this._isTryButtonDisabled()}>
                {this.state.trying ? <i className="fa fa-spin fa-spinner"/> : '试一试'}
              </Button>
            </Col>
          </Row>
        </Input>
      </div>
    );
  },
});

export default RegexExtractorConfiguration;
