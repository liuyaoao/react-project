import $ from 'jquery';
import ReactDOM from 'react-dom';

import React from 'react';
import {Link} from 'react-router/es6';
// import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import TeamStore from 'stores/team_store.jsx';
import UserStore from 'stores/user_store.jsx';

import * as Utils from 'utils/utils.jsx';
import client from 'client/web_client.jsx';
import myWebClient from 'client/my_web_client.jsx';

import {  Drawer, List, NavBar,Button } from 'antd-mobile';
import { Layout, Menu, Breadcrumb, Icon, Affix as AffixPc, Input } from 'antd';
const { SubMenu } = Menu;


export default class AddressSidebarMenuComp extends React.Component {
  static get propTypes() {
      return {
        organizationsData:React.PropTypes.array,
        organizationsFlatData:React.PropTypes.array,
        organizationsFlatDataMap:React.PropTypes.object,
        onClickMenuItem: React.PropTypes.func,
        setBreadcrumbData: React.PropTypes.func.isRequired
      };
  }
  constructor(props) {
      super(props);
      this.state = {
        current: '-1',
        openKeys: [],
        isMobile: Utils.isMobile()
      };
  }
  componentWillMount() {
    if(this.props.organizationsData && (this.props.organizationsData[0])){
      let openKey = this.props.organizationsData[0].id || '';
      this.updateAddressBookList(openKey,'','');
      this.updateAddressBookBreadcrumb([openKey]);
      this.setState({"openKeys":[openKey]});
    }
  }
  componentWillReceiveProps(nextProps){
  }

  // menu item click handler
  handleMenuItemClick = (e) => {
    console.log('Clicked: ', e);
    if(!e.key){return;}
    this.setState({ current: e.key });
    let tempArr = e.keyPath;
    (tempArr[0]||'').indexOf('menu-item_')!=-1 ? (tempArr[0] = "") : null;
    let reverseArr = Utils.cloneArraySimple(tempArr).reverse()
    e.key && this.updateAddressBookList(reverseArr[0], reverseArr[1]||'', reverseArr[2]||'');
    this.updateAddressBookBreadcrumb(reverseArr);
    this.props.onClickMenuItem();
  }
  onMenuOpenChange = (openKeys) => {
    const state = this.state;
    console.log('openKeys: ', openKeys);
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));
    if(latestOpenKey){
      let breadcrumbKeys = [], parentid = latestOpenKey;
      while(parentid && parentid != "-1" && parentid!= -1){
        breadcrumbKeys.push(parentid);
        parentid = this.props.organizationsFlatDataMap[parentid].parentId;
      }
      breadcrumbKeys.reverse();
      latestOpenKey && this.updateAddressBookList(breadcrumbKeys[0]||'', breadcrumbKeys[1]||'', breadcrumbKeys[2]||'');
      this.updateAddressBookBreadcrumb(Utils.cloneArraySimple(breadcrumbKeys));
    }
    this.setState({ openKeys: openKeys });
  }
  updateAddressBookBreadcrumb(openKeys){
    if(this.state.isMobile){
      return;
    }
    let openMenuNameArr = [];
    let {organizationsFlatDataMap} = this.props;
    organizationsFlatDataMap['-1'] = {
      id:'-1',
      name:'全部',
      parentId:'',
      subtrees:null
    }
    $.each(openKeys,(index,val)=>{
      val && openMenuNameArr.push(organizationsFlatDataMap[val]["name"]);
    });
    this.props.setBreadcrumbData(openMenuNameArr);
  }

  updateAddressBookList(organization, secondaryDirectory, level3Catalog){
    if(!organization || organization=='-1'){
      organization = '';
    }
    this.props.updateDirectoryData(organization, secondaryDirectory, level3Catalog);
  }

  getMenuItemList(sidebarConfig){
    let ele = [];
    let _this = this;
    $.each(sidebarConfig, (index, obj)=>{
      // console.log("sidebarConfig obj:",obj);
      if(!obj.subtrees || obj.subtrees.length<=0){ //已经是子节点了。
        ele.push((<Menu.Item key={obj.id}>{obj.name}</Menu.Item>));
      }else{ //表示还有孩子节点存在。
        let childConfig = obj.subtrees;
        let tempEle = _this.getMenuItemList(childConfig);
        ele.push((<SubMenu key={obj.id} title={<span>{obj.name}</span>}>{tempEle}</SubMenu>)); //递归调用
      }
    });
    return ele;
  }
  render() {
    const { organizationsData } = this.props;
    (organizationsData[0] && organizationsData[0].id!='-1') && organizationsData.unshift({
      id:'-1',
      name:'全部',
      parentId:'',
      subtrees:null

    });
    const sidebarMenuList =  this.getMenuItemList(organizationsData);
    return (
          <Menu
            theme="dark"
            mode="inline"
            openKeys={this.state.openKeys}
            selectedKeys={[this.state.current]}
            style={{ width: 240 }}
            onOpenChange={this.onMenuOpenChange}
            onClick={this.handleMenuItemClick} >
            {sidebarMenuList}
          </Menu>

    );
  }
}
