import React, { PropTypes } from 'react';
import { connect } from 'react-redux'
import StreamThroughput from './StreamThroughput';
import StreamControls from './StreamControls';
import StreamStateBadge from './StreamStateBadge';
import CollapsibleStreamRuleList from 'components/streamrules/CollapsibleStreamRuleList';
import PermissionsMixin from 'util/PermissionsMixin';

import StoreProvider from 'injection/StoreProvider';
const StreamsStore = StoreProvider.getStore('Streams');
const StreamRulesStore = StoreProvider.getStore('StreamRules');

import StreamRuleForm from 'components/streamrules/StreamRuleForm';
import UserNotification from 'util/UserNotification';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Routes from 'routing/Routes';

var ReactRouter = require('react-router');
var History = ReactRouter.History;
import * as networkAction from '../../itoss/actions/networkTopology_action';
// import * as navActions from '../../itoss/actions/navbar_action';
// import { translate, Interpolate } from 'react-i18next';

const Stream = React.createClass({
  propTypes() {
    return {
      stream: PropTypes.object.isRequired,
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
      streamRuleTypes: PropTypes.array.isRequired,
      user: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired,
    };
  },
  mixins: [History,PermissionsMixin],
  render() {
    const stream = this.props.stream;
    const permissions = this.props.permissions;

    let editRulesLink;
    let manageOutputsLink;
    let manageAlertsLink;
    if (this.isPermitted(permissions, ['streams:edit:' + stream.id])) {
      editRulesLink = (
        <LinkContainer to={Routes.stream_edit(stream.id)}>
          <Button bsStyle="info">修改规则</Button>
        </LinkContainer>
      );
      manageAlertsLink = (
        <LinkContainer to={Routes.stream_alerts(stream.id)}>
          <Button bsStyle="info">管理报警</Button>
        </LinkContainer>
      );

      if (this.isPermitted(permissions, ['stream_outputs:read'])) {
        manageOutputsLink = (
          <LinkContainer to={Routes.stream_outputs(stream.id)}>
            <Button bsStyle="info">管理输出</Button>
          </LinkContainer>
        );
      }
    }

    let toggleStreamLink;
    if (this.isAnyPermitted(permissions, ['streams:changestate:' + stream.id, 'streams:edit:' + stream.id])) {
      if (stream.disabled) {
        toggleStreamLink = (
          <a className="btn btn-success toggle-stream-button" onClick={this._onResume}>启动消息流</a>
        );
      } else {
        toggleStreamLink = (
          <a className="btn btn-primary toggle-stream-button" onClick={this._onPause}>暂停消息流</a>
        );
      }
    }
    // let toggleRealTimeStreamLink = (
    //   <a className="btn btn-success toggle-stream-button" onClick={this._onShowRealTimeStream}>实时消息流</a>
    // );

    const createdFromContentPack = (stream.content_pack ?
      <i className="fa fa-cube" title="从内容包中创建"></i> : null);

    return (
      <li className="stream">
        <h2>
          <LinkContainer to={Routes.stream_search(stream.id)}>
            <a>{stream.title}</a>
          </LinkContainer>

          <StreamStateBadge stream={stream} onClick={this._onResume}/>
        </h2>

        <div className="stream-data">
          <div className="stream-actions pull-right">
            {editRulesLink}{' '}
            {manageOutputsLink}{' '}
            {manageAlertsLink}{' '}
            <LinkContainer to={Routes.REALTIMESTREAMS}>
              <Button bsStyle="success" style={{fontSize:"12px", fontFamily:"inherit", border:"1px solid transparent"}} onClick={this._onRealTimeStream}>实时消息</Button>
            </LinkContainer>{' '}
            {toggleStreamLink}{' '}

            <StreamControls stream={stream} permissions={this.props.permissions} user={this.props.user}
                            onDelete={this._onDelete} onUpdate={this._onUpdate} onClone={this._onClone}
                            onQuickAdd={this._onQuickAdd}/>
          </div>
          <div className="stream-description">
            {createdFromContentPack}

            {stream.description}
          </div>
          <div className="stream-metadata">
            <StreamThroughput streamId={stream.id}/>

            , {this._formatNumberOfStreamRules(stream)}

            <CollapsibleStreamRuleList key={'streamRules-' + stream.id} stream={stream}
                                       streamRuleTypes={this.props.streamRuleTypes}
                                       permissions={this.props.permissions}/>
          </div>
        </div>
        <StreamRuleForm ref="quickAddStreamRuleForm" title="新的消息流规则" onSubmit={this._onSaveStreamRule}
                        streamRuleTypes={this.props.streamRuleTypes}/>
      </li>
    );
  },
  _formatNumberOfStreamRules(stream) {
    let verbalMatchingType;
    switch (stream.matching_type) {
    case 'OR': verbalMatchingType = '至少一条'; break;
      default:
      case 'AND': verbalMatchingType = '全部'; break;
    }
    return (stream.rules.length > 0 ?
      '必须符合' + verbalMatchingType + '的' + stream.rules.length + '条消息流规则' : '没有配置规则。');
  },
  _onDelete(stream) {
    if (window.confirm('你真的想要移除这条消息流吗？')) {
      StreamsStore.remove(stream.id, () => UserNotification.success('消息流\'' + stream.title + '\'已成功删除', '成功'));
    }
  },
  _onResume() {
    StreamsStore.resume(this.props.stream.id, () => {
    });
  },
  _onUpdate(streamId, stream) {
    StreamsStore.update(streamId, stream, () => UserNotification.success('消息流\'' + stream.title + '\'已成功修改', '成功'));
  },
  _onClone(streamId, stream) {
    StreamsStore.cloneStream(streamId, stream, () => UserNotification.success('消息流已成功克隆为\'' + stream.title + '\'。', '成功'));
  },
  _onPause() {
    if (window.confirm('你真的想要暂停消息流\'' + this.props.stream.title + '\'吗？')) {
      StreamsStore.pause(this.props.stream.id, () => {
      });
    }
  },
  _onQuickAdd() {
    this.refs.quickAddStreamRuleForm.open();
  },
  _onSaveStreamRule(streamRuleId, streamRule) {
    StreamRulesStore.create(this.props.stream.id, streamRule, () => UserNotification.success('消息流规则已成功创建。', '成功'));
  },
  // _onShowRealTimeStream(){
  //   //stream.id 流ID
  //   // const { t,dispatch } = this.props;
  //   // dispatch(navActions.setCurName(t('newNavbar.networkMessageFlow')));
  //   this.history.pushState(null,`/networkTopology/messageFlow/${this.props.stream.id}`, null);
  // },
  _onRealTimeStream() {
    const { dispatch } = this.props;
    dispatch(networkAction.set_streamId(this.props.stream.id));
  }
});

// export default Stream;
Stream.propTypes = {
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  // const { streamId } = state.networkTopologyReducer

  return {
    // streamId
  }
}

export default connect(mapStateToProps)(Stream)
