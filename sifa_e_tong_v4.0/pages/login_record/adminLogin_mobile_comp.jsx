// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import $ from 'jquery';
import React from 'react';
import moment from 'moment';
import myWebClient from 'client/my_web_client.jsx';
import {Icon,message} from 'antd';
import {List,Button} from 'antd-mobile';

import LoginRecordTimeSelect from './recordTime_select.jsx';

class AdminLoginMobileComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          todayDate:moment(new Date()),
          loginData:[],
          totalCount:1,
          curPageNum:1,
          aMonthAgo:moment(new Date()).subtract(10,'days'),
        };
    }
    componentWillMount(){
    }
    componentDidMount(){
      let timeObj = {
        startTime:(moment(new Date()).subtract(10,'days')).format('x'),
        endTime:moment(new Date()).format('x')
      };
      this.getSearchLoginRecord(timeObj);
    }
    getSearchLoginRecord(time) {
      //时间要是时间戳格式的。
      let params = {
        startTime: (time && time.startTime) ? time.startTime : this.state.aMonthAgo.format('x'),
        endTime: (time && time.endTime) ? time.endTime : this.state.todayDate.format('x')
      };
      // console.log("today:",this.state.todayDate);
      myWebClient.getUserLoginRecordData(params,
        (data,res)=>{
          let objArr = JSON.parse(res.text);
          // console.log("获取用户登录记录数据成功-- res text:",objArr);
          objArr.reverse();
          for(let i=0;i<objArr.length;i++){
            let item = objArr[i];
            objArr[i]['key'] = i;
            objArr[i]['time'] = item.createAt ? moment(item.createAt).format('YYYY-MM-DD HH:mm:ss').replace(/\s+/g,'\r\n') : '';
            objArr[i]['userName'] = item.username||'';
            objArr[i]['operation'] = '登录成功';
            objArr[i]['name'] = item.username||'';
          }
          let loginData = objArr.slice(0,10);
          this.setState({ loginData });
        },
        (e,err,res)=>{
          message.error("获取用户登录记录数据失败！");
        }
      );
    }
    onClickPrePage = ()=>{ //上一页
      let currentPage = this.state.curPageNum;
      if(currentPage > 1){
        let otherParams = {
          "from":(currentPage-2)*10,
          "to":(currentPage-1)*10,
        };
        // this.props.getAddressBookCnt({
        //   organization:this.props.organization,
        //   secondaryDirectory:this.props.secondaryDirectory,
        //   level3Catalog:this.props.level3Catalog,
        // },otherParams);
      }
    }
    onClickNextPage = ()=>{ //下一页
      let currentPage = this.state.curPageNum;
      const pageCount = Math.ceil(this.state.totalCount/10);
      if(currentPage < pageCount){
        let otherParams = {
          "from":(currentPage)*10,
          "to":(currentPage+1)*10,
        };
        // this.props.getAddressBookCnt({
        //   organization:this.props.organization,
        //   secondaryDirectory:this.props.secondaryDirectory,
        //   level3Catalog:this.props.level3Catalog,
        // },otherParams);
      }
    }

    render() {
      const {loginData} = this.state;

      return (
          <div className='login_record_container'>
            <LoginRecordTimeSelect getSearchLoginRecord={this.getSearchLoginRecord.bind(this)}></LoginRecordTimeSelect>
            <div className={''}>
              <div className='addressbook_list mobile_addressbook_list' style={{width:'100%'}}>
                <List style={{ margin: '0.1rem 0', backgroundColor: 'white' }}>
                  {loginData.map((record, index) => (
                    <List.Item key={index} multipleLine>
                      <div className="addressbook_row">
                        <div className="addressbook_detail" style={{paddingLeft:'0'}}>
                          <div className=""><span>姓名：</span>{record.name}</div>
                          <div className=""><span>用户名：</span>{record.userName}</div>
                        </div>
                        <div className="addressbook_right">
                          <div style={{textAlign:'right'}}>{record.time}</div>
                          <div style={{textAlign:'right'}}>{record.operation}</div>
                        </div>
                      </div>
                    </List.Item>
                    )
                  )}
                </List>
              </div>
              <div className="mobile_page_cnt">
                <div className="pre_page">
                  <Button type="default" onClick={this.onClickPrePage}><Icon type="double-left" /> 上一页</Button>
                </div>
                <div className="page_num">
                  <span>{this.state.totalCount>0?this.state.curPageNum:0}</span>/<span>{Math.ceil(this.state.totalCount/10)}</span>
                </div>
                <div className="next_page">
                  <Button type="default" onClick={this.onClickNextPage}>下一页<Icon type="double-right" /></Button>
                </div>
              </div>
            </div>
          </div>
      );
    }
}

AdminLoginMobileComp.defaultProps = {
};

AdminLoginMobileComp.propTypes = {
  // allModulesData:React.PropTypes.array,
  // localStoreKey4Modules:React.PropTypes.string
    // params: React.PropTypes.object.isRequired
};

export default AdminLoginMobileComp;
