//签报管理的详情页.
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WingBlank, WhiteSpace, Button, NavBar, TabBar} from 'antd-mobile';

import {Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

import DetailContentComp from './detail_content_comp.jsx';
import BottomTabBarComp from './bottomTabBar_comp.jsx';
import SignReportFlowTraceComp from './signReport_flowTrace_comp.jsx'; //办文跟踪视图
import CommonSendComp from '../common_send_comp.jsx'; //发送视图
import CommonVerifyComp from '../common_verify_comp.jsx'; //阅文意见视图

const zhNow = moment().locale('zh-cn').utcOffset(8);

class SignReportDetail extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.state = {
        date: zhNow,
        moduleNameCn:'签报管理',
        modulename:'qbgl', //模块名
        formParams:{
          "nr":'',  //事由
        },
        hidden: false,
        selectedTab:'',
        curSubTab:'content',
        editSaveTimes:1,  //编辑保存的次数。
        formData:{}, //经过前端处理的表单数据
        formDataRaw:{}, //没有经过处理的后端返回的表单数据。
      };
  }
  componentWillMount(){
    if(this.props.detailInfo && this.props.detailInfo.unid){
      this.getServerFormData();
    }
  }
  getServerFormData = ()=>{
    const { detailInfo } = this.props;
    OAUtils.getModuleFormData({
      moduleName:this.state.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.detailInfo.unid,
      formParams:this.state.formParams,
      successCall: (data)=>{
        console.log("get 签报管理的表单数据:",data);
        let formData = OAUtils.formatFormData(data.values);
        this.setState({
          formData,
          formDataRaw:data.values,
        });
      },
      errorCall:(res)=>{
        //TODO
      }
    });
  }

  onNavBarLeftClick = (e) => {
    if(this.state.curSubTab == "content"){
      this.props.backToTableListCall();
    }else{
      this.props.backToTableListCall("showDetail");
    }
    this.onBackDetailCall();
  }

  onBackDetailCall = ()=>{
    this.setState({curSubTab:'content',selectedTab:''});
  }
  afterChangeTabCall = (tabname)=>{ //切换tab。
    this.setState({
      curSubTab:tabname,
    });
  }
  onClickAddSave = ()=>{ //点击了保存
    let {editSaveTimes} = this.state;
    this.setState({
      selectedTab: 'saveTab',
      editSaveTimes:++editSaveTimes,
    });
  }
  editSaveSuccCall = (formData,formDataRaw)=>{ //跟新表单数据。
    this.getServerFormData();
    this.props.updateListViewCall();
  }

  render() {
     const {detailInfo} = this.props;
     const {formData,formDataRaw,historyNotionList,attachmentList} = this.state;

    //  let clsName = this.props.isShow && !this.state.isHide?
    //  'oa_detail_container ds_detail_container oa_detail_container_show':
    //  'oa_detail_container ds_detail_container oa_detail_container_hide';
    return (
      <div className={"oa_detail_container ds_detail_container"}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          签报处理单
        </NavBar>
        <div style={{marginTop:'60px'}}>
          {this.state.curSubTab == "content"?
            (
              <DetailContentComp
                editSaveTimes={this.state.editSaveTimes}
                moduleNameCn={this.state.moduleNameCn}
                activeTabkey={this.props.activeTabkey}
                tokenunid={this.props.tokenunid}
                formData={formData}
                formDataRaw={formDataRaw}
                formParams={this.state.formParams}
                editSaveSuccCall={this.editSaveSuccCall}
                detailInfo={detailInfo} />
            ):null}
        </div>
        {this.state.curSubTab == "send"?
          (<CommonSendComp
              detailInfo={detailInfo}
              tokenunid={this.props.tokenunid}
              docunid={detailInfo.unid}
              moduleNameCn={this.state.moduleNameCn}
              modulename={this.state.modulename}
              otherssign={formData["_otherssign"]}
              gwlcunid={formData["gwlc"]}
              onBackToDetailCall={this.onBackDetailCall}
            />):null}
        {this.state.curSubTab == "verify"?
          (<CommonVerifyComp
            tokenunid={this.props.tokenunid}
            backDetailCall={this.onBackDetailCall}
            docunid={detailInfo.unid}
            modulename={this.state.modulename}
            gwlcunid={formData["gwlc"]} />):
          null}
          {this.state.curSubTab == "track"?
            (<SignReportFlowTraceComp
              tokenunid={this.props.tokenunid}
              backDetailCall={this.onBackDetailCall}
              docunid={detailInfo.unid}
              modulename={this.state.modulename}
              gwlcunid={formData["gwlc"]} />):
            null}

          <BottomTabBarComp
            hidden={this.state.curSubTab != "content"}
            isAddNew={false}
            formDataRaw={formDataRaw}
            selectedTab={this.state.selectedTab}
            onClickAddSave={()=>this.onClickAddSave()}
            onClickVerifyBtn={()=>{
              this.setState({
                curSubTab:'verify',
                selectedTab: 'verifyTab',
              });
            }}
            onClickSendBtn={()=>{
              this.setState({
                curSubTab:'send',
                selectedTab: 'sendTab',
              });
            }}
            onClickTrackBtn={()=>{
              this.setState({
                curSubTab:'track',
                selectedTab: 'trackTab',
              });
            }} />
      </div>
    )
  }
}

SignReportDetail.defaultProps = {
};

SignReportDetail.propTypes = {
  backToTableListCall:React.PropTypes.func,
  activeTabkey:React.PropTypes.string,
};

export default SignReportDetail;
