//督办管理的详情页.
import $ from 'jquery';
import React from 'react';
import {browserHistory} from 'react-router/es6';
// import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WingBlank, WhiteSpace, Button, NavBar, TabBar,List,Modal,Toast} from 'antd-mobile';
const alert = Modal.alert;
import {Icon } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

import DetailContentComp from './detail_content_comp.jsx';
import CommonBottomTabBarComp from '../common_bottomTabBar_comp.jsx'; //底部tab条。
import SuperviseFlowTraceComp from './flowTrace_comp.jsx'; //办文跟踪视图
import CommonSendComp from '../common_send_comp.jsx';
import CommonVerifyComp from '../common_verify_comp.jsx';
import CommonRehandleComp from '../common_rehandle_comp.jsx'; //回收重办视图

const zhNow = moment().locale('zh-cn').utcOffset(8);

export default class SuperviseDetail extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.state = {
        date: zhNow,
        moduleNameCn:'督办管理',
        modulename:'duban', //模块名
        unid:'',
        tokenunid:'',
        formParams:{
          "dblx":"",  //督办管理--督办类型。
          "lsh":"",   //督办管理--收文号。
          "swrq":"",  //督办管理--收文日期。
          "lwdw":"",  //督办管理--来为单位。
          "blsx":"",  //督办管理--办理时限，也就是截至日期。
          "cb":"",  //督办管理--催办。
          "yh":"",  //督办管理--原号。
        },
        hidden: false,
        selectedTab:'',
        visible:false,
        curSubTab:'content',
        editSaveTimes:1, //编辑保存的次数。
        formData:{}, //经过前端处理的表单数据
        formDataRaw:{}, //没有经过处理的后端返回的表单数据。
      };
  }
  componentWillMount(){
    Toast.hide();
    let loginInfo = localStorage.getItem(OAUtils.OA_LOGIN_INFO_KEY);
    let tokenunid = JSON.parse(loginInfo)['tockenunid'];
    let unid = this.props.location.query.unid;
    this.setState({ tokenunid,unid });
  }
  componentDidMount(){
    let unid = this.props.location.query.unid;
    if(unid){
      this.setState({unid:unid});
      this.getServerFormData(unid);
    }
  }
  componentWillUnmount(){
    Toast.hide();
  }
  getServerFormData = (unid)=>{
    OAUtils.getModuleFormData({
      moduleName:this.state.moduleNameCn,
      tokenunid:this.state.tokenunid,
      unid:unid,
      formParams:this.state.formParams,
      successCall: (data)=>{
        let formData = OAUtils.formatFormData(data.values);
        console.log("get 督办管理的表单数据:",data,formData);
        if(!formData.unid){
          Toast.info('该文件已被删除，不能处理了!', 2, null,false);
        }
        this.setState({
          formData,
          formDataRaw:data.values,
        });
      }
    });
  }
  onNavBarLeftClick = (e) => {
    if(this.state.curSubTab=="content"){
      browserHistory.goBack();
    }
    this.onBackDetailCall();
  }
  onBackDetailCall = ()=>{
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
    this.getServerFormData(this.state.unid);
  }
  onClickToEndBtn = ()=>{
    alert('', '终结后将不能修改，其他人员也不能继续办理，是否继续？', [
      { text: '取消', onPress: () => console.log('cancel') },
      { text: '确定', onPress: () => this.confirmToEndHandle() },
    ]);
  }
  confirmToEndHandle = ()=>{
    OAUtils.toEndItemV2({
      moduleName:this.state.moduleNameCn,
      tokenunid:this.state.tokenunid,
      unid:this.state.unid,
      formParams:Object.assign({},this.state.formParams,this.state.formData), //特有的表单参数数据。
      successCall: (data)=>{
        Toast.info('办结成功!', 2);
        this.getServerFormData(this.state.unid);
      },
      errorCall:(res)=>{
        Toast.info('办结失败!!', 2);
      }
    });
  }

  render() {
    const {tokenunid,unid, formData,formDataRaw} = this.state;
    return (
      <div className={"oa_detail_container ds_detail_container"}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          督办处理单
        </NavBar>
        <div style={{marginTop:'60px'}}>
          {this.state.curSubTab == "content"?
            (
              <DetailContentComp unid={unid}
                editSaveTimes={this.state.editSaveTimes}
                moduleNameCn={this.state.moduleNameCn}
                formData={formData}
                formDataRaw={formDataRaw}
                formParams={this.state.formParams}
                editSaveSuccCall={this.editSaveSuccCall} />
            ):null
          }
        </div>
        {this.state.curSubTab == "send"?
          (<CommonSendComp unid={unid}
              fileTitle={formData['bt']}
              tokenunid={tokenunid}
              docunid={unid}
              moduleNameCn={this.state.moduleNameCn}
              modulename={this.state.modulename}
              otherssign={formData["_otherssign"]}
              gwlcunid={formData["gwlc"]}
              onBackToDetailCall={this.onBackDetailCall}
            />):null
        }
        {this.state.curSubTab == "verify"?
          (<CommonVerifyComp unid={unid}
            tokenunid={tokenunid}
            docunid={unid}
            modulename={this.state.modulename}
            backDetailCall={this.onBackDetailCall}
            gwlcunid={formData["gwlc"]} />
          ):null
        }
        {this.state.curSubTab == "track"?
          (<SignReportFlowTraceComp
            tokenunid={tokenunid}
            backDetailCall={this.onBackDetailCall}
            docunid={unid}
            modulename={this.state.modulename}
            gwlcunid={formData["gwlc"]} />
          ):null
        }
        {this.state.curSubTab == "rehandle"?
          (<CommonRehandleComp
            tokenunid={tokenunid}
            backDetailCall={this.onBackDetailCall}
            editSaveSuccCall={this.editSaveSuccCall}
            docunid={unid}
            modulename={this.state.modulename}
            fsid={formData["flowsessionid"]}
            gwlcunid={formData["gwlc"]} />
          ):null
        }
        {this.state.curSubTab == "content" && formData.unid?<div className="custom_tabBar">
          <CommonBottomTabBarComp
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
            }}
            onClickReHandleBtn={()=>{
              this.setState({
                curSubTab:'rehandle',
                selectedTab: 'rehandleTab',
              });
            }}
            onClickToEndBtn={()=>{
              this.setState({
                curSubTab:'content',
                selectedTab: 'contentTab',
              });
              this.onClickToEndBtn();
            }} />
          </div>:null}
      </div>
    )
  }
}
