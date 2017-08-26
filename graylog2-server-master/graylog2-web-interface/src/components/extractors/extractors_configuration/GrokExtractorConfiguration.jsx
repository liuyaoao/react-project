import React, {PropTypes} from 'react';
import {Row, Col, Input, Button} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

import Routes from 'routing/Routes';
import UserNotification from 'util/UserNotification';
import FormUtils from 'util/FormsUtils';

import StoreProvider from 'injection/StoreProvider';
const ToolsStore = StoreProvider.getStore('Tools');

const GrokExtractorConfiguration = React.createClass({
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
  // _onChange(key) {
  //   return (event) => {
  //     this.props.onExtractorPreviewLoad(undefined);
  //     const newConfig = this.props.configuration;
  //     newConfig[key] = FormUtils.getValueFromInput(event.target);
  //     this.props.onChange(newConfig);
  //   };
  // },
  _onChange() {
    return (event) => {
      this.props.onExtractorPreviewLoad(undefined);
    };
  },
  _onBlur(key){
    return (event) => {
      const newConfig = this.props.configuration;
      newConfig[key] = FormUtils.getValueFromInput(event.target);
      this.props.onChange(newConfig);
    };
  },
  _onTryClick() {
    this.setState({trying: true});

    const promise = ToolsStore.testGrok(this.props.configuration.grok_pattern, this.props.exampleMessage);
    promise.then(result => {
      if (!result.matched) {
        UserNotification.warning('我们无法执行这个Grok表达式。请检查您的参数。');
        return;
      }

      const matches = [];
      result.matches.map(match => {
        matches.push(<dt key={`${match.name}-name`}>{match.name}</dt>);
        matches.push(<dd key={`${match.name}-value`}><samp>{match.match}</samp></dd>);
      });

      const preview = (matches.length === 0 ? '' : <dl>{matches}</dl>);
      this.props.onExtractorPreviewLoad(preview);
    });

    promise.finally(() => this.setState({trying: false}));
  },
  _isTryButtonDisabled() {
    return this.state.trying || !this.props.configuration.grok_pattern || !this.props.exampleMessage;
  },
  _editGrok:function(){//wei
    $('#grokExtractorConfigurationAddModel').modal('show');
  },
  componentWillMount:function(){
    if(this.props.action=='edit'){
      this._onTryClick();
    }
  },
  render() {
    const helpMessage = (
      <span>
			根据当前的Grok表达式列表匹配字段，使用<b>{'%{PATTERN-NAME}'}</b>对应一个<LinkContainer to={Routes.SYSTEM.GROKPATTERNS}><a>已被排序的表达式</a></LinkContainer>。
        </span>
    );
    //wei
   var grok_pattern_value = '';
   if(this.props.configuration.grok_pattern){
     grok_pattern_value = this.props.configuration.grok_pattern;
   }
   $("#grok_pattern").val(grok_pattern_value);
  //  console.log('action----------------------->>>',this.props.action);
  //  alert('22'+this.props.action);
    return (
      <div>
        <Input id="grok_pattern"
               label="Grok匹配表达式"
               labelClassName="col-md-2"
               wrapperClassName="col-md-10"
               help={helpMessage}>
          <Row className="row-sm">
            <Col md={10}>
              <input type="text" id="grok_pattern" className="form-control"
                     defaultValue={this.props.configuration.grok_pattern}
                     onChange={this._onChange}
                     onBlur={this._onBlur("grok_pattern")}
                     required/>
            </Col>
            <Col md={1} className="text-right">
              <input className='btn btn-success' type='button' value='编辑' onClick={this._editGrok}/>
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

export default GrokExtractorConfiguration;
