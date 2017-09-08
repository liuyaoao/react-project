
import $ from 'jquery';
import React from 'react';
import {Link} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';

import {Icon,message,notification, Button} from 'antd';
import * as commonUtils from '../utils/common_utils.jsx';
import LogOutComp from '../components/log_out_comp.jsx';
import ModulesAddPcComp  from './modulesAdd_pc_comp.jsx';
import EditUserInfoDialog from './editInfo_dialog.jsx';

import logo_icon from 'images/modules_img/logo_icon.png';
import edit_icon from 'images/modules_img/edit_icon.png';
import OA_icon from 'images/modules_img/OA_icon.png';
import chat_icon from 'images/modules_img/chat_icon.png';
import document_icon from 'images/modules_img/document_icon.png';
import mailList_icon from 'images/modules_img/mailList_icon.png';
import modify_icon from 'images/modules_img/modify_icon.png';
import settings_icon from 'images/modules_img/settings_icon.png';
import signin_icon from 'images/modules_img/signin_icon.png';
import logOut_icon from 'images/modules_img/logOut_icon.png';
import header_icon from 'images/head_boy.png';

import myWebClient from 'client/my_web_client.jsx';

notification.config({
  top: 68,
  duration: 3
});
class ModulesPcComp extends React.Component {
    constructor(props) {
        super(props);
        this.hideAddEditDialog = this.hideAddEditDialog.bind(this);

        // this.handleSendLink = this.handleSendLink.bind(this);
        let delModules = (localStorage.getItem(props.localStoreKey4Modules) || '').split(',');
        delModules = commonUtils.removeNullValueOfArr(delModules);
        (delModules.indexOf(props.notShowModuleIdInPC) == -1)?
          localStorage.setItem(props.localStoreKey4Modules,[props.notShowModuleIdInPC].join(',')):null;
        this.state = {
          colNumPerRow:4,
          showAddDialog:false,
          showDelIcon:false,
          curDelModuleIds:[], //当前删除的模块数的id.
          showItemSum:0, //可显示的模块数。
          itemRowSum:1,
          permissionData:UserStore.getPermissionData(),
          visibleEditModel: false,
          myDetailInfo:{}, // 用户自己的详细信息
          userId: '',
          loginUserName:'',
          loginUserNickname:'',
        };
    }

    componentWillMount(){
      this.refreshModules();
      var me = UserStore.getCurrentUser() || {};
      console.log("me info:",me);
      this.setState({
        userId:me.id,
        loginUserName:me.username||'',
        loginUserNickname:me.nickname||'',
      })
    }

    refreshModules(){
      let delModules = (localStorage.getItem(this.props.localStoreKey4Modules) || '').split(',');
      // console.log("refreshModules--delModules--:",delModules);
      delModules = commonUtils.removeNullValueOfArr(delModules);
      let showItemSum = this.props.allModulesData.length - delModules.length;
      console.log("showItemSum1:",showItemSum);
      this.setState({
        "curDelModuleIds":delModules,
        "showItemSum":showItemSum,
        "itemRowSum":Math.ceil((showItemSum+1)/this.state.colNumPerRow)
      });
    }
    onClickDeleteModule = (e)=>{
      e.stopPropagation();
      let curDelModuleIds = [...this.state.curDelModuleIds];
      curDelModuleIds.push($(e.currentTarget).data("moduleid"));
      localStorage.setItem(this.props.localStoreKey4Modules,curDelModuleIds.join(','));
      this.refreshModules();
    }

    getCurModulesItem = (allModulesData)=>{
      let modulesItem = allModulesData.map((item,index)=>{
        if(this.state.curDelModuleIds.indexOf(item.id) == -1){ //筛选出没被删除的。
          let backColor = item.backColor;
          let canLinkTo = true;
          if(item.canSetPrivilege && !this.state.permissionData[item.linkTo] ){
            canLinkTo = false;
            backColor = '#6f736e'; //如果该模块可设置权限，但是该用户现在没有进入这个模块的权限时，
          }else if(item.name == "OA系统" && (!(UserStore.getCurrentUser() || {}).oaUserName || this.props.oaLoginErrorText) ){
            canLinkTo = false;
          }else if(item.name == "矫正系统" && !(UserStore.getCurrentUser() || {}).redressUserName){
            canLinkTo = false;
          }
          if( canLinkTo && item.tagName == "Link" ){
            return (<span key={index}
                      className={`modules_font modules_item ${item.singleclassName}`}
                      data-module={item.name}
                      data-canlinkto={canLinkTo}
                      onClick={this.handleModuleClick}
                      style={{background:backColor}}>
                      <Link to={item.linkTo}>
                        <img className='' src={item.iconName} style={{}}/>
                        <span>{item.name}</span>
                      </Link>
                      {this.state.showDelIcon?(<Button shape="circle"
                        className={'moduleDelIcon'}
                        icon="close"
                        onClick={this.onClickDeleteModule}
                        data-moduleid={item.id} />):null}
                    </span>);
          }else{
            return (<span key={index}
                        className={`modules_font modules_item ${item.singleclassName}`}
                        data-module={item.name}
                        data-canlinkto={canLinkTo}
                        onClick={this.handleModuleClick}
                        style={{background:backColor}}>
                        <a href="javascript:;">
                          <img className='' src={item.iconName} style={{}}/>
                          <span>{item.name}</span>
                          {this.state.showDelIcon?(<Button shape="circle"
                              className={'moduleDelIcon'}
                              icon="close"
                              onClick={this.onClickDeleteModule}
                              data-moduleid={item.id} />):null}
                        </a>
                    </span>);
          }
          return '';
        }
      });
      modulesItem = commonUtils.removeNullValueOfArr(modulesItem);
      // console.log("modulesItem---:",modulesItem);
      // 添加模块按钮
      modulesItem.push(
        (<a href='javascript:;'
            key={321}
            data-module={'添加'}
            data-canlinkto={true}
            onClick={this.handleModuleClick}
            className='modules_font modules_item plusModule'
            style={{border:'1px solid #fff',
            position:'absolute',top:'0px'}}>
          <span style={{ display: 'inline-block',fontSize: '100px',width: '100%',lineHeight:'140px'}}>+</span>
        </a>)
      );
      let itemRowEles = [];
      for(let i=1;i <= this.state.itemRowSum;i++){
        let itemCols = modulesItem.slice((i-1)*this.state.colNumPerRow,i*this.state.colNumPerRow);
        itemRowEles.push(
          (<div className="row" style={{position:'relative',height:'200px'}} key={i}>
            {itemCols}
           </div>)
        );
      }
      return itemRowEles;
    }

    handleModuleClick = (e)=>{  //点击模块的处理
      let curtarget = e.currentTarget;
      let canLinkTo = $(curtarget).data("canlinkto");
      // console.log("click module name:",$(curtarget).data("module"),canLinkTo);
      let moduleName = $(curtarget).data("module");
      if(!canLinkTo){
        e.stopPropagation();
        let me = UserStore.getCurrentUser() || {};
        if(moduleName == "OA系统" && !me.oaUserName){
          notification.error({
            message:'你还没有进入OA系统的帐号！',
            description: '可以使用管理员帐号登录进系统设置页面添加相应的OA系统的用户名和密码！',
          });
        }else if(moduleName == "OA系统" && this.props.oaLoginErrorText){
          notification.error({
            message:'登录失败!',
            description: this.props.oaLoginErrorText,
          });
        }else if(moduleName == "矫正系统" && !me.redressUserName){
          notification.error({
            message:'你还没有进入矫正系统的帐号！',
            description: '可以使用管理员帐号登录进系统设置页面添加相应的矫正系统的用户名和密码！',
          });
        }else{
          notification.warning({
            message: '你还没有该模块的权限',
            description: '你当前所在的组织没有进入这个模块功能的权限，如有需要请联系管理员！',
          });
        }
        return false;
      }
      if(moduleName == "群聊"){
        this.props.handleGoMatter();
      }else if(moduleName == "OA系统"){

      }else if(moduleName == "添加"){
        this.setState({showAddDialog:true});
      }
    }

    closeAddDialogCall = ()=>{
      this.setState({ showAddDialog:false });
    }
    afterCloseAddDialog = (hasModify)=>{
      if(hasModify){
        this.refreshModules();
      }
    }
    onClickEditModules = (e)=>{
      this.setState({
        showDelIcon:!this.state.showDelIcon,
      });
    }

    onClickNoticeItem = (evt)=>{ //点击了通知公告的某一条
      // console.log("onClickNoticeItem---:",evt,$(evt.currentTarget).data("unid"));
      let docunid = $(evt.currentTarget).data("unid");
      OAUtils.getFormCustomAttachmentList({
        tokenunid: this.props.tokenunid,
        moduleName:"信息发布",
        docunid:docunid,
        successCall: (data)=>{
          console.log("get 通知公告的自定义附件列表 data:",data);
          if(data.values.filelist.length>0){
            let attachItem = data.values.filelist[0];
            let downloadUrl = OAUtils.getCustomAttachmentUrl({
              moduleName:"信息发布",
              fileunid:attachItem.unid
            });
            location.href = downloadUrl;
          }
        }
      });
    }

    hideAddEditDialog() {   // 隐藏编辑的弹窗。
      this.setState({ visibleEditModel: false });
    }

    onClickEditInfo = ()=>{
      myWebClient.getUserInfo(this.state.userId,
        (data,res)=>{
          let parseData = JSON.parse(res.text);
          // console.log("获取个人信息----：",parseData);
          this.setState({
            myDetailInfo:parseData||{},
          });
        },(e, err, res)=>{
          console.log("request server userinfo error info:",err);
        });
      this.setState({visibleEditModel: true });
    }

    render() {
      const { visibleEditModel, menberInfo } = this.state;
      let objsArr = this.props.noticeListData.slice(0,5);
      let noticeListItem =[];
      noticeListItem.push(
        objsArr.map((obj,index)=>{
          return (
              <div key={index} style={{height:'30px'}} data-unid={obj.unid} onClick={this.onClickNoticeItem}>
                <a className="lf" style={{marginLeft:'20px'}} data-unid={obj.unid}>{obj.fileTitle}</a>
                <a className="rt" style={{marginRight:'20px'}}>{obj.publishTime}</a>
              </div>
            )
        })
      );
      let modulesItem = this.getCurModulesItem(this.props.allModulesData);
      // console.log("modulesItem---:",modulesItem);
        return (
            <div className='container modules_page_container'>
              <div className="modules_backgroundImg"></div>
              <div className='modules_content modules_content_pc'>
                <div className='row'>
                  <div className='modules-header'>
                    <div className='col-sm-6 col-xs-6'>
                        <div style={{marginTop:'5px'}}>
                          <img className='' src={logo_icon} style={{width: '54px',marginRight: '15px'}}/>
                          <span style={{display:'inline-block',fontWeight:'bold',color:'#fff',lineHeight:'45px',fontSize:'40px',verticalAlign:'middle'}}>司法E通</span>
                        </div>
                    </div>
                    <div className='col-sm-6 col-xs-6'>
                        <div style={{textAlign:'right',position:'absolute',right:'0',top:'-20px'}}>
                          <a href='javascript:;' className='modules_font hover_font' style={{marginRight:'1.0em'}} onClick={this.onClickEditInfo}>
                            <img className='' src={header_icon} style={{display:'inline-block',width: '30px',margin: '0'}}/>
                            <span> {this.state.loginUserNickname}</span>
                          </a>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <a href='javascript:;' className='modules_font hover_font' style={{marginRight:'1.8em'}} onClick={this.onClickEditModules}>
                            <img className='' src={edit_icon} style={{display:'inline-block',width: '30px',margin: '1.5em 0 2em'}}/>
                            <span>{this.state.showDelIcon?('取消'):('编辑')}</span>
                          </a>
                          <a href='javascript:;' className='modules_font hover_font'>
                            <LogOutComp className="logout_modules_page">
                              <span><img className='' src={logOut_icon} style={{display:'inline-block',width: '30px',margin: '1.5em 0 2em'}}/>退出</span>
                            </LogOutComp>
                          </a>
                        </div>
                    </div>
                  </div>
                </div>
                {modulesItem}

                <div className="row" style={{background:'#fff',height:'205px',width:'98%',marginTop:'20px'}}>
                  <div className="inner">
                    <div className="title" style={{marginLeft:'20px'}}><span className="square" style={{marginRight:'5px'}}></span><span style={{verticalAlign:'text-bottom'}}>内部通知</span></div>
                      <div className="line"></div>
                        <div style={{marginTop:10}}>{noticeListItem}</div>
                  </div>
                </div>
                <div className="modules_footer">
                  <span style={{marginLeft:'15px'}}>版权所有@长沙市司法局</span>
                  <span>ICP备案10200870号</span>
                  <span>技术支持：湖南必和必拓科技发展公司</span>
                </div>

              </div>
              <ModulesAddPcComp
                visible={this.state.showAddDialog}
                allModulesData={this.props.allModulesData}
                localStoreKey4Modules={this.props.localStoreKey4Modules}
                closeAddDialogCall={this.closeAddDialogCall}
                notShowModuleIdInPC={this.props.notShowModuleIdInPC}
                afterCloseAddDialog={this.afterCloseAddDialog}/>

              <EditUserInfoDialog
                visible={visibleEditModel}
                initUserInfo={this.props.initUserInfo}
                menberInfo={this.state.myDetailInfo}
                closeDialogCall={this.hideAddEditDialog}
                ></EditUserInfoDialog>
            </div>
        );
    }
}

ModulesPcComp.defaultProps = {
};
ModulesPcComp.propTypes = {
  allModulesData:React.PropTypes.array,
  handleGoMatter:React.PropTypes.func,
  localStoreKey4Modules:React.PropTypes.string,
  notShowModuleIdInMobile:React.PropTypes.string,
  notShowModuleIdInPC:React.PropTypes.string
    // params: React.PropTypes.object.isRequired
};

export default ModulesPcComp;
