import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import superagent from 'superagent';
// import myWebClient from 'client/my_web_client.jsx';
import {Toast} from 'antd-mobile';
import echarts from 'echarts';
import ERecordisMobileComp from 'pages/notification/eRecord_mobile_comp.jsx';
const urlPrefix = 'http://218.77.44.11:10080/CS_JrlService';

//矫正系统的统计分析。
export default class ElecDocMobileComp extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        organId:'',
        isMobile: Utils.isMobile(),
        eRecordData:[],
        organListData:[], //矫正的组织结构列表数据。
      };
  }
  componentWillMount(){
  }
  componentDidMount(){
    let curOrganId = this.props.location.query.organId;
    if(this.props.location.query.organId){
      this.getServerERecordData({
        organId:curOrganId,
        currentIndex:1
      });
      this.setState({
        organId:curOrganId,
      });
    }
  }
  componentWillReceiveProps(nextProps){
    // console.log('nextProps.location.query.organId--:',nextProps.location.query.organId);
    let curOrganId = nextProps.location.query.organId;
    if(curOrganId && curOrganId != this.state.organId){
      this.getServerERecordData({
        organId:curOrganId,
        currentIndex:1
      });
      this.setState({
        organId:curOrganId,
      });
    }
  }
  getServerERecordData = (params)=>{
    $.post(`${urlPrefix}/android/manager/getRymcList.action`,
      Object.assign({},{currentIndex:1},params),(data,state)=>{
        let res = decodeURIComponent(data);
        try{
           res = JSON.parse(res);
        }catch(e){
        }
        // console.log("矫正系统的获取电子档案的返回---：",res,state);
        if(res.respCode != "0"){
          Toast.info(res.respMsg, 2, null, false);
        }else{
          let values = this.parseServerListData(res.values);
          this.setState({
            eRecordData:values || [],
          });
          // Toast.info('矫正系统获取电子档案成功，', 2, null, false);
        }
    });
  }
  //获取组织机构数据
  getServerOrganData = (organId)=>{
    let params = {organId:organId};
    $.post(`${urlPrefix}/android/datb/getAndroidOrgan.action`,
      params,(data,state)=>{
        let res = decodeURIComponent(data);
        try{
           res = JSON.parse(res);
        }catch(e){
        }
        if(res.respCode == "0"){
            let organList = res.values;
            this.setState({ organListData:organList });
        }
    });
  }
  parseServerListData = (values)=>{
    for(let i=0;i<values.length;i++){
      values[i]['key'] = values[i].id || values[i].identity;
    }
    return values;
  }
  handleSearchDocument = (params)=> {
    this.getServerERecordData(params);
  }
  render(){
    return (
      <div className="notificationdetai_container">
        <ERecordisMobileComp
          eRecordData={this.state.eRecordData}
          redressOrganId={this.state.organId}
          organListData={this.state.organListData}
          handleSearchDocument={this.handleSearchDocument}
          />
      </div>
    )
  }
}
