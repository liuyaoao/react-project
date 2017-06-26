import $ from 'jquery';
import React from 'react';
import myWebClient from 'client/my_web_client.jsx';
import { Button,DatePicker, List, InputItem,TextareaItem,Modal,Table} from 'antd-mobile';
import { Icon} from 'antd';

//发送组件，公文报送和工作督促公用。
class CommonSendComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        tabName:"send",
      };
  }
  componentWillMount(){
  }

  render() {
    return (
      <div>
        笑嘻嘻笑嘻嘻系
      </div>
    )
  }
}

CommonSendComp.defaultProps = {
};

CommonSendComp.propTypes = {
};

export default CommonSendComp;
