import React, {PropTypes} from 'react';
import {Row, Col, Input, Button, Panel} from 'react-bootstrap';
import {Select} from 'components/common';

import {
  CSVConverterConfiguration,
  DateConverterConfiguration,
  FlexdateConverterConfiguration,
  HashConverterConfiguration,
  IpAnonymizerConverterConfiguration,
  LowercaseConverterConfiguration,
  NumericConverterConfiguration,
  SplitAndCountConverterConfiguration,
  SyslogPriFacilityConverterConfiguration,
  SyslogPriLevelConverterConfiguration,
  TokenizerConverterConfiguration,
  UppercaseConverterConfiguration,
} from 'components/extractors/converters_configuration';

import ExtractorUtils from 'util/ExtractorUtils';

const EditExtractorConverters = React.createClass({
  propTypes: {
    extractorType: PropTypes.string.isRequired,
    converters: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      displayedConverters: this.props.converters.map(converter => converter.type),
      disabledConverters: {}, // Keep disabled converters configuration, so the user doesn't need to type it again
      selectedConverter: undefined,
    };
  },
  _onConverterSelect(newValue) {
    this.setState({selectedConverter: newValue});
  },
  _onConverterAdd() {
    const newDisplayedConverters = this.state.displayedConverters;
    newDisplayedConverters.push(this.state.selectedConverter);
    this.setState({selectedConverter: undefined, converters: newDisplayedConverters});
  },
  _onConverterChange(converterType, converter) {
    if (converter) {
      const newDisabledConverters = this.state.disabledConverters;
      if (newDisabledConverters.hasOwnProperty(converterType)) {
        delete newDisabledConverters[converterType];
        this.setState({disabledConverters: newDisabledConverters});
      }
    } else {
      const newDisabledConverters = this.state.disabledConverters;
      newDisabledConverters[converterType] = this._getConverterByType(converterType);
      this.setState({disabledConverters: newDisabledConverters});
    }

    this.props.onChange(converterType, converter);
  },
  _getConverterOptions() {
    const converterOptions = [];
    Object.keys(ExtractorUtils.ConverterTypes).forEach(converterType => {
      const type = ExtractorUtils.ConverterTypes[converterType];
      const disabled = this.state.displayedConverters.indexOf(type) !== -1;
      converterOptions.push({
        value: type,
        label: ExtractorUtils.getReadableConverterTypeName(type),
        disabled: disabled,
      });
    });

    return converterOptions;
  },
  _getConverterByType(converterType) {
    const currentConverter = this.props.converters.filter(converter => converter.type === converterType)[0];
    return (currentConverter ? currentConverter.config : {});
  },
  _getConvertersConfiguration() {
    const controls = this.state.displayedConverters.map(converterType => {
      // Get converter configuration from disabledConverters if it was disabled
      let converterConfig = this._getConverterByType(converterType);
      if (Object.keys(converterConfig).length === 0 && this.state.disabledConverters.hasOwnProperty(converterType)) {
        converterConfig = this.state.disabledConverters[converterType];
      }

      switch (converterType) {
      case ExtractorUtils.ConverterTypes.NUMERIC:
        return (
          <NumericConverterConfiguration key={converterType}
                                         type={converterType}
                                         configuration={converterConfig}
                                         onChange={this._onConverterChange}/>
        );
      case ExtractorUtils.ConverterTypes.DATE:
        return (
          <DateConverterConfiguration key={converterType}
                                      type={converterType}
                                      configuration={converterConfig}
                                      onChange={this._onConverterChange}/>
        );
      case ExtractorUtils.ConverterTypes.HASH:
        return (
          <HashConverterConfiguration key={converterType}
                                      type={converterType}
                                      configuration={converterConfig}
                                      onChange={this._onConverterChange}/>
        );
      case ExtractorUtils.ConverterTypes.SPLIT_AND_COUNT:
        return (
          <SplitAndCountConverterConfiguration key={converterType}
                                               type={converterType}
                                               configuration={converterConfig}
                                               onChange={this._onConverterChange}/>
        );
      case ExtractorUtils.ConverterTypes.IP_ANONYMIZER:
        return (
          <IpAnonymizerConverterConfiguration key={converterType}
                                              type={converterType}
                                              configuration={converterConfig}
                                              onChange={this._onConverterChange}/>
        );
      case ExtractorUtils.ConverterTypes.SYSLOG_PRI_LEVEL:
        return (
          <SyslogPriLevelConverterConfiguration key={converterType}
                                                type={converterType}
                                                configuration={converterConfig}
                                                onChange={this._onConverterChange}/>
        );
      case ExtractorUtils.ConverterTypes.SYSLOG_PRI_FACILITY:
        return (
          <SyslogPriFacilityConverterConfiguration key={converterType}
                                                   type={converterType}
                                                   configuration={converterConfig}
                                                   onChange={this._onConverterChange}/>
        );
      case ExtractorUtils.ConverterTypes.TOKENIZER:
        return (
          <TokenizerConverterConfiguration key={converterType}
                                           type={converterType}
                                           configuration={converterConfig}
                                           onChange={this._onConverterChange}/>
        );
      case ExtractorUtils.ConverterTypes.CSV:
        return (
          <CSVConverterConfiguration key={converterType}
                                     type={converterType}
                                     configuration={converterConfig}
                                     onChange={this._onConverterChange}/>
        );
      case ExtractorUtils.ConverterTypes.LOWERCASE:
        return (
          <LowercaseConverterConfiguration key={converterType}
                                           type={converterType}
                                           configuration={converterConfig}
                                           onChange={this._onConverterChange}/>
        );
      case ExtractorUtils.ConverterTypes.UPPERCASE:
        return (
          <UppercaseConverterConfiguration key={converterType}
                                           type={converterType}
                                           configuration={converterConfig}
                                           onChange={this._onConverterChange}/>
        );
      case ExtractorUtils.ConverterTypes.FLEXDATE:
        return (
          <FlexdateConverterConfiguration key={converterType}
                                          type={converterType}
                                          configuration={converterConfig}
                                          onChange={this._onConverterChange}/>
        );
      default:
        console.warn(`Converter type ${converterType} is not supported.`);
      }
    });

    return controls;
  },
  render() {
    if (this.props.extractorType === ExtractorUtils.ExtractorTypes.GROK || this.props.extractorType === ExtractorUtils.ExtractorTypes.JSON) {
      return (
        <div className="form-group">
          <div className="col-md-offset-2 col-md-10">
            <Panel bsStyle="info" style={{marginBottom: 0}}>
              无法为{' '}
              <em>{ExtractorUtils.getReadableExtractorTypeName(this.props.extractorType)}</em> 提取器添加转换器.
            </Panel>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Input id="add-converter"
               label="添加转换器"
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               help="添加一个用来转义提取值的转换器">
          <Row className="row-sm">
            <Col md={11}>
              <Select ref="addConverter"
                      id="add-converter"
                      placeholder="选择一个转换器"
                      options={this._getConverterOptions()}
                      value={this.state.selectedConverter}
                      onChange={this._onConverterSelect}/>
            </Col>
            <Col md={1} className="text-right">
              <Button bsStyle="info" onClick={this._onConverterAdd} disabled={!this.state.selectedConverter}>
                添加
              </Button>
            </Col>
          </Row>
        </Input>

        {this._getConvertersConfiguration()}
      </div>
    );
  },
});

export default EditExtractorConverters;
