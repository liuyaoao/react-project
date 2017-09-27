// 档案管理的页面
import $ from 'jquery';
import React from 'react';
import {Link,browserHistory} from 'react-router/es6';
import UserStore from 'stores/user_store.jsx';

// import * as Utils from 'utils/utils.jsx';
import MyWebClient from 'client/my_web_client.jsx';

// import moment from 'moment';
import { Drawer, NavBar, Modal as ModalAm,Toast } from 'antd-mobile';
const ModalAmAlert = ModalAm.alert;
import { Layout, Icon } from 'antd';
const { Sider } = Layout;

import signup_logo from 'images/signup_logo.png';

import WrappedSearchFormMobile from 'pages/document/search_form_mobile.jsx';
// import DocumentAllEditModal from 'pages/document/edit_all_modal.jsx';

import DocumentSidebar from 'pages/document/document_sidebar.jsx';
import DocumentListMobile from 'pages/document/documentList_mobile_comp.jsx';

class DocumentMobilePage extends React.Component {
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
      // let permissionData = UserStore.getPermissionData();
      // let hasOperaPermission = permissionData['document'] ? permissionData['document'].indexOf('action') != -1 : false;
      return {
          open: false,
          position: 'left',
          visibleEditModel: false, //编辑弹窗是否可见
          documentsData: [],
          loginUserName:'',
          memberInfo: {},
          searchParam: {},
          currentFileId: '',  //当前展开的第一级 id.
          currentFileSubId: '', //当前展开的第二级的 id.
          curDepartmentId: '', //当前点击的第三级部门 id。
          // departmentTypes: [],
          // hasOperaPermission:hasOperaPermission, //是否有操作权限。
          departmentData: [],
          departmentFlatData:[],  //平行数组结构
          departmentFlatMap:{},
          perPageNum:10, //每页条数。
          pageFrom:0,
          pageTo:10,
          pageOrderBy:'', //以哪个字段排序。
          pageOrder:'',  //以降序还是升序方式排序。 'desc' or 'asc'
          curPageNum:1, //当前页码。
          totalCount:0, //总条数。
          searchParamsKey_ids:'document_search_params_ids', //存localStorage的key值。
          searchParamsKey_others:'document_search_params_others', //存localStorage的key值。
          searchParams_ids:'', //查询参数的ids字符串
          searchParams_others:'', //查询参数的其他参数字符串
      };
  }
  onOpenChange = (...args) => {
    // console.log(args);
    this.setState({ open: !this.state.open });
  }
  onNavBarLeftClick = (e) => {  //navbar left click.
    browserHistory.goBack();
  }
  componentDidMount() {
    // console.log("pathname:",location);
    let _this = this;
    var me = UserStore.getCurrentUser() || {};
    this.setState({loginUserName:me.username || ''});
    this.getFileDepartment(me.organizations,(departmentData)=>{
      if(!departmentData||departmentData.length<=0){
        return;
      }
      var firstObj = departmentData[0];
      this.setState({
        currentFileId:firstObj.resourceId,
        currentFileSubId:firstObj.sub[0].resourceId,
      });
      let oldSearchParams_ids = localStorage.getItem(this.state.searchParamsKey_ids);
      let oldSearchParams_others = localStorage.getItem(this.state.searchParamsKey_others);
      if(oldSearchParams_ids && oldSearchParams_others){
        this.initialState(JSON.parse(oldSearchParams_ids), JSON.parse(oldSearchParams_others));
        this.handleSearch(JSON.parse(oldSearchParams_ids),JSON.parse(oldSearchParams_others));
      }else{
        this.handleSearch({ currentFileId:firstObj.resourceId });
      }
    });
  }
  componentWillUnmount() {
  }
  initialState(paramsIdArr,otherParams){ //初始化参数
    this.setState({
      currentFileId:paramsIdArr.currentFileId,
      currentFileSubId:paramsIdArr.currentFileSubId,
      curDepartmentId:paramsIdArr.curDepartmentId,
      pageFrom: otherParams.to?otherParams.from:this.state.pageFrom,
      pageTo: otherParams.to||this.state.pageTo,
      pageOrderBy:otherParams.orderBy||this.state.pageOrderBy,
      pageOrder:otherParams.order||this.state.pageOrder,
    });
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
  handleSearch(paramsIdArr,otherParams) { //paramsId :{currentFileId, currentFileSubId, curDepartmentId}
    otherParams = otherParams||{};
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
    let currentFileSubId = paramsIdArr.currentFileSubId;
    if(!paramsIdArr.currentFileSubId){
      let currentFileSubIdArr = [], fileInfoSubTypeArr = [];
      let subArr = this.state.departmentFlatMap[paramsIdArr.currentFileId].sub;
      if(subArr && subArr.length>0){
        subArr.map((item)=>{
          currentFileSubIdArr.push(item.resourceId);
          fileInfoSubTypeArr.push(item.resourceName);
        });
      }
      params.fileInfoSubType = fileInfoSubTypeArr.length>0?fileInfoSubTypeArr[0]:"";
      currentFileSubId = currentFileSubIdArr.join(',');
    }

    params.department = paramsIdArr.curDepartmentId?this.state.departmentFlatMap[paramsIdArr.curDepartmentId].resourceName:"";
    if(!paramsIdArr.curDepartmentId){
      let departmentArr = [];
      currentFileSubId.split(',').map((fileSubId)=>{
        let subArr = fileSubId?this.state.departmentFlatMap[fileSubId].sub:null;
        if(subArr && subArr.length>0){
          subArr.map((item)=>{
            departmentArr.push( item.resourceName );
          });
        }
      });
      departmentArr.length>0?params.department = departmentArr.join(','):null;
    }
    this.setState({
      pageFrom: otherParams.to?otherParams.from:this.state.pageFrom,
      pageTo: otherParams.to||this.state.pageTo,
      pageOrderBy:otherParams.orderBy||this.state.pageOrderBy,
      pageOrder:otherParams.order||this.state.pageOrder,
    });
    params = Object.assign({},params,otherParams||{});
    params["from"] = otherParams.to?otherParams.from:this.state.pageFrom;
    params["to"] = otherParams.to||this.state.pageTo;
    params["orderBy"] = otherParams.orderBy||this.state.pageOrderBy;
    params["order"] = otherParams.order||this.state.pageOrder; //asc 或者desc

    // console.log("档案管理-list-查询参数-:",params);
    MyWebClient.getSearchFileInfo(params,
      (data, res) => {
        if (res && res.ok) {
          let data = JSON.parse(res.text);
          //  console.log("档案管理-list-结果列表-:",data);
          localStorage.removeItem(this.state.searchParamsKey_ids);
          localStorage.removeItem(this.state.searchParamsKey_others);
          this.setState({
            searchParams_ids:JSON.stringify(paramsIdArr),
            searchParams_others:JSON.stringify(otherParams),
            totalCount:parseInt(data.count),
            documentsData:data.fileinfo,
            curPageNum:params["to"]/this.state.perPageNum,
          });
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
  handleShowEditModal(record) { //跳转到单个档案的详情页面。
    const {documentsData} = this.state;
    localStorage.setItem(this.state.searchParamsKey_ids,this.state.searchParams_ids);
    localStorage.setItem(this.state.searchParamsKey_others,this.state.searchParams_others);
    browserHistory.push('/document_mobile/detail/'+record.id);
    // let docObj = {};
    // for (let i = 0; i < documentsData.length; i++) {
    //   if (documentsData[i].id == record.key) {
    //     record = documentsData[i], docObj = documentsData[i];
    //   }
    // }
    // this.setState({
    //   memberInfo: record,
    //   visibleEditModel: true,
    //  });
    // Object.keys(docObj).forEach((key) => {
    //   if (key == 'birthDay' || key == 'joinPartyTime' || key == 'joinWorkerTime'
    //     || key == 'reportingTime' || key == 'approvalTime' || key == 'appointAndRemoveTime' ) {
    //     docObj[key] = docObj[key] ? moment(docObj[key], 'YYYY/MM') : null;
    //   }
    // });
  }
  handleCancelModal() {
    this.setState({ visibleEditModel: false });
  }
  showDeleteConfirm(doc, callback) {
    let _this = this;
    ModalAmAlert('删除', '确认删除吗 ?', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确认', onPress: () => {if (doc.key) {
        _this.handleDeleteDocument(doc.key.toUpperCase(), callback);
      }}, style: { fontWeight: 'bold' } },
    ]);
  }
  handleDeleteDocument(id, callback) {
    let _this = this;
    MyWebClient.deleteFileInfo(id,
      (data, res) => {
        if (res && res.ok) {
          if (res.text === 'true') {
            Toast.info("删除档案成功",2);
            _this.handleSearch();
          } else {
            Toast.info("删除档案失败",2);
          }
        }
      },
      (e, err, res) => {
        Toast.info("删除档案失败",2);
      }
    )
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

  render() {
    const { memberInfo, currentFileId, currentFileSubId} = this.state;
    const { documentsData, departmentData, departmentFlatData, departmentFlatMap, curDepartmentId} = this.state;
    const drawerProps = {
      open: this.state.open,
      position: this.state.position,
      onOpenChange: this.onOpenChange,
    };
    for (let i = 0; i < documentsData.length; i++) {
      documentsData[i]['key'] = documentsData[i].id;
    }
    const sidebar = (
        <Sider width={240} className="custom_ant_sidebar addressSidebar"
          style={{ background: '#2071a7',color:'#fff',marginTop:'60px',overflow: 'auto', zIndex:'13'}}>
          <DocumentSidebar currentFileId={currentFileId} currentFileSubId={currentFileSubId}
            departmentData={departmentData}
            departmentFlatMap={departmentFlatMap}
            searchFormPC={this.refs.searchFormPC}
            setcurrentFileId={this.setcurrentFileId.bind(this)}
            setcurrentFileSubId={this.setcurrentFileSubId.bind(this)}
            setcurDepartmentId={this.setcurDepartmentId.bind(this)}
            onClickMenuItem={()=>{this.setState( {open:!this.state.open} ); }}
            handleSearch={this.handleSearch} />
        </Sider>);
    return (
      <div className="document_container">
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
            <div style={{marginTop:'60px'}}>
              <div className="document_mobile_list">
                <WrappedSearchFormMobile
                  departmentData={departmentData}
                  departmentFlatMap={departmentFlatMap}
                  currentFileId={currentFileId}
                  currentFileSubId={currentFileSubId}
                  curDepartmentId={curDepartmentId}
                  handleSearch={this.handleSearch} />
                <DocumentListMobile data={documentsData}
                  totalCount={this.state.totalCount}
                  curPageNum={this.state.curPageNum}
                  departmentData={departmentData}
                  departmentFlatMap={departmentFlatMap}
                  currentFileId={currentFileId}
                  currentFileSubId={currentFileSubId}
                  curDepartmentId={curDepartmentId}
                  showDeleteConfirm={this.showDeleteConfirm}
                  handleShowEditModal={this.handleShowEditModal}
                  handleSearch={this.handleSearch}/>
                </div>
            </div>
          </Drawer>
        </div>
      </div>
    );
  }
}

DocumentMobilePage.defaultProps = {
};
DocumentMobilePage.propTypes = {
};

export default DocumentMobilePage;
