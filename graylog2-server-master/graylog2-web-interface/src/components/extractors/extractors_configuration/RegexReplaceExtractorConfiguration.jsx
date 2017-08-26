import React, {PropTypes} from 'react';
import {Input, Button} from 'react-bootstrap';

import DocumentationLink from 'components/support/DocumentationLink';
import DocsHelper from 'util/DocsHelper';

import UserNotification from 'util/UserNotification';
import FormUtils from 'util/FormsUtils';

import StoreProvider from 'injection/StoreProvider';
const ToolsStore = StoreProvider.getStore('Tools');

const RegexReplaceExtractorConfiguration = React.createClass({
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

    const configuration = this.props.configuration;
    const promise = ToolsStore.testRegexReplace(configuration.regex, configuration.replacement,
      configuration.replace_all, this.props.exampleMessage);
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
    return this.state.trying || !this.props.configuration.regex || !this.props.configuration.replacement || !this.props.exampleMessage;
  },
  render() {
    const regexHelpMessage = (
      <span>
			提取器使用正则表达式
        </span>
    );

    const replacementHelpMessage = (
      <span>
		替换在匹配文字中被用到。请参考
        <a target="_blank"
           href="https://docs.oracle.com/javase/7/docs/api/java/util/regex/Matcher.html#replaceAll(java.lang.String)">匹配器</a>{' '}
        API文档
      </span>
    );

    return (
      <div>
        <Input type="text"
               id="regex"
               label="正则表达式"
               labelClassName="col-md-2"
               placeholder="^.*string(.+)$"
               onChange={this._onChange('regex')}
               wrapperClassName="col-md-10"
               defaultValue={this.props.configuration.regex}
               required
               help={regexHelpMessage}/>

        <Input type="text"
               id="replacement"
               label="替换"
               labelClassName="col-md-2"
               placeholder="$1"
               onChange={this._onChange('replacement')}
               wrapperClassName="col-md-10"
               defaultValue={this.props.configuration.replacement}
               required
               help={replacementHelpMessage}/>

        <Input type="checkbox"
               id="replace_all"
               label="替换所有的表达式值"
               wrapperClassName="col-md-offset-2 col-md-10"
               defaultChecked={this.props.configuration.replace_all}
               onChange={this._onChange('replace_all')}
               help="是否替换所有的表达式值，或只替换第一个。"/>

        <Input wrapperClassName="col-md-offset-2 col-md-10">
          <Button bsStyle="info" onClick={this._onTryClick} disabled={this._isTryButtonDisabled()}>
            {this.state.trying ? <i className="fa fa-spin fa-spinner"/> : '试一试'}
          </Button>
        </Input>
      </div>
    );
  },
});

export default RegexReplaceExtractorConfiguration;
