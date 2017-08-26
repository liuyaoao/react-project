import React from 'react';
import { PropTypes, Component } from 'react';
import { Input } from 'react-bootstrap';

import StoreProvider from 'injection/StoreProvider';
const StreamsStore = StoreProvider.getStore('Streams');

import UserNotification from 'util/UserNotification';

class MatchingTypeSwitcher extends Component {
  static propTypes = {
    stream: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className="streamrule-connector-type-form">
        <div>
          <Input type="radio" label="消息必须符合下列规则"
                 checked={this.props.stream.matching_type === 'AND'} onChange={this.handleTypeChangeToAnd.bind(this)}/>
          <Input type="radio" label="消息必须符合下列规则之一"
                 checked={this.props.stream.matching_type === 'OR'} onChange={this.handleTypeChangeToOr.bind(this)}/>
        </div>
      </div>
    );
  }

  handleTypeChangeToAnd() {
    this.handleTypeChange('AND');
  }

  handleTypeChangeToOr() {
    this.handleTypeChange('OR');
  }

  handleTypeChange(newValue) {
    if (window.confirm('你将要改变规则如何应用到这条流的，你想继续吗？变化立即生效。')) {
      StreamsStore.update(this.props.stream.id, {'matching_type': newValue}, () => {
        this.props.onChange();
        UserNotification.success(`当${newValue === 'AND' ? '所有' : '任一'}规则匹配时，消息将被路由到流中`,
          '成功');
      });
    }
  }
}

export default MatchingTypeSwitcher;
