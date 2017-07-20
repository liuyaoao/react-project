//发文管理的新建页.
import $ from 'jquery';
import React from 'react';
// import * as Utils from 'utils/utils.jsx';
// import myWebClient from 'client/my_web_client.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import { WingBlank, WhiteSpace, Button, NavBar, TabBar, Toast } from 'antd-mobile';
import { Icon} from 'antd';
import DS_AddContentComp from './ds_add_content_comp.jsx';

class DS_AddComp extends React.Component {
  constructor(props) {
      super(props);
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
        newAdding:false, //是否正在新建。
        curSubTab:'content',
        dispatchTypes:{  //诡异的编码方式。
          "发文":"·¢ÎÄ",
          "领导小组发文":"Áìµ¼Ð¡×é·¢ÎÄ",
          "领导小组办公室发文":"Áìµ¼Ð¡×é°ì¹«ÊÒ·¢ÎÄ"
        },
        formData:{},
        formDataRaw: {}
      };
  }
  componentWillMount(){
    this.getServerFormData(this.state.dispatchTypes['发文']);
  }
  getServerFormData = (inifwlx)=>{
    OAUtils.getModuleFormData({
      moduleName:this.state.moduleNameCn,
      tokenunid:this.props.tokenunid,
      // unid:this.props.detailInfo.unid,
      "inifwlx":inifwlx,
      formParams:this.state.formParams, //特有的表单参数数据。
      successCall: (data)=>{
        let formDataRaw = data.values;
        let formData = OAUtils.formatFormData(data.values);
        this.setState({
          formData,
          formDataRaw
        });
        console.log("get 发文管理新建时的表单数据:",data);
      }
    });
  }
  onNavBarLeftClick = (e) => {
    this.setState({curSubTab:'content'});
    this.props.backToTableListCall();
  }
  onClickAddNewSave = ()=> { //点击了保存。
    this.setState({
      newAdding:true,
    });
  }
  changeDispatchTypeCall = (dispatchTypeCn)=>{
    this.getServerFormData(this.state.dispatchTypes[dispatchTypeCn]);
  }
  render() {
     const { detailInfo } = this.props;
     const {formData,formDataRaw,newAdding} = this.state;
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
            (<DS_AddContentComp
              tokenunid={this.props.tokenunid}
              moduleNameCn={this.state.moduleNameCn}
              modulename={this.state.modulename}
              formData={formData}
              formDataRaw={formDataRaw}
              newAdding={newAdding}
              formParams={this.state.formParams}
              changeDispatchTypeCall={this.changeDispatchTypeCall}
              afterAddNewCall={this.props.afterAddNewCall} />
            ):null
          }
          <div className="custom_tabBar">
            <TabBar
              unselectedTintColor="#949494"
              tintColor="#33A3F4"
              barTintColor="white"
              hidden={this.state.hidden}>
              <TabBar.Item
                icon={<Icon type="save" size="lg" />}
                selectedIcon={<Icon type="save" size="lg" style={{color:"rgb(51, 163, 244)"}} />}
                title="保存"
                key="保存"
                selected={this.state.selectedTab === 'redTab'}
                onPress={() => this.onClickAddNewSave()}
                data-seed="logId1">
                <div></div>
              </TabBar.Item>
            </TabBar>
          </div>
        </div>
      </div>
    )
  }
}

DS_AddComp.defaultProps = {
};

DS_AddComp.propTypes = {
  // onBackDetailCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default DS_AddComp;
