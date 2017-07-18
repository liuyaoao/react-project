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
          wjbt:'',  //标题。
        },
        newAdding:false, //是否正在新建。
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
        console.log("get 发文管理的表单数据:",data,formData);
      }
    });
  }
  onNavBarLeftClick = (e) => {
    this.setState({curSubTab:'content'});
    this.props.backToTableListCall();
  }

  onClickAddNewSave = ()=> {
    // Toast.info('保存成功!', 1);
    this.setState({
      newAdding:true,
    });
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
              formData={formData}
              formDataRaw={formDataRaw}
              newAdding={newAdding}
              backToTableListCall={()=>this.props.backToTableListCall()} />
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
