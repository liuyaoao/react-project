
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../intl/Intl';
import {intl_language_key} from '../ReactWM_lib/models/Constants';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,List,Button, TreeList, Panel } from '@extjs/ext-react';

Ext.require('Ext.Toast');

class SidebarMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      contentId:'VlanWindow',
  }
  treeListData = {
    root: {
        children: [
            { id: 'mSide_VlanWindow', text: '<div class="">Cloud VPN</div>', iconCls: 'mif-wifi-connect icon', leaf: true },
            { id: 'mSide_NetworkCenterWindow', text: '<div class="">'+Intl.get('Network Center')+'</div>', iconCls: 'mif-earth icon', leaf: true },
            { id: 'mSide_FileStationWindow', text: Intl.get('ReadySHARE'), iconCls: 'mif-local-service icon', leaf: true },
            { id: 'mSide_ParentCtrlPage', text: Intl.get('parentalCtrl'), iconCls: 'mif-users icon', leaf: true },
            { id: 'mSide_SecurityPage', text: Intl.get('security'), iconCls: 'mif-security icon', leaf: true },
            { id: 'mSide_NoticeSettingsPage', text: Intl.get('noticeSettings'), iconCls: 'mif-mail-read icon', leaf: true },
            { id: 'mSide_ManagementPage', text: Intl.get('management'), iconCls: 'mif-tools icon', leaf: true },
        ]
    }
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount () {
  }
  componentWillReceiveProps(nextProps){
    if(!nextProps.contentId && nextProps.contentId != this.props.contentId){
      this.setState({
        contentId:nextProps.contentId
      });
    }
  }
  onShowHeaderPopup = ()=>{
    this.props.toggleSidebar();
    this.props.onShowHeaderPopup();
  }
  onItemClick = (itemId)=>{
    this.props.toggleSidebar();
    this.setState({
      contentId:itemId.split('_')[1]
    });
    this.props.onSelectMenuItem(itemId.split('_')[1]); //只截取了下划线后面的一段。
  }
  onChangeLanguage = (evt)=>{
    let btnText = $(evt.target).text();
    // console.log("btnText:",evt);
    let changeToLang = btnText=="English"?"en":"zh";
    localStorage.setItem(intl_language_key, changeToLang);
    document.location.reload();
  }
  render () {
    let {contentId} = this.state;
    let {displayed} = this.props;
    let curLang = localStorage.getItem(intl_language_key) || "en";
    return (
      <div className="" style={{width:'100%',height:'100%',position:'relative'}}>
        <Container
            width='100%'
            height='100%'
            layout='vbox'
        >
            <Container layout={{type: 'hbox',pack: 'space-between',align: 'bottom'}} padding="20 20 10 20" height="115px" style={{backgroundColor: '#569fea'}}>
              <div>
                <div style={{height:'60px',textAlign:'center'}}>
                  <span className="x-fa fa-user-circle-o" style={{fontSize:'45px',color:'#dad5d5'}}></span>
                </div>
                <div style={{}}><span style={{color:'#fff'}}>Administrator</span></div>
                <div style={{}}><span style={{color:'#dad5d5'}}>192.168.9.67</span></div>
              </div>
              <div>
                <div style={{height:'35px',marginBottom:'20px',textAlign:'center'}}>
                  <button style={{borderRadius:'4px',opacity:'0.8',color:'#fff',backgroundColor:'#4690da'}} onClick={this.onChangeLanguage}>{curLang=="zh"?"English":"中文"}</button>
                </div>
                <Button ui="alt" cls="icon_big" iconCls="x-fa fa-gear" onTap={this.onShowHeaderPopup}/>
              </div>
            </Container>
            <TreeList cls="ext_treeList_container"
                  ui="nav"
                  expanderFirst={false}
                  onItemClick={(tree, item) => this.onItemClick(item.node.getId())}
                  selection={"mSide_"+contentId}
                  store={this.treeListData}
                  width={'100%'}
              />
        </Container>

      </div>
    );
  }

}

export default SidebarMobile;
