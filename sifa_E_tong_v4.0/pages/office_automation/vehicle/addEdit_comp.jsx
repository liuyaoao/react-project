//通知公告的新增页.
import $ from 'jquery';
import React from 'react';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
// import Notice_SendShareComp from './noticeSendShare_comp.jsx';
import AddEditContentComp from './addEditContent_comp.jsx';
// import CommonSendComp from '../common_send_comp.jsx';
// import CommonVerifyComp from '../common_verify_comp.jsx';

import { WingBlank, WhiteSpace,NavBar,TabBar} from 'antd-mobile';
import {Icon} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
const zhNow = moment().locale('zh-cn').utcOffset(8);

class Vehicle_AddEditComp extends React.Component {
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
        console.log("get 车辆管理新建时的表单数据:",data);
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
          style={{position:'fixed',height:'60px',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          车辆申请
        </NavBar>
        <div style={{marginTop:'60px'}}>
          {this.state.curSubTab == "content"?
            (<AddEditContentComp
              tokenunid={this.props.tokenunid}
              moduleNameCn={this.state.moduleNameCn}
              modulename={this.state.modulename}
              formData={formData}
              formDataRaw={formDataRaw}
              newAdding={newAdding}
              formParams={this.state.formParams}
              afterAddNewCall={this.props.afterAddNewCall}
              />):null}
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

Vehicle_AddEditComp.defaultProps = {
};
Vehicle_AddEditComp.propTypes = {
  backToTableListCall:React.PropTypes.func,
};
export default Vehicle_AddEditComp;
