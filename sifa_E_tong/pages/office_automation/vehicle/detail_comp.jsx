//车辆管理的详情页.
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';

import { WingBlank, WhiteSpace, Button, InputItem, NavBar,
  TextareaItem,Flex,DatePicker,List,TabBar} from 'antd-mobile';

import DetailContentComp from './detailContent_comp.jsx';
import CommonSendComp from '../common_send_comp.jsx';
import CommonVerifyComp from '../common_verify_comp.jsx';
import {Icon} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';

const zhNow = moment().locale('zh-cn').utcOffset(8);

class Vehicle_DetailComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.state = {
        moduleNameCn:'车辆管理',
        modulename:'clgl2', //模块名
        formParams:{
          ycts:'', //用车天数。
          sxrs:'', //随行人数。
          jsy:'',  //驾驶员。
          cph:'',  //车牌号。
          ccdd:'',  //用车地点。
          ycsy:'',  //用车事由。
          ycrq:'',  //用车时间-日期。
          ycsjHour:'',  //用车时间-小时。
          ycsjMinute:'',  //用车时间-分钟。
          hcrq:'',  //回车时间-日期。
          hcsjHour:'',  //回车时间-小时。
          hcsjMinute:'',  //回车时间-分钟。
        },
        hidden: false,
        selectedTab:'',
        editSaveTimes:1, //编辑保存的次数。
        curSubTab:'content',
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
      formParams:this.state.formParams, //特有的表单参数数据。
      successCall: (data)=>{
        console.log("get 车辆管理的表单数据:",data);
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
    this.props.backToTableListCall();
  }
  onBackDetailCall = ()=>{
    this.setState({curSubTab:'content'});
  }
  onClickAddSave = ()=>{ //点击了保存
    let {editSaveTimes} = this.state;
    this.setState({
      selectedTab: 'saveTab',
      editSaveTimes:++editSaveTimes,
    });
    // this.props.backToTableListCall();
  }
  editSaveSuccCall = (formData,formDataRaw)=>{
    this.props.updateListViewCall();
    this.setState({
      formData,
      formDataRaw
    });
  }

  render() {
    return (
      <div className={"oa_detail_container ds_detail_container"}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          车辆申请(修改)
        </NavBar>
        <div style={{marginTop:'60px'}}>
          {this.state.curSubTab == "content"?
            (<DetailContentComp
              moduleNameCn={this.state.moduleNameCn}
              detailInfo={this.props.detailInfo}
              formParams={this.state.formParams}
              formData={this.state.formData}
              formDataRaw={this.state.formDataRaw}
              editSaveTimes={this.state.editSaveTimes}
              editSaveSuccCall={this.editSaveSuccCall}
              />):null}
        </div>

        {this.state.curSubTab == "send"? (<CommonSendComp
          tokenunid={this.props.tokenunid}
          backDetailCall={this.onBackDetailCall} isShow={true}/>):null}
        {this.state.curSubTab == "verify"?
          (<CommonVerifyComp
            tokenunid={this.props.tokenunid}
            backDetailCall={this.onBackDetailCall}
            isShow={true}/>):
          null}
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          <TabBar.Item
            title="保存"
            key="保存"
            icon={ <Icon type="save" style={{fontSize:'0.4rem'}}/> }
            selectedIcon={<Icon type="save" style={{color:'blue',fontSize:'0.4rem'}}/>}
            selected={this.state.selectedTab === 'saveTab'}
            onPress={() => this.onClickAddSave()}
          >
          <div></div>
          </TabBar.Item>
          <TabBar.Item
            title="阅文意见"
            key="阅文意见"
            icon={ <Icon type="edit" style={{fontSize:'0.4rem'}} /> }
            selectedIcon={<Icon type="edit" style={{color:'blue', fontSize:'0.4rem'}}/>}
            selected={this.state.selectedTab === 'verifyTab'}
            onPress={() => {
              this.setState({
                curSubTab:'verify',
                selectedTab: 'verifyTab',
              });
            }}
          >
          <div></div>
          </TabBar.Item>
          <TabBar.Item
            title="发送"
            key="发送"
            icon={ <Icon type="export" style={{fontSize:'0.4rem'}} /> }
            selectedIcon={<Icon type="export" style={{color:'blue', fontSize:'0.4rem'}}/>}
            selected={this.state.selectedTab === 'sendTab'}
            onPress={() => {
              this.setState({
                curSubTab:'send',
                selectedTab: 'sendTab',
              });
            }}
          >
          <div></div>
          </TabBar.Item>
        </TabBar>
      </div>
    )
  }
}

Vehicle_DetailComp.defaultProps = {
};

Vehicle_DetailComp.propTypes = {
  backToTableListCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default Vehicle_DetailComp;
