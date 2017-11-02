import React,{Component} from 'react';
import { TreeList, List } from '@extjs/ext-react';
import { medium, large } from '../../responsiveFormulas';

Ext.require('Ext.data.TreeStore');
// Ext.require('Ext.data.store.chained');
// Ext.require('Ext.data.Store');

class NetworkSidebar extends Component{
  state = {
  }
  treeListData = {
    root: {
        children: [
            { id: 'state_1', text: '状态', iconCls: 'mif-wifi-connect icon', leaf: true },
            { id: 'wireless_2', text: '无线', iconCls: 'mif-earth icon', leaf: true },
            { id: 'Internet_3', text: '互联网', iconCls: 'mif-local-service icon', leaf: true },
            { id: 'localNetwork_4', text: '本地网络', iconCls: 'mif-users icon', leaf: true },
            { id: 'parentalCtrl_5 ', text: '家长控制', iconCls: 'mif-equalizer-v icon', leaf: true },
            { id: 'flowCtrl_6', text: '流量控制', iconCls: 'mif-security icon', leaf: true },
            { id: 'security_7', text: '安全性', iconCls: 'mif-notification icon', leaf: true },
            { id: 'noticeSettings_8', text: '通知设置', iconCls: 'mif-notification icon', leaf: true },
            { id: 'management_9', text: '管理', iconCls: 'mif-notification icon', leaf: true },
        ]
    }
  }
  componentWillMount(){
  }
  onItemClick = (id)=>{
    console.log("onItemClick--:",id);
    let rightCntType = id.split('_')[0];
    $('#networkWindow .wi').each(function(){
      $(this).removeClass('active');
    });
    $('#networkWindow #wi_right_' + rightCntType).addClass('active');
    switch (id) {
      case 'state_1':
        // this.props.getWifiSettingsInfo();
        // this.props.getWifiSettingsWPASecurityKeys();
        break;
      default:
        break;
    }
    this.props.onMenuItemClick(id);
  }
  render(){
    return (
      <TreeList cls="sidebar3 ext_treeList_container"
            ui="nav"
            expanderFirst={false}
            onItemClick={(tree, item) => this.onItemClick(item.node.getId())}
            selection={'1_vport'}
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
