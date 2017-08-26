import React, {PropTypes} from 'react';
import InputDropdown from 'components/inputs/InputDropdown';
import UserNotification from 'util/UserNotification';

import StoreProvider from 'injection/StoreProvider';
const UniversalSearchStore = StoreProvider.getStore('UniversalSearch');

const RecentMessageLoader = React.createClass({
  propTypes: {
    inputs: PropTypes.object,
    onMessageLoaded: PropTypes.func.isRequired,
    selectedInputId: PropTypes.string,
  },
  onClick(inputId) {
    const input = this.props.inputs.get(inputId);
    if (!input) {
      UserNotification.error('选择了无效的输入: ' + inputId,
        '无法从无效输入中加载消息 ' + inputId);
    }
    UniversalSearchStore.search('relative', 'gl2_source_input:' + inputId + ' OR gl2_source_radio_input:' + inputId, { range: 0 }, undefined, 1, undefined, undefined)
      .then((response) => {
        if (response.total_results > 0) {
          this.props.onMessageLoaded(response.messages[0]);
        } else {
          UserNotification.error('输入没有返回最近的消息。');
          this.props.onMessageLoaded(undefined);
        }
      });
  },
  render() {
    let helpMessage;
    if (this.props.selectedInputId) {
      helpMessage = '点击“加载消息”从这个输入中加载最新消息。';
    } else {
      helpMessage = '从下面的列表中选择一个输入，然后单击“加载消息”来加载该输入的最新消息。';
    }
    return (
      <div style={{marginTop: 5}}>
        {helpMessage}
        <InputDropdown inputs={this.props.inputs} preselectedInputId={this.props.selectedInputId} onLoadMessage={this.onClick} title="加载消息"/>
      </div>
    );
  },
});

export default RecentMessageLoader;
