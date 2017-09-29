import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import {Link} from 'react-router/es6';
import {  Icon, Table,notification } from 'antd';
import {Toast} from 'antd-mobile';
const urlPrefix = 'http://218.77.44.11:10080/CS_JrlService';

notification.config({
  top: 68,
  duration: 3
});
//矫正系统的通知公告。
export default class NoticePcComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        curPageNum:1,
        totalCount:0,
        noticeListData:[],
      };
  }
  componentDidMount(){
    if(this.props.redressOrganId){
      this.getServerNoticeListData(this.props.redressOrganId,this.state.curPageNum);
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.redressOrganId && nextProps.redressOrganId!=this.props.redressOrganId){
      this.getServerNoticeListData(nextProps.redressOrganId,this.state.curPageNum);
    }
  }
  getServerNoticeListData = (organId,currentIndex)=>{
    $.post(`${urlPrefix}/android/infoPublish/query.action`,
      {
        organId:organId,
        currentIndex:currentIndex
      },(data,state)=>{
        let res = decodeURIComponent(data);
        try{
           res = JSON.parse(res);
        }catch(e){
        }
        // console.log("矫正系统的获取通知公告的返回---：",res,state);
        if(res.respCode != "0"){
            notification.error({message: '矫正系统获取通知列表失败，'+res.respMsg});
        }else{
          let values = this.parseServerListData(res.values);
          for(let i in values){
            let optionData=values[i].pubTime.split('');
            optionData.splice(10,1," ");
            values[i].pubTime=optionData.join('');
          }
          this.setState({
            noticeListData:values || [],
            curPageNum:res.currentIndex,
            totalCount:res.totalRowsCount
          });
        }
    });
  }
  parseServerListData = (values)=>{
    for(let i=0;i<values.length;i++){
      values[i]['key'] = values[i].id || values[i].identity;
    }
    return values;
  }
  onPaginationChange = (current,pageSize)=>{
    this.getServerNoticeListData(this.props.redressOrganId,current);
  }
  getBodyPagesColumns(){
    return [
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
  }
  render() {
    let columns=this.getBodyPagesColumns();
    let pagination = { //分页组件参数配置。
      pageSize:15,
      current:this.state.curPageNum,
      total:this.state.totalCount,
      onChange:this.onPaginationChange,
    };
    return (
      <div>
        <div className='noticePC'>
          <Table columns={columns} dataSource={this.state.noticeListData||[]} pagination={pagination}/>
        </div>
      </div>
    )
  }
}
