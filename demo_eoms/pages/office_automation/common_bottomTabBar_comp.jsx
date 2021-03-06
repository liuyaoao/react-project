import $ from 'jquery';
import React from 'react';
import * as Utils from 'utils/utils.jsx';
import { WingBlank,Popover, WhiteSpace, Button, NavBar, TabBar} from 'antd-mobile';

import {Icon } from 'antd';
class CommonBottomTabBarComp extends React.Component {
  constructor(props) {
      super(props);
      this.getTabBarItemSave = this.getTabBarItemSave.bind(this);
      this.getTabBarItemVerify = this.getTabBarItemVerify.bind(this);
      this.getTabBarItemSend = this.getTabBarItemSend.bind(this);
      this.getTabBarItemTrack = this.getTabBarItemTrack.bind(this);
      this.getTabBarItemReHandle = this.getTabBarItemReHandle.bind(this);
      this.getTabBarItemToEnd = this.getTabBarItemToEnd.bind(this);
      this.state = {
      };
  }

  componentWillMount(){
  }

  shouldComponentUpdate(nextProps){
    if(this.props.formDataRaw !== nextProps.formDataRaw){
      console.log("formDataRaw123456789：",nextProps.formDataRaw);
    }
    return true;
  }

  getTabBarItemSave = ()=>{ //是否展示保存按钮
    let { formDataRaw } = this.props;
    let saveItem = (
      <TabBar.Item
        title="保存"
        key="保存"
        icon={ <Icon type="save" style={{fontSize:'0.4rem'}}/> }
        selectedIcon={<Icon type="save" style={{color:'blue',fontSize:'0.4rem'}}/>}
        selected={this.props.selectedTab === 'saveTab'}
        onPress={() => this.props.onClickAddSave()}
      >
      <div></div>
      </TabBar.Item>
    );
    if(formDataRaw){
      if(this.props.isAddNew){
        return saveItem;
      }else if(formDataRaw['btSave'] && formDataRaw['btSave']['visible'] && formDataRaw['btSave']['enable'] ){
        return saveItem;
      }else{
        return null;
      }
    }
    return null;
  }

  getTabBarItemVerify = ()=>{  //是否展示阅文意见按钮
    let {formDataRaw} = this.props;
    let verifyItem = (
      <TabBar.Item
        title="阅文意见"
        key="阅文意见"
        icon={ <Icon type="edit" style={{fontSize:'0.4rem'}} /> }
        selectedIcon={<Icon type="edit" style={{color:'blue', fontSize:'0.4rem'}}/>}
        selected={this.props.selectedTab === 'verifyTab'}
        onPress={() => this.props.onClickVerifyBtn()}
      >
      <div></div>
      </TabBar.Item>
    );
    if(formDataRaw){
      if(this.props.isAddNew){
        return verifyItem;
      }else if(formDataRaw['btYwyj'] && formDataRaw['btYwyj']['visible'] && formDataRaw['btYwyj']['enable'] ){
        return verifyItem;
      }else{
        return null;
      }
    }
    return null;
  }

  getTabBarItemSend = ()=>{  //是否展示发送按钮
    let {formDataRaw} = this.props;
    let sendItem = (
      <TabBar.Item
        title="发送"
        key="发送"
        icon={ <Icon type="export" style={{fontSize:'0.4rem'}} /> }
        selectedIcon={<Icon type="export" style={{color:'blue', fontSize:'0.4rem'}}/>}
        selected={this.props.selectedTab === 'sendTab'}
        onPress={() => this.props.onClickSendBtn()}
      >
      <div></div>
      </TabBar.Item>
    );
    if(formDataRaw){
      if(this.props.isAddNew){
        return sendItem;
      }else if(formDataRaw['btSend'] && formDataRaw['btSend']['visible'] && formDataRaw['btSend']['enable'] ){
        return sendItem;
      }else{
        return null;
      }
    }
    return null;
  }

  getTabBarItemTrack = ()=>{  //是否展示办文跟踪按钮
    let {formDataRaw} = this.props;
    let trackItem = (
      <TabBar.Item
        title="办文跟踪"
        key="办文跟踪"
        icon={ <Icon type="switcher" style={{fontSize:'0.4rem'}} /> }
        selectedIcon={<Icon type="switcher" style={{color:'blue', fontSize:'0.4rem'}}/>}
        selected={this.props.selectedTab === 'trackTab'}
        onPress={() => this.props.onClickTrackBtn()}
      >
      <div></div>
      </TabBar.Item>
    );
    if(formDataRaw){
      if(this.props.isAddNew){
        return trackItem;
      }else if(formDataRaw['btBwgz'] && formDataRaw['btBwgz']['visible'] && formDataRaw['btBwgz']['enable'] ){
        return trackItem;
      }else{
        return null;
      }
    }
    return null;
  }
  getTabBarItemReHandle = ()=>{  //是否展示 回收重办 按钮
    let {formDataRaw} = this.props;
    let articleItem = (
      <TabBar.Item
        title="回收重办"
        key="回收重办"
        icon={ <Icon type="switcher" style={{fontSize:'0.4rem'}} /> }
        selectedIcon={<Icon type="switcher" style={{color:'blue', fontSize:'0.4rem'}}/>}
        selected={this.props.selectedTab === 'articleTab'}
        onPress={() => this.props.onClickReHandleBtn()}
      >
      <div></div>
      </TabBar.Item>
    );
    if(formDataRaw){
      if(this.props.isAddNew){
        return articleItem;
      }else if(formDataRaw['btHscb'] && formDataRaw['btHscb']['visible'] && formDataRaw['btHscb']['enable'] ){
        return articleItem;
      }else{
        return null;
      }
    }
    return null;
  }

  getTabBarItemToEnd = ()=>{  //是否展示 办结 按钮
    let {formDataRaw} = this.props;
    let articleItem = (
      <TabBar.Item
        title="办结"
        key="办结"
        icon={ <Icon type="switcher" style={{fontSize:'0.4rem'}} /> }
        selectedIcon={<Icon type="switcher" style={{color:'blue', fontSize:'0.4rem'}}/>}
        selected={this.props.selectedTab === 'articleTab'}
        onPress={() => this.props.onClickToEndBtn()}
      >
      <div></div>
      </TabBar.Item>
    );
    if(formDataRaw){
      if(this.props.isAddNew){
        return articleItem;
      }else if(formDataRaw['btZj'] && formDataRaw['btZj']['visible'] && formDataRaw['btZj']['enable'] ){
        return articleItem;
      }else{
        return null;
      }
    }
    return null;
  }


  render() {
    let itemSave = this.getTabBarItemSave();
    let itemVerify = this.getTabBarItemVerify();
    let itemSend = this.getTabBarItemSend();
    let itemTrack = this.getTabBarItemTrack();
    let itemReHandle = this.getTabBarItemReHandle();
    let itemToEnd = this.getTabBarItemToEnd();

    let arrEles = [];
    itemSave?arrEles.push(itemSave):null;
    itemVerify?arrEles.push(itemVerify):null;
    itemSend?arrEles.push(itemSend):null;
    itemTrack?arrEles.push(itemTrack):null;
    itemReHandle?arrEles.push(itemReHandle):null; //回收重办
    itemToEnd?arrEles.push(itemToEnd):null; //办结

    return (
      <div>
        <TabBar
          unselectedTintColor="black"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.props.hidden}
        >
          {arrEles}
        </TabBar>
      </div>
    )
  }
}
CommonBottomTabBarComp.defaultProps = {
};
CommonBottomTabBarComp.propTypes = {
  isAddNew:React.PropTypes.bool,
};
export default CommonBottomTabBarComp;
