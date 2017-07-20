//督办管理的新增页.
import $ from 'jquery';
import React from 'react';
// import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WingBlank, WhiteSpace, Button, NavBar, TabBar} from 'antd-mobile';

import {Icon } from 'antd';
import moment from 'moment';
import AddContentComp from './add_content_comp.jsx';
// import CommonSendComp from '../common_send_comp.jsx';
// import CommonVerifyComp from '../common_verify_comp.jsx';
const zhNow = moment().locale('zh-cn').utcOffset(8);

class SuperviseAdd extends React.Component {
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
        newAdding:false, //是否正在新建。
        selectedTab:'',
        curSubTab:'content',
        formData:{},
        formDataRaw: {}
      };
  }
  componentWillMount(){
    this.getServerFormData();
  }
  getServerFormData = ()=>{
    OAUtils.getModuleFormData({
      moduleName:this.state.moduleNameCn,
      tokenunid:this.props.tokenunid,
      // unid:this.props.detailInfo.unid,
      formParams:this.state.formParams, //特有的表单参数数据。
      successCall: (data)=>{
        let formDataRaw = data.values;
        let formData = OAUtils.formatFormData(data.values);
        this.setState({
          formData,
          formDataRaw
        });
        console.log("get 督办管理新建时的表单数据:",data);
      }
    });
  }
  onNavBarLeftClick = (e) => {
    this.props.backToTableListCall();
  }
  onClickAddNewSave = ()=> { //点击了保存。
    this.setState({
      newAdding:true,
    });
  }

  render() {
    let {formData,formDataRaw,newAdding} = this.state;
    return (
      <div className={"oa_detail_container ds_detail_container"}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          督办处理单
        </NavBar>
        <div style={{marginTop:'60px'}}>
          {this.state.curSubTab == "content"?
            (<AddContentComp
              tokenunid={this.props.tokenunid}
              moduleNameCn={this.state.moduleNameCn}
              modulename={this.state.modulename}
              formData={formData}
              formDataRaw={formDataRaw}
              newAdding={newAdding}
              formParams={this.state.formParams}
              afterAddNewCall={this.props.afterAddNewCall}
              />):null
          }
        </div>
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
            onPress={() => this.onClickAddNewSave()}
          >
          <div></div>
          </TabBar.Item>
        </TabBar>
      </div>
    )
  }
}

SuperviseAdd.defaultProps = {
};

SuperviseAdd.propTypes = {
  backToTableListCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default SuperviseAdd;
