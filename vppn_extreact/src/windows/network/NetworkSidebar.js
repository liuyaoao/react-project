import React,{Component} from 'react';
import { TreeList, List } from '@extjs/ext-react';
import { medium, large } from '../../responsiveFormulas';

Ext.require('Ext.data.TreeStore');
// Ext.require('Ext.data.store.chained');
// Ext.require('Ext.data.Store');

class NetworkSidebar extends Component{
  state = {
    selectionId:'state_1',
  }
  treeListData = {
    root: {
        children: [
            { id: 'state_1', text: '状态', iconCls: 'mif-meter icon', leaf: true },
            { id: 'wireless_2', text: '无线', iconCls: 'mif-wifi-connect icon', leaf: true },
            { id: 'Internet_3', text: '互联网', iconCls: 'mif-earth icon', leaf: true },
            { id: 'localNetwork_4', text: '本地网络', iconCls: 'mif-home icon', leaf: true },
            { id: 'parentalCtrl_5 ', text: '家长控制', iconCls: 'mif-users icon', leaf: true },
            { id: 'flowCtrl_6', text: '流量控制', iconCls: 'mif-equalizer-v icon', leaf: true },
            { id: 'security_7', text: '安全性', iconCls: 'mif-security icon', leaf: true },
            { id: 'noticeSettings_8', text: '通知设置', iconCls: 'mif-mail-read icon', leaf: true },
            { id: 'management_9', text: '管理', iconCls: 'mif-tools icon', leaf: true },
        ]
    }
  }
  componentWillMount(){
  }
  onItemClick = (sender, info, opts)=>{
    console.log("onItemClick:", info);
    let id = info.node.id;
    this.setState({selectionId:id});
    let rightCntType = id.split('_')[0];
    // $('#networkWindow .wi').each(function(){
    //   $(this).removeClass('active');
    // });
    // $('#networkWindow #wi_right_' + rightCntType).addClass('active');
    this.props.onMenuItemClick(rightCntType);
  }
  render(){
    return (
      <TreeList cls="sidebar3 ext_treeList_container"
            ui="nav"
            expanderFirst={false}
            onItemClick={this.onItemClick}
            selection={this.state.selectionId}
            store={this.treeListData}
            responsiveConfig={{
                [medium]: {
                    micro: true,
                    width: 56
                },
                [large]: {
                    micro: false,
                    width: 200
                }
            }}
        />
    )
  }


}

export default NetworkSidebar;
