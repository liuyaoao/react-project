import React, {PropTypes} from 'react';
import {Input, Button} from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const ToolsStore = StoreProvider.getStore('Tools');

import ExtractorUtils from 'util/ExtractorUtils';
import FormUtils from 'util/FormsUtils';

const JSONExtractorConfiguration = React.createClass({
  propTypes: {
    configuration: PropTypes.object.isRequired,
    exampleMessage: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onExtractorPreviewLoad: PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      trying: false,
      configuration: this._getEffectiveConfiguration(this.props.configuration),
    };
  },
  componentDidMount() {
    this.props.onChange(this.state.configuration);
  },
  componentWillReceiveProps(nextProps) {
    this.setState({configuration: this._getEffectiveConfiguration(nextProps.configuration)});
  },
  DEFAULT_CONFIGURATION: {list_separator: ', ', key_separator: '_', kv_separator: '='},
  _getEffectiveConfiguration(configuration) {
    return ExtractorUtils.getEffectiveConfiguration(this.DEFAULT_CONFIGURATION, configuration);
  },
  _onChange(key) {
    return (event) => {
      this.props.onExtractorPreviewLoad(undefined);
      const newConfig = this.state.configuration;
      newConfig[key] = FormUtils.getValueFromInput(event.target);
      this.props.onChange(newConfig);
    };
  },
  _onTryClick() {
    this.setState({trying: true});

    const configuration = this.state.configuration;
    //var messagetemp = this.props.exampleMessage;
    //const reg = new RegExp("=","g");
    //messagetemp = messagetemp.replace(reg,":");
    //messagetemp = '{"affected_rows":0,"error_code":0,"error_message":0,"insert_id":0,"iserror":false,"num_fields":0,"num_rows":0}';//正常
    //messagetemp = '{"affected_rows":"0", "error_code":"0", "error_message":"0", "insert_id":"0", "iserror":"false", "num_fields":"0", "num_rows":"0"}';//正常
    //messagetemp = '{"affected_rows":0, "error_code":0, "error_message":, "insert_id":0, "iserror":false, "num_fields":0, "num_rows":0}';//不正常
    //messagetemp = '{"affected_rows":0, "error_code":0, "error_message":"0", "insert_id":0, "iserror":false, "num_fields":0, "num_rows":0}';//正常
    const promise = ToolsStore.testJSON(configuration.flatten, configuration.list_separator,
      configuration.key_separator, configuration.kv_separator, this.props.exampleMessage);
    //const promise = ToolsStore.testJSON(configuration.flatten, configuration.list_separator,
    //  configuration.key_separator, configuration.kv_separator, messagetemp);

    promise.then(result => {
      const matches = [];
      for (const match in result.matches) {
        if (result.matches.hasOwnProperty(match)) {
          matches.push(<dt key={`${match}-name`}>{match}</dt>);
          matches.push(<dd key={`${match}-value`}><samp>{result.matches[match]}</samp></dd>);
        }
      }

      const preview = (matches.length === 0 ? '' : <dl>{matches}</dl>);
      this.props.onExtractorPreviewLoad(preview);
    });

    promise.finally(() => this.setState({trying: false}));
  },
  _isTryButtonDisabled() {
    return this.state.trying || !this.props.exampleMessage;
  },
  render() {
    return (
      <div>
        <Input type="checkbox"
               id="flatten"
               label="平铺结构"
               wrapperClassName="col-md-offset-2 col-md-10"
               defaultChecked={this.state.configuration.flatten}
               onChange={this._onChange('flatten')}
               help="是否把JSON对象平铺至一个单独的消息字段或多个字段。"/>

        <Input type="text"
               id="list_separator"
               label="对象分隔符"
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               defaultValue={this.state.configuration.list_separator}
               required
               onChange={this._onChange('list_separator')}
               help="将JSON列表中的单个对象连接起来的分隔符号（字符串）。"/>

        <Input type="text"
               id="key_separator"
               label="键分隔符"
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               defaultValue={this.state.configuration.key_separator}
               required
               onChange={this._onChange('key_separator')}
               help={<span>将JSON对象中的不同的键连接起来的分隔符（只有<em>不是</em>平铺的时候使用）。</span>}/>

        <Input type="text"
               id="kv_separator"
               label="键/值分隔符"
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               defaultValue={this.state.configuration.kv_separator}
               required
               onChange={this._onChange('kv_separator')}
               help="将JSON对象中的不同的键/值对连接起来的分隔符（只有平铺的时候使用）。"/>

        <Input wrapperClassName="col-md-offset-2 col-md-10">
          <Button bsStyle="info" onClick={this._onTryClick} disabled={this._isTryButtonDisabled()}>
            {this.state.trying ? <i className="fa fa-spin fa-spinner"/> : '试一试'}
          </Button>
        </Input>
      </div>
    );
  },
});

export default JSONExtractorConfiguration;
