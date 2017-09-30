//电子通讯录页面
import $ from 'jquery';
import React from 'react';
import {browserHistory} from 'react-router/es6';
// import OrganizationStore from 'pages/stores/organization_store.jsx';
import myWebClient from 'client/my_web_client.jsx';
import * as organizationUtils from 'pages/utils/organization_utils.jsx';

import { SearchBar, Drawer, List, NavBar } from 'antd-mobile';
import { Layout,  Icon, Button, Input } from 'antd';
const { Header, Content, Sider } = Layout;
import * as addressBookUtils from 'pages/utils/addressBook_utils.jsx';
import AddressSidebarMenuComp from 'pages/addressbook/addressSidebar_comp.jsx';
import AddressListMobileComp from 'pages/addressbook/addressList_mobile_comp.jsx';

import signup_logo from 'images/signup_logo.png';

class AddressBookPageMobile extends React.Component {
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
            organizationsData:[],
            organizationsFlatData:[],
            organizationsFlatDataMap:{},
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
          // console.log("request server addressbook error res text:",objArr);
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
    showAddEditDialog = (data)=>{ //显示新增编辑弹窗。暂时不用在手机端编辑
    }
    afterDeleteContactsCall = ()=>{ // 删除某几个通讯录后的回调。
      this.onSubmitSearch();
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

    render() {
      let { addressbookData,organization,secondaryDirectory,level3Catalog } = this.state;
      const drawerProps = {
        open: this.state.open,
        position: this.state.position,
        onOpenChange: this.onOpenChange,
      };
      const sidebar = (
        <Sider width={240}
            className="custom_ant_sidebar addressSidebar"
            style={{ background: '#2071a7',color:'#fff',overflow: 'auto',marginTop:'60px',zIndex:'13' }}>
            <AddressSidebarMenuComp
              organizationsData={this.state.organizationsData}
              organizationsFlatData={this.state.organizationsFlatData}
              organizationsFlatDataMap={this.state.organizationsFlatDataMap}
              onClickMenuItem={()=>{this.setState( {open:!this.state.open} ); }}
              updateDirectoryData={this.updateDirectoryData}
              setBreadcrumbData={(arr)=>{this.setBreadcrumbData(arr)}} />
        </Sider>
      );
      return (<div className="address_book_container">
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
                      leftContent={[ <Icon type="arrow-left" className="back_arrow_icon" key={156}/>,<span style={{fontSize:'1em'}} key={13}>返回</span>]}
                      onLeftClick={this.onNavBarLeftClick}
                      rightContent={[ <Icon key="1" type="ellipsis" style={{fontSize:'0.4rem'}} onClick={this.onOpenChange}/>]} >
                      <img width="35" height="35" src={signup_logo}/>司法E通
                    </NavBar>
                    <div style={{marginTop:'60px'}} className={'address_book_mobile_body'}>
                      <SearchBar
                        placeholder="用户名/邮件/电话"
                        onSubmit={this.onSubmitSearch}
                        onClear={value => console.log(value, 'onClear')}
                        onFocus={() => console.log('onFocus')}
                        onCancel={this.onSubmitSearch}
                        cancelText={'搜索'}
                        onChange={() => {}}
                      />
                      <AddressListMobileComp
                        addressListData={addressbookData}
                        totalCount={this.state.totalCount}
                        curPageNum={this.state.curPageNum}
                        showAddEditDialog={this.showAddEditDialog}
                        afterDeleteContactsCall={this.afterDeleteContactsCall}
                        organization={organization}
                        secondaryDirectory={secondaryDirectory}
                        level3Catalog={level3Catalog}
                        getAddressBookCnt={this.getAddressBookCnt}
                      />
                    </div>
                  </Drawer>
                </div>
              </div>);
    }
}

AddressBookPageMobile.defaultProps = {
};

AddressBookPageMobile.propTypes = {
};

export default AddressBookPageMobile;
