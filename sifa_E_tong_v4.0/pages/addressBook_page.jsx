//电子通讯录页面
import $ from 'jquery';
import React from 'react';
import {browserHistory} from 'react-router/es6';
// import OrganizationStore from 'pages/stores/organization_store.jsx';
import UserStore from 'stores/user_store.jsx';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';
import * as organizationUtils from './utils/organization_utils.jsx';

import { SearchBar, Drawer, List, NavBar } from 'antd-mobile';
import { Layout, Menu, Breadcrumb, Icon, Button, Input } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const Search = Input.Search;
import LogOutComp from './components/log_out_comp.jsx';
import * as addressBookUtils from './utils/addressBook_utils.jsx';
import AddressSidebarMenuComp from './addressbook/addressSidebar_comp.jsx';
import AddressListComp from './addressbook/addressList_comp.jsx';
import AddEditContactDialog from './addressbook/addEditContact_dialog.jsx';
import AddressSearchComp from './addressbook/addressSearch_comp.jsx';

import signup_logo from 'images/signup_logo.png';

class AddressBookPage extends React.Component {
    constructor(props) {
        super(props);
        this.getStateFromStores = this.getStateFromStores.bind(this);
        this.onNavBarLeftClick = this.onNavBarLeftClick.bind(this);
        this.onSubmitSearch = this.onSubmitSearch.bind(this);
        this.getAddressBookCn = this.getAddressBookCnt.bind(this);
        this.state = this.getStateFromStores();
    }
    getStateFromStores() {
        return {
            open: false,
            position: 'left',
            organization:'',  //一级目录
            secondaryDirectory:'',  //二级目录
            level3Catalog:'',  //三级目录
            addressbookData:[],
            breadcrumbData:['全部'],
            loginUserName:'',
            organizationsData:[],
            organizationsFlatData:[],
            organizationsFlatDataMap:{},
            isShowEditDialog:false,
            contactInfo:{},
            isMobile: Utils.isMobile(),
            perPageNum:10, //每页条数。
            pageFrom:0,
            pageTo:10,
            pageOrderBy:'', //以哪个字段排序。
            pageOrder:'',  //以降序还是升序方式排序。 'desc' or 'asc'
            curPageNum:1, //当前页码。
            totalCount:0, //总条数。
        };
    }
    onNavBarLeftClick = (e) => {  //navbar left click.
      browserHistory.goBack();
    }
    onOpenChange = (...args) => { //drawer open changed call.
      // console.log(args);
      this.setState({ open: !this.state.open });
    }
    componentDidMount() {
      let _this = this;
      var me = UserStore.getCurrentUser() || {};
      // console.log("me info:",me);
      this.setState({loginUserName:me.username||''});
      this.getServerDirectoryData();
      this.getAddressBookCnt({
        organization:this.state.organization
      });
    }

    getServerDirectoryData(){
      organizationUtils.getServerContactDirectory((objArr, flatDataArr, flatDataMap)=>{
        // console.log("getContactDirectoryData-获取通讯录的目录结构数据-:",objArr,flatDataArr);
        this.setState({
          "organizationsData":objArr||[],
          "organizationsFlatData":flatDataArr||[],
          "organizationsFlatDataMap":flatDataMap||{}
        });
      });
    }

    getAddressBookCnt = (params,otherParams)=>{
      let {pageFrom,pageTo,pageOrderBy,pageOrder} = this.state;
      otherParams = otherParams || {};
      (!params.secondaryDirectory || params.secondaryDirectory=="-1") ? delete params.secondaryDirectory :null;
      (!params.level3Catalog || params.level3Catalog=="-1") ? delete params.level3Catalog :null;
      if(params.organization){
        params.organization = params.organization.split('_')[0];
      }
      if(params.secondaryDirectory){
        params.secondaryDirectory = params.secondaryDirectory.split('_')[0];
      }
      if(params.level3Catalog){
        params.level3Catalog = params.level3Catalog.split('_')[0];
      }
      this.setState({
        pageFrom: otherParams.to?otherParams.from:pageFrom,
        pageTo: otherParams.to||pageTo,
        pageOrderBy: otherParams.orderBy||pageOrderBy,
        pageOrder: otherParams.order||pageOrder,
      });
      params["from"] = otherParams.to?otherParams.from:pageFrom;
      params["to"] = otherParams.to||pageTo;
      params["orderBy"] = otherParams.orderBy||pageOrderBy;
      params["order"] = otherParams.order||pageOrder; //asc 或者desc
      // console.log("通讯录-list-查询参数-:",params);
      myWebClient.getServerAddressBook(params,
        (data,res)=>{
          let parseData = JSON.parse(res.text);
          let objArr = addressBookUtils.parseContactsData(parseData.contacts);
          this.setState({
            "addressbookData":objArr,
            totalCount:parseInt(parseData.count),
            curPageNum:params["to"]/this.state.perPageNum,
          });
        },(e, err, res)=>{
          console.log("request server addressbook error info:",err);
        });
    }

    setBreadcrumbData(dataArr){
      this.setState({"breadcrumbData":dataArr});
    }
    onClickBackToModules(){
      browserHistory.goBack();
    }
    updateContactsDirectory = ()=>{ //跟新目录结构
      this.getServerDirectoryData();
    }
    onSubmitSearch(value){
      // console.log("onSubmitSearch:",value);
      let params = {
        "organization":this.state.organization,
        "secondaryDirectory":this.state.secondaryDirectory,
        "level3Catalog":this.state.level3Catalog,
      }
      if(value){
        params['filter'] = value;
      }
      this.getAddressBookCnt(params,{
        "from":0,
        "to":10,
      });
    }
    showAddEditDialog = (data)=>{ //显示新增编辑弹窗。
      // console.log("showAddressBook--AddEditDialog--:");
      let info = data || {};
      this.setState({contactInfo:info, isShowEditDialog:true});
    }
    closeAddEditDialog = ()=> {   // 隐藏新增Or编辑的弹窗。
      this.setState({ contactInfo:{}, isShowEditDialog: false });
    }
    afterAddEditContactsCall = ()=>{ //新增编辑成功后更新列表。
      this.getServerDirectoryData();
      this.onSubmitSearch();
    }
    afterDeleteContactsCall = ()=>{ // 删除某几个通讯录后的回调。
      this.onSubmitSearch();
    }
    afterDeleteAllContactsCall = ()=>{ //删除全部通讯录后的回调。
      this.getServerDirectoryData();
    }
    updateDirectoryData = (organization,secondaryDirectory,level3Catalog)=>{
      let params = {
        "organization":organization,
        "secondaryDirectory":secondaryDirectory,
        "level3Catalog":level3Catalog,
      };
      this.setState(params);
      this.setState({
        "pageFrom":0,
        "pageTo":10,
      });
      this.getAddressBookCnt(Object.assign({},params),{"from":0, "to":10});
    }

    getBreadcrumbItem(){
      let { breadcrumbData } = this.state;
      let bread_items = breadcrumbData.map((val,index)=>{
          return <Breadcrumb.Item className="bread_item" key={index}>{val.split("_")[0]}</Breadcrumb.Item>
        });
      return bread_items;
    }

    render() {
      let {isShowEditDialog,contactInfo} = this.state;
      let { addressbookData,organization,secondaryDirectory,level3Catalog } = this.state;
      const sidebar = (
        <Sider width={240}
            className="custom_ant_sidebar addressSidebar"
            style={{ background: '#2071a7',color:'#fff',overflow: 'auto',marginTop:'0',zIndex:'13' }}>
            <AddressSidebarMenuComp
              organizationsData={this.state.organizationsData}
              organizationsFlatData={this.state.organizationsFlatData}
              organizationsFlatDataMap={this.state.organizationsFlatDataMap}
              onClickMenuItem={()=>{this.setState( {open:!this.state.open} ); }}
              updateDirectoryData={this.updateDirectoryData}
              setBreadcrumbData={(arr)=>{this.setBreadcrumbData(arr)}} />
        </Sider>
      );
      let breadcrumbEles = this.getBreadcrumbItem();
      return (<div className="address_book_container">
                <Layout style={{ height: '100vh' }}>
                    <Header className="header custom_ant_header addressbook_header" style={{position:'fixed',width:'100%',zIndex:'13'}}>
                        <div className="custom_ant_header_logo addressbook_logo" onClick={this.onClickBackToModules}>
                          <span className="logo_icon"><img width="40" height="40" src={signup_logo}/></span>
                          <div className="logo_title">
                            <p>@{this.state.loginUserName}</p><p>司法E通</p>
                            </div>
                        </div>
                        <Breadcrumb className="bread_content" style={{ margin: '0 10px',float:'left' }}>
                          <Breadcrumb.Item className="bread_item">电子通讯录</Breadcrumb.Item>
                          {breadcrumbEles}
                        </Breadcrumb>
                        <div className="" style={{position:'absolute',right:'32px',top:'0'}}>
                          <LogOutComp className="logout_addressbook" addGoBackBtn/>
                        </div>
                    </Header>
                    <Layout style={{marginTop:'64px'}} className={'addressbook_menu_container'}>
                      {sidebar}
                      <Layout style={{ padding: '0' }}>
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280,overflow: 'initial' }}>
                          <AddressSearchComp
                            organization={organization}
                            secondaryDirectory={secondaryDirectory}
                            level3Catalog={level3Catalog}
                            updateContactsDirectory={this.updateContactsDirectory}
                            onSubmitSearchCall={(val)=>this.onSubmitSearch(val)}
                          />
                          <AddressListComp
                            addressListData={addressbookData}
                            totalCount={this.state.totalCount}
                            curPageNum={this.state.curPageNum}
                            showAddEditDialog={this.showAddEditDialog}
                            afterDeleteAllContactsCall={this.afterDeleteAllContactsCall}
                            afterDeleteContactsCall={this.afterDeleteContactsCall}
                            organization={organization}
                            secondaryDirectory={secondaryDirectory}
                            level3Catalog={level3Catalog}
                            getAddressBookCnt={this.getAddressBookCnt}
                          />
                        </Content>
                      </Layout>
                    </Layout>
                  </Layout>
                  <AddEditContactDialog
                    visible={isShowEditDialog}
                    contactInfo={contactInfo}
                    closeAddEditDialog={this.closeAddEditDialog}
                    afterAddEditContactsCall={this.afterAddEditContactsCall}
                    organizationsData={this.state.organizationsData}
                    organizationsFlatData={this.state.organizationsFlatData}
                    organizationsFlatDataMap={this.state.organizationsFlatDataMap}
                  />
              </div>);
    }
}

AddressBookPage.defaultProps = {
};

AddressBookPage.propTypes = {
};

export default AddressBookPage;
