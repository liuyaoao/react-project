import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import {  Icon, Table } from 'antd';
import {Toast} from 'antd-mobile';

const urlPrefix = 'http://218.77.44.11:10080/CS_JrlService';
//矫正系统的通知公告。
export default class NoticeMobileComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        // isMobile: Utils.isMobile(),
        organId:'',
        noticeListData:[], //通知公告列表数据
        curPageNum:1,
        totalCount:0,
      };
  }
  componentDidMount(){
    // console.log('props.location.query.organId--:',this.props.location.query.organId);
    let curOrganId = this.props.location.query.organId;
    if(this.props.location.query.organId){
      this.getServerNoticeListData(curOrganId,1);
      this.setState({
        organId:curOrganId,
      });
    }
  }
  componentWillReceiveProps(nextProps){
    // console.log('nextProps.location.query.organId--:',nextProps.location.query.organId);
    let curOrganId = nextProps.location.query.organId;
    if(curOrganId && curOrganId != this.state.organId){
      this.getServerNoticeListData(curOrganId,1);
      this.setState({
        organId:curOrganId,
      });
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
          Toast.info(res.respMsg, 2, null, false);
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
    this.getServerNoticeListData(this.state.organId,current);
  }
  getBodyPages = ()=>{
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
      let pagination = { //分页组件参数配置。
        pageSize:15,
        current:this.state.curPageNum,
        total:this.state.totalCount,
        onChange:this.onPaginationChange,
      };
      return (
        <div style={{width:'100%'}} className='noticeMobile'>
          <Table columns={columns} dataSource={this.state.noticeListData||[]} pagination={pagination}/>
        </div>
      );
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
