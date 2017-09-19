//督办管理的详情页.
import $ from 'jquery';
import React from 'react';
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

class SuperviseDetail extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.state = {
        date: zhNow,
        moduleNameCn:'督办管理',
        modulename:'duban', //模块名
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
        let formData = OAUtils.formatFormData(data.values);
        console.log("get 督办管理的表单数据:",data,formData);
        this.setState({
          formData,
          formDataRaw:data.values,
        });
      }
    });
  }
  onNavBarLeftClick = (e) => {
    this.state.curSubTab=="content"?this.props.backToTableListCall():this.props.backToTableListCall("showDetail");
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
    this.getServerFormData();
    this.props.updateListViewCall();
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
      tokenunid:this.props.tokenunid,
      unid:this.props.detailInfo.unid,
      formParams:Object.assign({},this.state.formParams,this.state.formData), //特有的表单参数数据。
      successCall: (data)=>{
        Toast.info('办结成功!', 2);
        this.props.updateListViewCall();
        this.props.backToTableListCall();
      },
      errorCall:(res)=>{
        Toast.info('办结失败!!', 2);
      }
    });
  }

  render() {
    const {detailInfo} = this.props;
    const {formData,formDataRaw} = this.state;
    //  let clsName = this.props.isShow && !this.state.isHide?
    //  'oa_detail_container ds_detail_container oa_detail_container_show':
    //  'oa_detail_container ds_detail_container oa_detail_container_hide';
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
              <DetailContentComp
                editSaveTimes={this.state.editSaveTimes}
                moduleNameCn={this.state.moduleNameCn}
                activeTabkey={this.props.activeTabkey}
                formData={formData}
                formDataRaw={formDataRaw}
                formParams={this.state.formParams}
                editSaveSuccCall={this.editSaveSuccCall}
                detailInfo={detailInfo} />
            ):null
          }
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
            />):null
        }
        {this.state.curSubTab == "verify"?
          (<CommonVerifyComp
            tokenunid={this.props.tokenunid}
            docunid={detailInfo.unid}
            modulename={this.state.modulename}
            backDetailCall={this.onBackDetailCall}
            gwlcunid={formData["gwlc"]} />
          ):null
        }
        {this.state.curSubTab == "track"?
          (<SignReportFlowTraceComp
            tokenunid={this.props.tokenunid}
            backDetailCall={this.onBackDetailCall}
            docunid={detailInfo.unid}
            modulename={this.state.modulename}
            gwlcunid={formData["gwlc"]} />
          ):null
        }
        {this.state.curSubTab == "rehandle"?
          (<CommonRehandleComp
            tokenunid={this.props.tokenunid}
            backDetailCall={this.onBackDetailCall}
            editSaveSuccCall={this.editSaveSuccCall}
            docunid={detailInfo.unid}
            modulename={this.state.modulename}
            fsid={formData["flowsessionid"]}
            gwlcunid={formData["gwlc"]} />
          ):null
        }
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
      </div>
    )
  }
}

SuperviseDetail.defaultProps = {
};

SuperviseDetail.propTypes = {
  backToTableListCall:React.PropTypes.func,
};

export default SuperviseDetail;
