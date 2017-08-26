import React, {PropTypes} from 'react';
import {Row, Col, Input, Button, FormControls} from 'react-bootstrap';

import ExtractorExampleMessage from './ExtractorExampleMessage';
import EditExtractorConfiguration from './EditExtractorConfiguration';
import EditExtractorConverters from './EditExtractorConverters';

import ActionsProvider from 'injection/ActionsProvider';
const ExtractorsActions = ActionsProvider.getActions('Extractors');

import ExtractorUtils from 'util/ExtractorUtils';
import FormUtils from 'util/FormsUtils';

import StoreProvider from 'injection/StoreProvider';
const ToolsStore = StoreProvider.getStore('Tools');

const EditExtractor = React.createClass({
  propTypes: {
    action: PropTypes.oneOf(['create', 'edit']).isRequired,
    extractor: PropTypes.object.isRequired,
    inputId: PropTypes.string.isRequired,
    exampleMessage: PropTypes.string,
    onSave: PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      updatedExtractor: this.props.extractor,
      conditionTestResult: undefined,
      exampleMessage: this.props.exampleMessage,
      extractorDetails:''
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.exampleMessage !== nextProps.exampleMessage) {
      this._updateExampleMessage(nextProps.exampleMessage);
    }
  },

  _updateExampleMessage(nextExample) {
    this.setState({ exampleMessage: nextExample });
  },

  // Ensures the target field only contains alphanumeric characters and underscores
  _onTargetFieldChange(event) {
    const value = event.target.value;
    const newValue = value.replace(/[^\w\d_]/g, '');

    if (value !== newValue) {
      this.refs.targetField.getInputDOMNode().value = newValue;
    }

    this._onFieldChange('target_field')(event);
  },
  _onFieldChange(key) {
    return (event) => {
      const nextState = {};
      const updatedExtractor = this.state.updatedExtractor;
      updatedExtractor[key] = FormUtils.getValueFromInput(event.target);
      nextState.updatedExtractor = updatedExtractor;

      // Reset result of testing condition after a change in the input
      if (key === 'condition_value') {
        nextState.conditionTestResult = undefined;
      }

      this.setState(nextState);
    };
  },
  _onConfigurationChange(newConfiguration) {
    const updatedExtractor = this.state.updatedExtractor;
    updatedExtractor.extractor_config = newConfiguration;
    this.setState({updatedExtractor: updatedExtractor});
  },
  _onConverterChange(converterType, newConverter) {
    const updatedExtractor = this.state.updatedExtractor;
    const previousConverter = updatedExtractor.converters.filter(converter => converter.type === converterType)[0];

    if (previousConverter) {
      // Remove converter from the list
      const position = updatedExtractor.converters.indexOf(previousConverter);
      updatedExtractor.converters.splice(position, 1);
    }

    if (newConverter) {
      updatedExtractor.converters.push(newConverter);
    }

    this.setState({updatedExtractor: updatedExtractor});
  },
  _testCondition() {
    const promise = ToolsStore.testRegex(this.state.updatedExtractor.condition_value, this.state.exampleMessage);
    promise.then(result => this.setState({conditionTestResult: result.matched}));
  },
  _tryButtonDisabled() {
    return this.state.updatedExtractor.condition_value === '' || !this.state.exampleMessage;
  },
  _getExtractorConditionControls() {
    if (!this.state.updatedExtractor.condition_type || this.state.updatedExtractor.condition_type === 'none') {
      return <div></div>;
    }

    let conditionInputLabel;
    let conditionInputHelp;

    if (this.state.updatedExtractor.condition_type === 'string') {
      conditionInputLabel = '字段包含字符串';
      conditionInputHelp = '为了尝试提取，输入一个该字段能够包含的字符串。';
    } else {
      conditionInputLabel = '字段符合正则表达式';
      conditionInputHelp = '为了尝试提取，输入一个该字段能够包含正则表达式。';
    }

    let inputStyle;
    if (this.state.conditionTestResult === true) {
      inputStyle = 'success';
      conditionInputHelp = '匹配！提取器将在此示例下运行。';
    } else if (this.state.conditionTestResult === false) {
      inputStyle = 'error';
      conditionInputHelp = '不匹配！提取器将不会运行。';
    }

    return (
      <div>
        <Input id="condition_value" label={conditionInputLabel}
               bsStyle={inputStyle}
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               help={conditionInputHelp}>
          <Row className="row-sm">
            <Col md={11}>
              <input type="text" id="condition_value" className="form-control"
                     defaultValue={this.state.updatedExtractor.condition_value}
                     onChange={this._onFieldChange('condition_value')} required/>
            </Col>
            <Col md={1} className="text-right">
              <Button bsStyle="info" onClick={this._testCondition}
                      disabled={this._tryButtonDisabled()}>
                试一试
              </Button>
            </Col>
          </Row>
        </Input>
      </div>
    );
  },
  _saveExtractor(event) {
    console.log("this.state.updatedExtractorthis.state.updatedExtractor--",this.state.updatedExtractor);
    console.log("this.state.updatedExtractorthis.state.updatedExtractor222222--",this.state.updatedExtractor.title);
    console.log("this.props.inputIdthis.props.inputIdthis.props.inputId--",this.state.extractorDetails);
    event.preventDefault();
    // var timestamp = Date.parse(new Date());
    // var s =  Math.random()*100+1;
    // console.log('时间戳：',timestamp);
    // console.log('随机数',timestamp+s);
    // var testData = this.state.updatedExtractor;
    // testData.flog = timestamp+s;

    this.state.updatedExtractor.extractorDetails = this.state.extractorDetails;
    ExtractorsActions.save.triggerPromise(this.props.inputId, this.state.updatedExtractor)
      .then(() => this.props.onSave());
  },
  setExtractorDetails:function(data){
    this.setState({extractorDetails:data});
  },
  render() {
    const conditionTypeHelpMessage = '在指定条件下只从消息中提取能够使您避免错误和不需要的提取以及节省CPU的资源。';

    const cursorStrategyHelpMessage = (
      <span>
		您想要复制或剪切源码？您无法剪切标准字段，比如<em>message</em>和<em>source</em>。
      </span>
    );

    const targetFieldHelpMessage = (
      <span>
		选择一个存储提取值的名字。只能包含<b>字母、数字或下划线</b>。比如：<em>http_response_code</em>。
      </span>
    );

    let storeAsFieldInput;
    // Grok and JSON extractors create their required fields, so no need to add an input for them
    if (this.state.updatedExtractor.type !== ExtractorUtils.ExtractorTypes.GROK && this.state.updatedExtractor.type !== ExtractorUtils.ExtractorTypes.JSON) {
      storeAsFieldInput = (
        <Input type="text" ref="targetField" id="target_field" label="作为字段存储"
               defaultValue={this.state.updatedExtractor.target_field}
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               onChange={this._onTargetFieldChange}
               required
               help={targetFieldHelpMessage} />
      );
    }
    // console.log("this.props.action",this.props.action);
    // alert('11',this.props.action);
    return (
      <div>
        <Row className="content extractor-list">
          <Col md={12}>
            <h2>示例消息</h2>
            <Row style={{marginTop: 5}}>
              <Col md={12}>
                <ExtractorExampleMessage field={this.state.updatedExtractor.source_field}
                                         example={this.state.exampleMessage}
                                         onExampleLoad={this._updateExampleMessage}/>
              </Col>
            </Row>
            <h2>提取器配置</h2>
            <Row>
              <Col md={8}>
                <form className="extractor-form form-horizontal" method="POST" onSubmit={this._saveExtractor}>
                  <FormControls.Static label="提取器类型"
                                       value={ExtractorUtils.getReadableExtractorTypeName(this.state.updatedExtractor.type)}
                                       labelClassName="col-md-2" wrapperClassName="col-md-10"/>
                  <FormControls.Static label="源字段" value={this.state.updatedExtractor.source_field}
                                       labelClassName="col-md-2" wrapperClassName="col-md-10"/>

                  <EditExtractorConfiguration ref="extractorConfiguration"
                                              action={this.props.action}
                                              extractorDetail={this.props.extractor.condition_value}
                                              setExtractorDetails={this.setExtractorDetails}
                                              extractorType={this.state.updatedExtractor.type}
                                              configuration={this.state.updatedExtractor.extractor_config}
                                              onChange={this._onConfigurationChange}
                                              exampleMessage={this.state.exampleMessage}/>

                  <Input label="条件" labelClassName="col-md-2" wrapperClassName="col-md-10"
                         help={conditionTypeHelpMessage}>
                    <div className="radio">
                      <label>
                        <input type="radio" name="condition_type" value="none"
                               onChange={this._onFieldChange('condition_type')}
                               defaultChecked={!this.state.updatedExtractor.condition_type || this.state.updatedExtractor.condition_type === 'none'}/>
                        无条件尝试提取
                      </label>
                    </div>
                    <div className="radio">
                      <label>
                        <input type="radio" name="condition_type" value="string"
                               onChange={this._onFieldChange('condition_type')}
                               defaultChecked={this.state.updatedExtractor.condition_type === 'string'}/>
                        只尝试提取包含字符串的字段
                      </label>
                    </div>
                    <div className="radio">
                      <label>
                        <input type="radio" name="condition_type" value="regex"
                               onChange={this._onFieldChange('condition_type')}
                               defaultChecked={this.state.updatedExtractor.condition_type === 'regex'}/>
                        只尝试提取匹配正则表达式的字段
                      </label>
                    </div>
                  </Input>
                  {this._getExtractorConditionControls()}

                  {storeAsFieldInput}

                  <Input label="提取策略" labelClassName="col-md-2" wrapperClassName="col-md-10"
                         help={cursorStrategyHelpMessage}>
                    <label className="radio-inline">
                      <input type="radio" name="cursor_strategy" value="copy"
                             onChange={this._onFieldChange('cursor_strategy')}
                             defaultChecked={!this.state.updatedExtractor.cursor_strategy || this.state.updatedExtractor.cursor_strategy === 'copy'}/>
                      复制
                    </label>
                    <label className="radio-inline">
                      <input type="radio" name="cursor_strategy" value="cut"
                             onChange={this._onFieldChange('cursor_strategy')}
                             defaultChecked={this.state.updatedExtractor.cursor_strategy === 'cut'}/>
                      剪切
                    </label>
                  </Input>

                  <Input type="text" id="title" label="提取器标题"
                         defaultValue={this.state.updatedExtractor.title}
                         labelClassName="col-md-2"
                         wrapperClassName="col-md-10"
                         onChange={this._onFieldChange('title')}
                         required
                         help="此提取器的一个具有描述性的名字"/>

                  <div style={{marginBottom: 20}}>
                    <EditExtractorConverters extractorType={this.state.updatedExtractor.type}
                                             converters={this.state.updatedExtractor.converters}
                                             onChange={this._onConverterChange}/>
                  </div>

                  <Input wrapperClassName="col-md-offset-2 col-md-10">
                    <Button type="submit" bsStyle="success">
                      {this.props.action === 'create' ? '创建提取器' : '更新提取器'}
                    </Button>
                  </Input>
                </form>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  },
});
//147
export default EditExtractor;
