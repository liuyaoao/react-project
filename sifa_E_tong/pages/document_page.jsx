// 档案管理的页面
import $ from 'jquery';
import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';

import * as Utils from 'utils/utils.jsx';
import Client from 'client/web_client.jsx';
import MyWebClient from 'client/my_web_client.jsx';
import LogOutComp from './components/log_out_comp.jsx';

import moment from 'moment';

import { SwipeAction } from 'antd-mobile';
import { Drawer, List, NavBar, Popup, Modal as ModalAm } from 'antd-mobile';
const ModalAmAlert = ModalAm.alert;
import { Layout, Menu, Breadcrumb, Icon, Row, Col, Table, Modal, notification } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;
const confirm = Modal.confirm;

import signup_logo from 'images/signup_logo.png';

import WrappedSearchFormPC from './document/search_form_pc.jsx';
import WrappedSearchFormMobile from './document/search_form_mobile.jsx';
import DocumentEditModalPC from './document/edit_modal_pc.jsx';
import DocumentEditLawyerModalPC from './document/edit_lawyer_modal_pc.jsx';
import DocumentEditLawfirmModalPC from './document/edit_lawfim_modal_pc.jsx';
import DocumentEditJudExamModalPC from './document/edit_judicialexam_modal_pc.jsx'
import DocumentEditLegalWorkerModalPC from './document/edit_legalWorker_modal_pc.jsx';
import DocumentEditSifaDirectorModalPC from './document/edit_sifaDirector_modal_pc.jsx';

import DocumentSidebar from './document/document_sidebar.jsx';
import DocumentListPC from './document/documentList_pc_comp.jsx';
import DocumentListMobile from './document/documentList_mobile_comp.jsx';

class DocumentPage extends React.Component {
    constructor(props) {
        super(props);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.handleShowEditModal = this.handleShowEditModal.bind(this);
        this.handleCancelModal = this.handleCancelModal.bind(this);
        this.showDeleteConfirm =this.showDeleteConfirm.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.state = this.getStateFromStores();
    }
    getStateFromStores() {
      let permissionData = UserStore.getPermissionData();
      let hasOperaPermission = permissionData['sys_config'] ? permissionData['sys_config'].indexOf('action') != -1 : false;
      return {
          open: false,
          position: 'left',
          isMobile: Utils.isMobile(),
          visibleEditModel: false,
          documentsData: [],
          loginUserName:'',
          memberInfo: {},
          searchParam: {},
          currentFileId: '',  //当前展开的第一级 id.
          currentFileSubId: '', //当前展开的第二级的 id.
          curDepartmentId: '', //当前点击的第三级部门 id。
          // departmentTypes: [],
          hasOperaPermission:hasOperaPermission, //是否有操作权限。
          departmentData: [],
          departmentFlatData:[],  //平行数组结构
          departmentFlatMap:{},
      };
  }
  onOpenChange = (...args) => {
    // console.log(args);
    this.setState({ open: !this.state.open });
  }
  onNavBarLeftClick = (e) => {  //navbar left click.
    browserHistory.push('/');
  }
  onClickBackToModules(){
    browserHistory.push('/modules');
  }
  componentWillMount() {
    let _this = this;
    var me = UserStore.getCurrentUser() || {};
    this.setState({loginUserName:me.username || ''});
    this.getFileDepartment(me.organizations,(departmentData)=>{
      var firstObj = departmentData[0];
      this.setState({
        currentFileId:firstObj.resourceId,
      });
      this.handleSearch({ currentFileId:firstObj.resourceId });
    });
  }
  componentWillUnmount() {
  }
  getFileDepartment(organizations,callback) { //权限部门数据
    let _this = this;
    MyWebClient.getFileDepartment(organizations,
      (data, res) => {
        if (res && res.ok) {
          let departmentData = JSON.parse(res.text);
          let departmentFlatData = this.parseFileDepartmentResource(departmentData,1);
          let departmentFlatMap = this.getPermissionFlatMap(departmentFlatData);
          // console.log("departmentData-档案管理-权限部门数据-:",departmentData,departmentFlatMap);
          this.setState({
            departmentData: departmentData,
            departmentFlatData:departmentFlatData,
            departmentFlatMap:departmentFlatMap,
          });
          callback && callback(departmentData);
        }
      },
      (e, err, res) => {
        console.log('get error:', res ? res.text : '');
      }
    );
  }
  handleSearch(paramsIdArr) { //paramsId :{currentFileId, currentFileSubId, curDepartmentId}
    let params = { //查询参数。
      fileInfoType:'',
      fileInfoSubType:'',
      department:''
    };
    if(!paramsIdArr){
      paramsIdArr = {
        currentFileId:this.state.currentFileId,
        currentFileSubId:this.state.currentFileSubId,
        curDepartmentId:this.state.curDepartmentId,
      }
    }
    params.fileInfoType = this.state.departmentFlatMap[paramsIdArr.currentFileId].resourceName;
    params.fileInfoSubType = paramsIdArr.currentFileSubId?this.state.departmentFlatMap[paramsIdArr.currentFileSubId].resourceName:"";
    if(!paramsIdArr.currentFileSubId){
      let currentFileSubIdArr = [];
      let fileInfoSubTypeArr = this.state.departmentFlatMap[paramsIdArr.currentFileId].sub.map((item)=>{
        currentFileSubIdArr.push(item.resourceId);
        return item.resourceName;
      });
      params.fileInfoSubType = fileInfoSubTypeArr.join(',');
      paramsIdArr.currentFileSubId = currentFileSubIdArr.join(',');
    }

    params.department = paramsIdArr.curDepartmentId?this.state.departmentFlatMap[paramsIdArr.curDepartmentId].resourceName:"";
    if(!paramsIdArr.curDepartmentId){
      let departmentArr = [];
      paramsIdArr.currentFileSubId.split(',').map((fileSubId)=>{
        if(this.state.departmentFlatMap[fileSubId].sub && this.state.departmentFlatMap[fileSubId].sub.length>0){
          this.state.departmentFlatMap[fileSubId].sub.map((item)=>{
            departmentArr.push( item.resourceName );
          });
        }
      });
      departmentArr.length>0?params.department = departmentArr.join(','):null;
    }
    MyWebClient.getSearchFileInfo(params,
      (data, res) => {
        if (res && res.ok) {
          let documentsData = JSON.parse(res.text);
           console.log("documentsData-list-结果列表-:",documentsData);
          this.setState({ documentsData });
          // if (!this.state.departmentTypes.length) {
          //   const departArr = [];
          //   for (var i = 0; i < documentsData.length; i++) {
          //     if (departArr.indexOf(documentsData[i].department) === -1) {
          //       departArr.push(documentsData[i].department);
          //     }
          //   }
          //   this.setState({ departmentTypes: departArr });
          // }
        }
      },
      (e, err, res) => {
        console.log('get error:', res ? res.text : '');
      }
    );
  }

  parseFileDepartmentResource(objArr,level) { //得到平级的权限部门数据。
    let flatArr = [];
    $.each(objArr, (index, obj)=>{
      obj.resourceId = obj.id;
      obj.resourceName = obj.name;
      obj.level = level;
      if(!obj.sub || obj.sub.length<=0){ //已经是子节点了。
        flatArr.push(this.copyPermissionAttrData(obj));
      }else{ //表示还有孩子节点存在。
        let tempObj = this.copyPermissionAttrData(obj);
        tempObj['subNum'] = obj.sub.length;
        tempObj["sub"] = obj.sub;
        flatArr.push(tempObj);
        let childConfig = obj.sub;
        let childrens = this.parseFileDepartmentResource(childConfig,level+1);
        flatArr.push(...childrens); //递归调用
      }
    });
    return flatArr;
  }
  copyPermissionAttrData(obj){
    return {
      parntName:obj.parntName,
      id:obj.id,
      name:obj.name,
      resourceId:obj.resourceId,
      resourceName:obj.resourceName,
      level:obj.level,
      subNum:0
    }
  }
  getPermissionFlatMap(flatDataArr) {
    let flatDataMap = {};
    $.each(flatDataArr,(index,obj)=>{  //平行的键值对的map结构。
      flatDataMap[obj.resourceId] = obj;
    });
    return flatDataMap;
  }
  handleShowEditModal(record) {
    const {documentsData} = this.state;
    let docObj = {};
    for (let i = 0; i < documentsData.length; i++) {
      if (documentsData[i].id == record.key) {
        record = documentsData[i], docObj = documentsData[i];
      }
    }
    this.setState({ memberInfo: record });
    this.setState({ visibleEditModel: true });
    Object.keys(docObj).forEach((key) => {
      if (key == 'birthDay' || key == 'joinPartyTime' || key == 'joinWorkerTime'
        || key == 'reportingTime' || key == 'approvalTime' || key == 'appointAndRemoveTime' ) {
        docObj[key] = docObj[key] ? moment(docObj[key], 'YYYY-MM-DD') : null;
      }
    });
  }
  handleCancelModal() {
    this.setState({ visibleEditModel: false });
  }
  showDeleteConfirm(doc, callback) {
    let _this = this;
    if (this.state.isMobile) {
      ModalAmAlert('删除', '确认删除吗 ?', [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确认', onPress: () => {if (doc.key) {
          _this.handleDeleteDocument(doc.key.toUpperCase(), callback);
        }}, style: { fontWeight: 'bold' } },
      ]);
    } else {
      confirm({
        title: '确认删除吗 ?',
        content: '',
        onOk() {
          if (doc.key) {
            _this.handleDeleteDocument(doc.key.toUpperCase(), callback);
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }
  handleDeleteDocument(id, callback) {
    let _this = this;
    MyWebClient.deleteFileInfo(id,
      (data, res) => {
        if (res && res.ok) {
          if (res.text === 'true') {
            _this.openNotification('success', '删除档案成功');
            _this.handleSearch();
          } else {
            _this.openNotification('error', '删除档案失败');
          }
        }
      },
      (e, err, res) => {
        _this.openNotification('error', '删除档案失败');
      }
    )
  }
  showDeleteAllConfirm = ()=>{ //是否确认一键全部删除
    let _this = this;
    if (this.state.isMobile) {
      ModalAmAlert('删除', '确认一键全部删除吗 ?', [
        { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
        { text: '确认', onPress: () => {
          _this.handleDeleteAllDocument();
        }, style: { fontWeight: 'bold' } },
      ]);
    } else {
      confirm({
        title: '确认删除吗 ?',
        content: '',
        onOk() {
          _this.handleDeleteAllDocument();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }
  handleDeleteAllDocument(){
    let _this = this;
    MyWebClient.deleteFileInfoAll({
      fileInfoType:this.state.currentFileId,
      fileInfoSubType:this.state.currentFileSubId,
    },
      (data, res) => {
        if (res && res.ok) {
          if (res.text === 'true') {
            _this.openNotification('success', '删除全部档案成功');
            _this.handleSearch();
          } else {
            _this.openNotification('error', '删除全部档案失败');
          }
        }
      },
      (e, err, res) => {
        _this.openNotification('error', '删除全部档案失败');
      }
    )
  }
  openNotification(type, message) {
    notification.config({
      top: 68,
      duration: 3
    });
    notification[type]({
      message: message
    });
  }
  setcurrentFileId(currentFileId){
    this.setState({ currentFileId});
  }
  setcurrentFileSubId(currentFileSubId) {
    this.setState({currentFileSubId});
  }
  setcurDepartmentId(curDepartmentId, callback) {
    this.setState({curDepartmentId});
  }
  getMobileElements(sidebar){
    const drawerProps = {
      open: this.state.open,
      position: this.state.position,
      onOpenChange: this.onOpenChange,
    };
    let content = this.getListContentElements();
    return (
      <div>
        <Drawer
          className="address_book_drawer"
          style={{ minHeight: document.documentElement.clientHeight - 200 }}
          touch={true}
          sidebarStyle={{height:'100%',background:'#2071a7'}}
          contentStyle={{ color: '#A6A6A6'}}
          sidebar={sidebar}
          {...drawerProps} >
            <NavBar
              style={{position:'fixed',height:'60px',zIndex:'13',width:'100%'}}
              className="mobile_navbar_custom"
              iconName = {false}
              leftContent={[ <Icon type="arrow-left" className="back_arrow_icon" key={192384756}/>,<span style={{fontSize:'1em'}} key={13212343653}>返回</span>]}
              onLeftClick={this.onNavBarLeftClick}
              rightContent={[ <Icon key="1" type="ellipsis" onClick={this.onOpenChange}/>]} >
              <img width="35" height="35" src={signup_logo}/>司法E通
            </NavBar>
            <div style={{marginTop:'60px'}}>{content}</div>
          </Drawer>
        </div>
      );
  }
  getPCElements(sidebar){
    const {currentFileId, currentFileSubId, curDepartmentId} = this.state;
    let currentFileName = currentFileId?this.state.departmentFlatMap[currentFileId].resourceName:'';
    let currentFileSubName = currentFileSubId?this.state.departmentFlatMap[currentFileSubId].resourceName:'';
    let curDepartmentName = curDepartmentId?this.state.departmentFlatMap[curDepartmentId].resourceName:'';
    let content = this.getListContentElements();
    return ( <Layout style={{ height: '100vh' }}>
              <Header className="header custom_ant_header addressbook_header" style={{position:'fixed',width:'100%',zIndex:'13'}}>
                <div className="custom_ant_header_logo addressbook_logo" onClick={this.onClickBackToModules}>
                  <span className="logo_icon"><img width="40" height="40" src={signup_logo}/></span>
                  <div className="logo_title">
                    <p>@{this.state.loginUserName}</p><p>司法E通</p>
                    </div>
                </div>
                <Breadcrumb className="bread_content" style={{ margin: '0 10px',float:'left' }}>
                  <Breadcrumb.Item className="bread_item">{currentFileName}</Breadcrumb.Item>
                  <Breadcrumb.Item className="bread_item">{currentFileSubName}</Breadcrumb.Item>
                  <Breadcrumb.Item className="bread_item">{curDepartmentName}</Breadcrumb.Item>
                </Breadcrumb>
                <div className="" style={{position:'absolute',right:'32px',top:'0'}}><LogOutComp className="" addGoBackBtn/></div>
              </Header>
              <Layout style={{marginTop:'64px'}}>
                {sidebar}
                <Layout style={{ padding: '0' }}>
                  <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280,overflow: 'initial' }}>
                    {content}
                  </Content>
                </Layout>
              </Layout>
        </Layout>);
  }
  getSearchForm() {
    const {currentFileId, currentFileSubId, departmentData,curDepartmentId,departmentFlatMap} = this.state;
    return this.state.isMobile ?
            (
              <WrappedSearchFormMobile
                departmentData={departmentData}
                departmentFlatMap={departmentFlatMap}
                currentFileId={currentFileId}
                currentFileSubId={currentFileSubId}
                curDepartmentId={curDepartmentId}
                showDeleteAllConfirm={this.showDeleteAllConfirm}
                handleSearch={this.handleSearch} />
            ) :(
              <WrappedSearchFormPC
                ref="searchFormPC"
                departmentData={departmentData}
                departmentFlatMap={departmentFlatMap}
                currentFileId={currentFileId}
                currentFileSubId={currentFileSubId}
                handleSearch={this.handleSearch}
                curDepartmentId={curDepartmentId}
                openNotification={this.openNotification}/>
          );
  }
  getSearchResultTable() {
    const {documentsData,departmentData, currentFileId, currentFileSubId, curDepartmentId} = this.state;
    // console.log("documentsData---:",documentsData);
    for (let i = 0; i < documentsData.length; i++) {
      documentsData[i]['key'] = documentsData[i].id;
    }
    const data = documentsData;
    let docSearchPCList = (
      <DocumentListPC data={data}
        currentFileId={currentFileId}
        currentFileSubId={currentFileSubId}
        curDepartmentId={curDepartmentId}
        departmentData={departmentData}
        showDeleteConfirm={this.showDeleteConfirm}
        showDeleteAllConfirm={this.showDeleteAllConfirm}
        handleShowEditModal={this.handleShowEditModal}
        handleSearch={this.handleSearch}></DocumentListPC>
    )

    let docSearchMobileList = (//构造手机端的列表视图
      <DocumentListMobile data={data}
        currentFileId={currentFileId}
        currentFileSubId={currentFileSubId}
        curDepartmentId={curDepartmentId}
        showDeleteConfirm={this.showDeleteConfirm}
        handleShowEditModal={this.handleShowEditModal}
        ></DocumentListMobile>
    )
    return this.state.isMobile ? docSearchMobileList : docSearchPCList;
  }
  getListContentElements(){
    let searchForm = this.getSearchForm();
    let docSearchList = this.getSearchResultTable();
    let content = (<div className="addressbook_list">
          {searchForm}
          {docSearchList}
        </div>);
    return content;
  }

  render() {
    const {visibleEditModel, memberInfo, currentFileId, currentFileSubId} = this.state;
    const { departmentData, departmentFlatData, departmentFlatMap, curDepartmentId} = this.state;
    let sidebarMenuMarTop = this.state.isMobile ? '60px' : '0';
    const sidebar = (
      <Sider width={240} className="custom_ant_sidebar addressSidebar"
        style={{ background: '#2071a7',color:'#fff',marginTop:sidebarMenuMarTop,overflow: 'auto', zIndex:'9999'}}>
        <DocumentSidebar currentFileId={currentFileId} currentFileSubId={currentFileSubId}
          departmentData={departmentData}
          departmentFlatMap={departmentFlatMap}
          searchFormPC={this.refs.searchFormPC}
          setcurrentFileId={this.setcurrentFileId.bind(this)}
          setcurrentFileSubId={this.setcurrentFileSubId.bind(this)}
          setcurDepartmentId={this.setcurDepartmentId.bind(this)}
          onClickMenuItem={()=>{this.setState( {open:!this.state.open} ); }}
          handleSearch={this.handleSearch} />
      </Sider>
    );
    let finalEle = this.state.isMobile ? this.getMobileElements(sidebar) : this.getPCElements(sidebar);
    const editModalField = {
      ref: "editDocForm",
      visible: visibleEditModel,
      memberInfo: memberInfo,
      departmentData:departmentData,
      departmentFlatMap:departmentFlatMap,
      currentFileId: currentFileId,
      currentFileSubId: currentFileSubId,
      // curDepartmentId: curDepartmentId,
      handleSearch: this.handleSearch,
      handleCancelModal: this.handleCancelModal
    }
    let edit_ele = '';
    if(curDepartmentId == '律所'){
      edit_ele = <DocumentEditLawfirmModalPC {...editModalField}></DocumentEditLawfirmModalPC>
    }else if(curDepartmentId == '司法考试处') {
      edit_ele = <DocumentEditJudExamModalPC {...editModalField}></DocumentEditJudExamModalPC>
    }else if(currentFileSubId == '律师' ){
      edit_ele = <DocumentEditLawyerModalPC {...editModalField}></DocumentEditLawyerModalPC>
    }else if(curDepartmentId == '基层法律工作者' ){
      edit_ele = <DocumentEditLegalWorkerModalPC {...editModalField}></DocumentEditLegalWorkerModalPC>
    }else if(currentFileSubId == '司法所长' ){
      edit_ele = <DocumentEditSifaDirectorModalPC {...editModalField}></DocumentEditSifaDirectorModalPC>
    }else {
      edit_ele = <DocumentEditModalPC {...editModalField}></DocumentEditModalPC>
    }

    return (
      <div className="document_container">
        {finalEle}
        {edit_ele}
      </div>
    );
  }
}

DocumentPage.defaultProps = {
};
DocumentPage.propTypes = {
};

export default DocumentPage;
