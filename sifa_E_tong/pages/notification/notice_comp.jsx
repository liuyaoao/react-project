import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import {Link} from 'react-router/es6';
import {  Icon, Table,notification } from 'antd';
import {Toast} from 'antd-mobile';

notification.config({
  top: 68,
  duration: 3
});
//矫正系统的通知公告。
class NoticeComp extends React.Component {
  constructor(props) {
      super(props);
      this.getBodyPages = this.getBodyPages.bind(this);
      this.state = {
        isMobile: Utils.isMobile(),
      };
  }
  componentWillMount(){
  }
  componentWillReceiveProps(nextProps){
  }
  getBodyPages(){
    const columns = [
      {
        title: '标题',
        dataIndex: 'STitle',
        key: 'STitle',
        render: (text,record,index) => (<a href={record.contentUrl} target='_blank'>{text}</a>)
      },
      {
        title: '发布单位',
        dataIndex: 'pubUnit',
        key: 'pubUnit',
      },
      {
        title: '时间',
        dataIndex: 'pubTime',
        key: 'pubTime',
      },
      {
        title: '是否重要',
        key: 'isMajor',
        render: (text,record) => (
          <span style={{color:text?'green':'gray'}}>{text?"重要":"不重要"}</span>
        )
      }];
      let bodyMobilePages=(
        <div style={{width:'100%'}} className='noticeMobile'>
          <Table columns={columns} dataSource={this.props.noticeListData||[]} pagination={{ pageSize: 14 }}/>
        </div>
      );
      let bodyPCPages=(
        <div className='noticePC'>
          <Table columns={columns} dataSource={this.props.noticeListData||[]} pagination={{ pageSize: 14 }}/>
        </div>
      );
      return this.state.isMobile ? bodyMobilePages : bodyPCPages;
  }
  render() {
    let bodyPages=this.getBodyPages();
    return (
      <div>
        {bodyPages}
      </div>
    )
  }
}

NoticeComp.defaultProps = {
};

NoticeComp.propTypes = {
  // organId:React.PropTypes.number,
};

export default NoticeComp;
