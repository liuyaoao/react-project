//发文管理的详情页.
import $ from 'jquery';
import React from 'react';
// import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WingBlank, WhiteSpace, Button, NavBar, Toast } from 'antd-mobile';
import {Icon} from 'antd';

import DS_DetailContentComp from './ds_detail_content_comp.jsx';
import BottomTabBarComp from './bottomTabBar_comp.jsx';
// import DS_SendContentComp from './ds_send_content_comp.jsx';//发文详情页-- 发送
import CommonSendComp from '../common_send_comp.jsx'; //发送
import CommonVerifyComp from '../common_verify_comp.jsx';
import SignReportFlowTraceComp from 'pages/office_automation/signReport/signReport_flowTrace_comp.jsx'; //办文跟踪视图

class DS_DetailComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.state = {
        moduleNameCn:'发文管理',
        modulename:'fwgl', //模块名
        formParams:{
          "wjbt":'',  //标题。
          "fwwh":"", //发文管理的--文号。
          "mj":"", //发文管理的--密级。
          "jjcd":"",  //发文管理的--缓急。
          "fs":"",  //发文管理的--份数。
          "zsdw":"", //发文管理--主送
          "csdw":"", //发文管理--抄送
        },
        curSubTab:'content',
        isHide:false,
        editSaveTimes:1,  //编辑保存的次数。
        formData:{},
        formDataRaw: {}
      };
  }
  componentWillMount(){
    if(this.props.detailInfo && this.props.detailInfo.unid){
      this.getServerFormData();
    }
  }

  getServerFormData = ()=>{
    OAUtils.getModuleFormData({
      moduleName:this.state.moduleNameCn,
      tokenunid:this.props.tokenunid,
      unid:this.props.detailInfo.unid,
      formParams:this.state.formParams,
      successCall: (data)=>{
        let formDataRaw = data.values;
        let formData = OAUtils.formatFormData(data.values);
        console.log("发文管理的表单数据:",formData,formDataRaw);
        if(!formData.unid){
          Toast.info('该文件已被删除，不能处理了!', 2.5);
        }
        this.setState({
          formData,
          formDataRaw
        });
        // console.log("get 发文管理的表单数据:",data,formData);
      }
    });
  }
  onNavBarLeftClick = (e) => {
    this.setState({isHide:true});
    // console.log("当前目录：", this.state.curSubTab);
    if(this.state.curSubTab == "content"){
      this.props.backToTableListCall();
    }else{
      this.props.backToTableListCall("showDetail");
      this.setState({curSubTab:'content'});
    }
    this.onBackToDetailCall();
  }
  onBackToDetailCall = () => {
    this.setState({curSubTab:'content',selectedTab:''});
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
     const { detailInfo } = this.props;
     const formData = this.state.formData || {};
    return (
      <div className={'oa_detail_container ds_detail_container'}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          发文处理单
        </NavBar>
        <div style={{marginTop:'60px'}}>
          {this.state.curSubTab == "content" ?
            (<DS_DetailContentComp
              tokenunid={this.props.tokenunid}
              moduleNameCn={this.state.moduleNameCn}
              detailInfo={detailInfo}
              formData={formData}
              formDataRaw={this.state.formDataRaw}
              modulename={this.state.modulename}
              editSaveTimes={this.state.editSaveTimes}
              formParams={this.state.formParams}
              editSaveSuccCall={this.editSaveSuccCall}
              backToTableListCall={()=>this.props.backToTableListCall()} />):null}
            {this.state.curSubTab == "content" && formData.unid?<div className="custom_tabBar">
              <BottomTabBarComp
                hidden={false}
                isAddNew={false}
                formDataRaw={this.state.formDataRaw}
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
            </div>:null}
            {this.state.curSubTab == "send"?
              (<CommonSendComp
                  detailInfo={detailInfo}
                  tokenunid={this.props.tokenunid}
                  docunid={detailInfo.unid}
                  moduleNameCn={this.state.moduleNameCn}
                  modulename={this.state.modulename}
                  otherssign={formData["_otherssign"]}
                  gwlcunid={formData["gwlc"]}
                  onBackToDetailCall={this.onBackToDetailCall}
                />):null}
            {this.state.curSubTab == "verify"?
              (<CommonVerifyComp
                tokenunid={this.props.tokenunid}
                docunid={detailInfo.unid}
                modulename={this.state.modulename}
                gwlcunid={formData["gwlc"]}
                onBackToDetailCall={this.onBackToDetailCall}
              />):null}
            {this.state.curSubTab == "track"?
              (<SignReportFlowTraceComp
                tokenunid={this.props.tokenunid}
                backDetailCall={this.onBackToDetailCall}
                docunid={detailInfo.unid}
                modulename={this.state.modulename}
                gwlcunid={formData["gwlc"]} />):
              null}
            {/*this.state.curSubTab == "upload"?
              (<DS_UploadContentComp
                tokenunid={this.props.tokenunid}
                 isShow={true}/>):null*/}
            {/*this.state.curSubTab == "article"?
              (<DS_MainContentComp
                tokenunid={this.props.tokenunid}
                isShow={true}/>):null */}
        </div>
      </div>
    )
  }
}

DS_DetailComp.defaultProps = {
};
DS_DetailComp.propTypes = {
  // isShow:React.PropTypes.bool,
};

export default DS_DetailComp;
