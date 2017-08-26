/* global ApiRoutes */

import React, { PropTypes } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Routes from 'routing/Routes';

import LoaderTabs from 'components/messageloaders/LoaderTabs';
import MatchingTypeSwitcher from 'components/streams/MatchingTypeSwitcher';
import StreamRuleList from './StreamRuleList';
import StreamRuleForm from './StreamRuleForm';
import Spinner from 'components/common/Spinner';

import StoreProvider from 'injection/StoreProvider';
const StreamsStore = StoreProvider.getStore('Streams');
const StreamRulesStore = StoreProvider.getStore('StreamRules');

const StreamRulesEditor = React.createClass({
  propTypes() {
    return {
      currentUser: PropTypes.object.isRequired,
      streamId: PropTypes.string.isRequired,
      messageId: PropTypes.string,
      index: PropTypes.string,
    };
  },
  componentDidMount() {
    this.loadData();
    StreamsStore.onChange(this.loadData);
    StreamRulesStore.onChange(this.loadData);
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
  getInitialState() {
    return {};
  },
  onMessageLoaded(message) {
    this.setState({message: message});
    if (message !== undefined) {
      StreamsStore.testMatch(this.props.streamId, {message: message.fields}, (resultData) => {
        this.setState({matchData: resultData});
      });
    } else {
      this.setState({matchData: undefined});
    }
  },
  render() {
    const styles = (this.state.matchData ? this._getListClassName(this.state.matchData) : 'info');
    if (this.state.stream && this.state.streamRuleTypes) {
      return (
        <div className="row content">
          <div className="col-md-12 streamrule-sample-message">
            <h2>
              1. 加载一个消息来测试规则
            </h2>

            <div className="stream-loader">
              <LoaderTabs messageId={this.props.messageId} index={this.props.index} onMessageLoaded={this.onMessageLoaded}/>
            </div>

            <div className="spinner" style={{display: 'none'}}><h2><i
              className="fa fa-spinner fa-spin"></i> &nbsp;正在加载信息</h2></div>

            <div className="sample-message-display" style={{display: 'none', marginTop: '5px'}}>
              <strong>下一步:</strong>
              在第二步添加/删除/修改消息流的规则并看看这个例子能否路由到消息流。使用右边的按钮来添加一个消息流规则。
            </div>

            <hr />

            <div className="buttons pull-right">
              <button className="btn btn-success show-stream-rule" onClick={this._onAddStreamRule}>
                添加消息流规则
              </button>
              <StreamRuleForm ref="newStreamRuleForm" title="新的消息流规则"
                              streamRuleTypes={this.state.streamRuleTypes} onSubmit={this._onStreamRuleFormSubmit}/>
            </div>

            <h2>
              2. 管理消息流规则
            </h2>

            {this._explainMatchResult()}

            <MatchingTypeSwitcher stream={this.state.stream} onChange={this.loadData}/>
            <Alert ref="well" bsStyle={styles}>
              <StreamRuleList stream={this.state.stream} streamRuleTypes={this.state.streamRuleTypes}
                              permissions={this.props.currentUser.permissions} matchData={this.state.matchData}/>
            </Alert>

            <p style={{marginTop: '10px'}}>
              <LinkContainer to={Routes.STREAMS}>
                <Button bsStyle="success">我已经完成了!</Button>
              </LinkContainer>
            </p>
          </div>
        </div>
      );
    } else {
      return (<div className="row content"><div style={{marginLeft: 10}}><Spinner/></div></div>);
    }
  },
  loadData() {
    StreamRulesStore.types().then((types) => {
      this.setState({streamRuleTypes: types});
    });

    StreamsStore.get(this.props.streamId, (stream) => {
      this.setState({stream: stream});
    });

    if (this.state.message) {
      this.onMessageLoaded(this.state.message);
    }
  },
  _onStreamRuleFormSubmit(streamRuleId, data) {
    StreamRulesStore.create(this.props.streamId, data, () => {});
  },
  _onAddStreamRule(event) {
    event.preventDefault();
    this.refs.newStreamRuleForm.open();
  },
  _getListClassName(matchData) {
    return (matchData.matches ? '成功' : '危险');
  },
  _explainMatchResult() {
    if (this.state.matchData) {
      if (this.state.matchData.matches) {
        return (
          <span>
            <i className="fa fa-check" style={{'color': 'green'}}/> 此消息将路由到该流。
          </span>);
      } else {
        return (
          <span>
            <i className="fa fa-remove" style={{'color': 'red'}}/> 此消息将不会路由到该流。
          </span>);
      }
    } else {
      return ('请加载一个消息来检查在被路由到该流之前它是否与该流的规则相匹配。');
    }
  },
});

module.exports = StreamRulesEditor;
