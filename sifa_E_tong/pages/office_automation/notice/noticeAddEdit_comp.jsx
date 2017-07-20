//通知公告的新增页.
import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import Notice_SendShareComp from './noticeSendShare_comp.jsx';
import Notice_AddEditContentComp from './noticeAddEditContent_comp.jsx';
import { WingBlank, WhiteSpace,NavBar,TabBar} from 'antd-mobile';
import {Icon} from 'antd';
import moment from 'moment';

class Notice_AddEditComp extends React.Component {
  constructor(props) {
      super(props);
      this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
      this.state = {
        curSubTab:'content',
        selectedTab:'',
        moduleNameCn:'信息发布',
        modulename:'xxfb', //模块名
        formParams:{
          lrrq:"",  //录入时间
          lrrName:"",  //录入人。
          fbsj:"",  //发布日期
          wzrq:"",  //文章日期
          gqsj:"",  //有效日期
          bt:"",  //标题
          fbt:"",  //副标题
          wzly:"",  //文章来源。
          lbName:"",  //所属类别。
          gjz:"",  //关键字。
          nr:"",  //内容
          fbfw_fbtoall:"",  //发布范围， "0":全部，"1":指定
          autoshowfj:"",  //是否自动显示附件 ， "0":无，"1":附件
          shbz:"",  //审核情况，有列表。
          candownloadfj:"",  //是否允许下载附件 ，"0":否， "1":是

        },
        isHide:false,
        newAdding:false, //是否正在新建。
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
        console.log("get 签报管理新建时的表单数据:",data);
      }
    });
  }
  onNavBarLeftClick = (e) => {
    this.setState({isHide:true});
    this.props.backToTableListCall();
  }
  onClickAddNewSave = ()=> { //点击了保存。
    this.setState({
      newAdding:true,
    });
  }
  onClickSendShare = ()=>{
    //TODO
  }

  render() {
    let {formData,formDataRaw,newAdding} = this.state;
    return (
      <div className={'oa_detail_container ds_detail_container'}>
        <NavBar className="mobile_navbar_custom"
          style={{position:'fixed',height:'60px',zIndex:'13',width:'100%',top:0}}
          iconName = {false} onLeftClick={this.onNavBarLeftClick}
          leftContent={[
            <Icon type="arrow-left" className="back_arrow_icon" key={2}/>,
            <span key={1}>返回</span>
          ]} >
          信息录入表
        </NavBar>
        <div style={{marginTop:'60px'}}>
            {this.state.curSubTab == "content"?
              (<Notice_AddEditContentComp
                tokenunid={this.props.tokenunid}
                moduleNameCn={this.state.moduleNameCn}
                modulename={this.state.modulename}
                formData={formData}
                formDataRaw={formDataRaw}
                newAdding={newAdding}
                formParams={this.state.formParams}
                afterAddNewCall={this.props.afterAddNewCall} />
              ):null
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
        {/*this.state.curSubTab == "upload"? (<Notice_SendShareComp
          backDetailCall={this.onBackDetailCall}
          isShow={true}/>):null*/}

      </div>
    )
  }
}

Notice_AddEditComp.defaultProps = {
};

Notice_AddEditComp.propTypes = {
  backToTableListCall:React.PropTypes.func,
  // isShow:React.PropTypes.bool,
};

export default Notice_AddEditComp;
