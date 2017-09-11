
import $ from 'jquery';
import React from 'react';
import {Link} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';
import * as OAUtils from 'pages/utils/OA_utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import {Popup, Toast, List, NavBar, Button,Badge}  from 'antd-mobile';
import {Icon,Row, Col,Button as ButtonPc, Checkbox,Spin} from 'antd';

import * as commonUtils from '../utils/common_utils.jsx';
import LogOutComp from '../components/log_out_comp.jsx'
import EditUserInfoDialog from './editInfo_dialog.jsx';

import signup_logo from 'images/signup_logo.png';
import notice_icon from 'images/modules_img/notice_icon.png';
import header_icon from 'images/head_boy.png';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class ModulesMobileComp extends React.Component {
    constructor(props) {
        super(props);
        this.hideAddEditDialog = this.hideAddEditDialog.bind(this);

        // this.handleSendLink = this.handleSendLink.bind(this);
        let delModules = (localStorage.getItem(props.localStoreKey4Modules) || '').split(',');
        delModules = commonUtils.removeNullValueOfArr(delModules);
        (delModules.indexOf(props.notShowModuleIdInMobile) == -1)?
          localStorage.setItem(props.localStoreKey4Modules,[props.notShowModuleIdInMobile].join(',')):null;
        this.state = {
          colNumPerRow:3,
          showDelIcon:false,
          curDelModuleIds:[], //当前删除的模块数的id.
          showItemSum:0, //可显示的模块数。
          itemRowSum:1,
          permissionData:UserStore.getPermissionData(),
          loadingModuleName:"", //正在加载的模块名
          todoTotalItemCount:0, //OA待办事项的总条数。
          visibleEditModel: false,
          myDetailInfo:{},
          loginUserName:'',
          loginUserNickname:'',
          userId:'',
        };
    }
    componentWillMount(){
      this.refreshModules();
      var me = UserStore.getCurrentUser() || {};
      this.setState({
        userId:me.id,
        loginUserName:me.username || '',
        loginUserNickname:me.nickname || '',
      });
      OAUtils.loginOASystem({oaUserName:me.oaUserName,oaPassword:me.oaPassword}, (res)=>{ //登录OA系统获取认证id。
        this.getServerTODOListData(res.values.tockenunid);
      });
    }
    getServerTODOListData = (tokenunid)=>{ //获取OA系统的待办事项列表
      OAUtils.getPersonalTodoListData({
        tokenunid: tokenunid,
        currentpage:1,
        urlparam:{ key:'dbsx',type:3 },
        viewcolumntitles:'标题,模块',
        successCall: (data)=>{
          // console.log("待办事项的list,为了获取待办事项数目--:",data);
          localStorage.setItem("sifa_e_tong_todoItemCount",data.itemcount);
          this.setState({
            todoTotalItemCount:data.itemcount,
          });
        }
      });
    }
    refreshModules(){
      let delModules = (localStorage.getItem(this.props.localStoreKey4Modules) || '').split(',');
      delModules = commonUtils.removeNullValueOfArr(delModules);
      // console.log("refreshModules--delModules--:",delModules);
      let showItemSum = this.props.allModulesData.length - delModules.length;
      // console.log("showItemSum:",showItemSum);
      let itemRowSum = Math.ceil((showItemSum+1)/this.state.colNumPerRow);
      if(showItemSum%this.state.colNumPerRow == 0){
        itemRowSum+=1;
      }
      this.setState({
        "curDelModuleIds":delModules,
        "showItemSum":showItemSum,
        "itemRowSum":itemRowSum
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
      console.log('permissionData:',this.state.permissionData);
      let modulesItem = allModulesData.map((item,index)=>{
        if(this.state.curDelModuleIds.indexOf(item.id) == -1){ //筛选出没被删除的。
          let backColor = item.backColor;
          let canLinkTo = true;
          if(item.canSetPrivilege && !this.state.permissionData[item.linkTo] ){
            canLinkTo = false;
            backColor = '#6f736e'; //如果该模块可设置权限，但是该用户现在没有进入这个模块的权限时，
          }else if(item.name == "OA系统" && (!(UserStore.getCurrentUser()||{}).oaUserName || this.props.oaLoginErrorText)){
            canLinkTo = false;
          }else if(item.name == "矫正系统" && !(UserStore.getCurrentUser()||{}).redressUserName){
            canLinkTo = false;
          }
          if(canLinkTo && item.tagName == "Link"){
            return (
              <Col span={6} key={index} className='modules_item_mobile'>
                <div data-module={item.name} data-canlinkto={canLinkTo} onClick={this.handleModuleClick}>
                <Link to={item.linkTo}
                      data-module={item.name}
                      data-canlinkto={canLinkTo}
                      className={item.singleclassName}
                      style={{background:backColor}}>
                  <img className='' src={item.iconName} style={{}}/>
                  {this.state.loadingModuleName==item.name?<Spin size="large" className="loading_spin_cnt"/>:null}
                </Link>
                </div>
                <span>
                  {item.name}
                  {item.name=="OA系统"?<Badge style={{width:'26px'}} text={this.state.todoTotalItemCount} overflowCount={99} />:null}
                </span>
                {this.state.showDelIcon?
                  (<ButtonPc shape="circle"
                    className={'moduleDelIcon'}
                    onClick={this.onClickDeleteModule}
                    type={'default'}
                    icon="close"
                    data-moduleid={item.id} />):null
                }
              </Col>
            );
          }else{
            return (
              <Col span={6} key={index} className='modules_item_mobile'>
                <a href="javascript:;"
                    key={index}
                    data-module={item.name}
                    data-canlinkto={canLinkTo}
                    onClick={this.handleModuleClick}
                    className={item.singleclassName}
                    style={{background:backColor}}>
                  <img className='' src={item.iconName} style={{}}/>
                  {this.state.loadingModuleName==item.name?<Spin size="large" className="loading_spin_cnt"/>:null}
                </a>
                <span>{item.name}</span>
                {this.state.showDelIcon?(<ButtonPc shape="circle"
                  className={'moduleDelIcon'}
                  type={'default'}
                  onClick={this.onClickDeleteModule}
                  icon="close"
                  data-moduleid={item.id} />):null}
                </Col>
              );
          }
          return '';
        }
      });
      modulesItem = commonUtils.removeNullValueOfArr(modulesItem);
      // console.log("modulesItem---:",modulesItem);
      // 添加模块按钮
      modulesItem.push(
        (<Col span={6} key={666} className='modules_item_mobile'>
          <div onClick={this.handleModuleClick} className="add_more_btn_cnt" data-module={'添加'} data-canlinkto={true}>
            <ButtonPc className="add_more_btn"  icon="plus" style={{fontSize:'0.5rem'}} />
          </div>
        </Col>)
      );
       //表示最后一行的item不是刚好是colNumPerRow这个数,需要补足空的Col列。
      if((this.state.showItemSum+1)/this.state.colNumPerRow > 0){
        let emptyColNum = this.state.colNumPerRow - (this.state.showItemSum+1)%this.state.colNumPerRow;
        for(let i=0;i<emptyColNum;i++){
          modulesItem.push(
            (<Col span={6} key={668+i} className='modules_item_mobile'>
            </Col>)
          );
        }
      }
      let itemRowEles = [];
      for(let i=1;i <= this.state.itemRowSum;i++){
        let itemCols = modulesItem.slice((i-1)*this.state.colNumPerRow,i*this.state.colNumPerRow);
        itemRowEles.push(
          (<Row key={i} type="flex" justify="space-between" align="bottom" className="modules_content_row">
            {itemCols}
           </Row>)
        );
      }
      return itemRowEles;
    }
    handleModuleClick = (e)=>{
      let curtarget = e.currentTarget;
      let canLinkTo = $(curtarget).data("canlinkto");
      // console.log("click module name:",$(curtarget).data("module"),canLinkTo);
      let moduleName = $(curtarget).data("module");
      if(!canLinkTo){
        e.stopPropagation();
        let me = UserStore.getCurrentUser() || {};
        if(moduleName == "OA系统" && !me.oaUserName){
          Toast.info('你还没有OA系统的帐号', 2, null, false);
        }else if(moduleName == "OA系统" && this.props.oaLoginErrorText){
          Toast.info(this.props.oaLoginErrorText, 2, null, false);
        }else if(moduleName == "矫正系统" && !me.redressUserName){
          Toast.info('你还没有矫正系统的帐号', 2, null, false);
        }else{
          Toast.info('你还没有该模块的权限', 2, null, false);
        }
        return false;
      }
      if(moduleName == "群聊"){
        this.props.handleGoMatter();
      }else if(moduleName == "添加"){
        // message.success("你点击了添加模块按钮了！");
        this.showPopup();
      }
      //显示loading信息
      if(this.state.loadingModuleName!=""){
        e.stopPropagation();
        return false;
      }
      moduleName == "添加"?null:this.setState({loadingModuleName:moduleName});
    }
    onNavBarLeftClick = (e)=>{
      // console.log("onNavBarLeftClick:",e);
      this.setState({
        showDelIcon:!this.state.showDelIcon,
      });
    }

    onCheckboxChange = (e)=>{
      let moduleId = e.target["data-moduleid"];
      // console.log("onCheckboxChange --e:",e);
      let curDelModuleIds = [...this.state.curDelModuleIds];
      if(e.target.checked){
      curDelModuleIds = commonUtils.removeValueFromArr(curDelModuleIds,moduleId);
        this.setState({ curDelModuleIds });
      }else{
        if(curDelModuleIds.indexOf(moduleId) == -1){
          curDelModuleIds.push(moduleId);
          this.setState({ curDelModuleIds });
        }
      }
      localStorage.setItem(this.props.localStoreKey4Modules,curDelModuleIds.join(','));
      this.refreshModules();
      this.onClosePopup();
    }

    getModulesItemList(){
      let modulesItem = this.props.allModulesData.map((item,index)=>{
        let isChecked = this.state.curDelModuleIds.indexOf(item.id) == -1;
        if(item.id == this.props.notShowModuleIdInMobile){
          return "";
        }
        return (
          <Row key={item.id} style={{width:'100%'}}>
            <Col span={24} className={'checkbox_'+item.id}>
              <Checkbox
                onChange={this.onCheckboxChange}
                style={{fontSize:'1em',padding:'0.3rem 1em 0'}}
                checked={isChecked}
                data-moduleid={item.id}>
                {item.name}
              </Checkbox>
            </Col>
          </Row>
          )
      });
      modulesItem = commonUtils.removeNullValueOfArr(modulesItem);
      return modulesItem;
    }
    showPopup = () => {
      this.setState({showDelIcon:false});
      let moduleItems = this.getModulesItemList();
      Popup.show(<div>
        <List renderHeader={() => (
          <div style={{ position: 'relative',height:'1.5em',fontSize:'1.5em',color:'black' }}>
            添加模块
            <span
              style={{position: 'absolute', right: '0', top: '0'}}
              onClick={() => this.onClosePopup()} >
              <Icon type="close" />
            </span>
          </div>)}
          className="popup-modules_mobile-list"
        >
          {moduleItems}
        </List>
        <ul style={{ padding: '0.18rem 0.3rem', listStyle: 'none' }}>
        </ul>
      </div>, { animationType: 'slide-up', maskClosable: true });
    }
    onClosePopup = (hasModify) => {
      if(hasModify){
        // this.refreshModules();
      }
      Popup.hide();
    }
    onClickNoticeItem = (evt)=>{ //点击了通知公告的某一条
      // console.log("onClickNoticeItem---:",evt,$(evt.currentTarget).data("unid"));
      let docunid = $(evt.currentTarget).data("unid");
      OAUtils.getFormCustomAttachmentList({
        tokenunid: this.props.tokenunid,
        moduleName:"信息发布",
        docunid:docunid,
        successCall: (data)=>{
          // console.log("get 通知公告的自定义附件列表 data:",data);
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
      let listItem =[];
      listItem.push(
          objsArr.map((obj,index)=>{
            return (
              <div key={index} className="notice_row" data-unid={obj.unid} onClick={this.onClickNoticeItem}>
                <i className="dot"></i>
                <a className="lf" data-unid={obj.unid}><Icon type="download"/>{obj.fileTitle}</a>
                <a className="rt">{obj.publishTime}</a>
              </div>)
          })
        );
        let modulesItem = this.getCurModulesItem(this.props.allModulesData);
        return (
            <div className='modules_page_container modules_page_container_mobile'>
              <NavBar
                style={{position:'fixed',height:'60px',zIndex:'12',width:'100%',top:0}}
                className="mobile_navbar_custom"
                iconName = {false}
                leftContent={[
                  <Icon type="appstore-o" style={{ fontSize: '25px' }} className="back_arrow_icon" key={19475609}/>,
                  <span style={{fontSize:'1.2em',margin:'0 0 5px 6px'}} key={93}>{this.state.showDelIcon?('取消'):null}</span>
                ]}
                onLeftClick={this.onNavBarLeftClick}
                rightContent={[
                  <div key={'modify_user_info99'}
                    onClick={this.onClickEditInfo}
                    style={{textAlign:'right',cursor:"pointer"}}>
                    <img className='' src={header_icon} style={{display:'inline-block',width: '30px',margin: '0'}}/>
                  </div>,
                  <LogOutComp key={'logoutcomp_123456'}><span style={{fontSize:'1em'}} key={909}>退出</span></LogOutComp>
                ]} >
                <img width="35" height="35" src={signup_logo}/>司法E通
              </NavBar>
              <div className='modules_content modules_content_mobile' style={{}}>
                {modulesItem}

              </div>
                <div className="row modules_bottom_mobile" style={{height:'220px',margin:'0 auto'}}>
                  <div className="inner">
                    <div className="title_mobile">
                      <span className=""><img src={notice_icon}/></span>
                      <span>内部通知</span>
                    </div>
                      <div className="line"></div>
                      {listItem}
                  </div>
                </div>
                {/*<div className="modules_footer row">
                  <span>版权所有@长沙市司法局</span>
                  <span>ICP备案10200870号</span>
                  <span>技术支持：湖南必和必拓科技发展公司</span>
                </div>*/}

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

ModulesMobileComp.defaultProps = {
};
ModulesMobileComp.propTypes = {
  allModulesData:React.PropTypes.array,
  handleGoMatter:React.PropTypes.func,
  localStoreKey4Modules:React.PropTypes.string,
  notShowModuleIdInMobile:React.PropTypes.string
    // params: React.PropTypes.object.isRequired
};

export default ModulesMobileComp;
