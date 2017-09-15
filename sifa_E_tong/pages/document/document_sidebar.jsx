import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import myWebClient from 'client/my_web_client.jsx';

import { SearchBar, List,Button } from 'antd-mobile';
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;

export default class DocumentSidebar extends React.Component {
  static get propTypes() {
      return {
        departmentData: React.PropTypes.array,
        departmentFlatMap: React.PropTypes.object
      };
  }
  constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
      this.state = {
        current: '-1',
        openKeys: [],
        isMobile: Utils.isMobile()
      };
  }
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps){
    if(this.props.departmentData !== nextProps.departmentData && nextProps.departmentData.length ){
    }
  }
  // menu item click handler
   handleClick = (e) => { //仅表示点击了菜单的叶子节点响应。
    this.setState({ current: e.key });
    // console.log("点击了菜单的叶子节点响应:e.key,e.keyPath,e.item.props.children:", e.key,e.keyPath,e.item.props.children);
    if (e.item.props.children) {
      let level = this.props.departmentFlatMap[e.key].level;
      this.props.searchFormPC && this.props.searchFormPC.setFieldsValue({
        userName: '', gender: ''
      });
      let currentFileId='', currentFileSubId='',curDepartmentId='';
      if(level == 1){ //第一级就是子节点了。
        currentFileId = e.key;
      }else if(level==2){ //第二级就是叶子节点了。
        currentFileSubId = e.key;
      }else if(level == 3){
        curDepartmentId = e.key;
      }
      curDepartmentId?currentFileSubId = this.props.departmentFlatMap[curDepartmentId].parntName:null;
      !currentFileId?currentFileId = this.props.departmentFlatMap[currentFileSubId].parntName:null;
      this.props.setcurDepartmentId(curDepartmentId);
      this.props.setcurrentFileSubId(currentFileSubId);
      this.props.setcurrentFileId(currentFileId);
      const searchParam = {
        currentFileId: currentFileId,
        currentFileSubId: currentFileSubId,
        curDepartmentId: curDepartmentId
      }
      console.log('menu item Clicked, searchParam: ', searchParam);
      this.props.handleSearch(searchParam,{"from":0,"to":10});
      this.props.onClickMenuItem();
    }
  }

  onMenuOpenChange = (openKeys) => {
    const state = this.state;
    console.log('menu onMenuOpenChange: ', openKeys);
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    this.setState({ openKeys: openKeys });
    this.setState({ current: '-1' });
    if (latestOpenKey) {
      this.updateDocumentList(latestOpenKey);
    }
  }
  updateDocumentList(key){
    let fileObj = this.props.departmentFlatMap[key]||{}; //当前点击的菜单
    let currentFileSubId = fileObj.resourceId; //先默认看作点击的是第二级菜单。

    let parentObj = fileObj; //从当前往上找它的父级。
    let currentFileId = currentFileSubId;
    while(parentObj.parntName && parentObj.parntName!='-1'){
      parentObj = this.props.departmentFlatMap[parentObj.parntName];
      currentFileId = parentObj.resourceId;
    }
    if(currentFileId == currentFileSubId){ //表示是当前就是第一级了。
      currentFileSubId = '';
    }
    console.log('menu onMenuOpenChange: currentFileId, currentFileSubId: ', currentFileId,currentFileSubId);
    this.props.setcurrentFileId(currentFileId);
    this.props.setcurrentFileSubId( currentFileSubId );
    this.props.setcurDepartmentId('');
    if(fileObj.level && fileObj.level==1 && fileObj.sub && fileObj.sub.length>0){
      return;
    }
    this.props.handleSearch({ currentFileId,currentFileSubId }, {"from":0,"to":10});
  }

  getMenuItemList(sidebarConfig){
    let ele = [];
    let _this = this;
    $.each(sidebarConfig, (index, obj)=>{
      // console.log("sidebarConfig obj:",obj);
      if( !obj.sub || obj.sub.length <= 0){ //已经是子节点了。
        ele.push(<Menu.Item key={obj.resourceId}>{obj.resourceName}</Menu.Item>);
      }else{ //表示还有孩子节点存在。
        let childConfig = obj.sub;
        let tempEle = _this.getMenuItemList(childConfig);
        ele.push((<SubMenu key={obj.resourceId} title={<span>{obj.resourceName}</span>}>{tempEle}</SubMenu>)); //递归调用
      }
    });
    return ele;
  }
  render() {
    const { departmentData, currentFileId, currentFileSubId } = this.props;
    const sidebarMenuList =  this.getMenuItemList(departmentData);
    // console.log(this.state.openKeys);

    let openKeys=[currentFileId,currentFileSubId];
    if(this.state.openKeys && this.state.openKeys.length>0){
      openKeys = this.state.openKeys;
    }
    return (
          <Menu
            theme="dark"
            mode="inline"
            openKeys={openKeys}
            selectedKeys={[this.state.current]}
            style={{ width: 240 }}
            onOpenChange={this.onMenuOpenChange}
            onClick={this.handleClick} >
            {sidebarMenuList}
          </Menu>

    );
  }
}
