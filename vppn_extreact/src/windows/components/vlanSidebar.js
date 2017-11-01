import React,{Component} from 'react';
import { TreeList, List } from '@extjs/ext-react';
import { medium, large } from '../../responsiveFormulas';

Ext.require('Ext.data.TreeStore');
// Ext.require('Ext.data.store.chained');
// Ext.require('Ext.data.Store');

class VlanSidebar extends Component{
  state = {
  }
  treeListData = {
    root: {
        children: [
            { id: '1_vport', text: 'vPort1', iconCls: 'mif-wifi-connect icon', leaf: true },
            { id: '2_vport', text: 'vPort2', iconCls: 'mif-earth icon', leaf: true },
            { id: '3_vport', text: 'vPort3', iconCls: 'mif-local-service icon', leaf: true },
            { id: '4_vport', text: 'vPort4', iconCls: 'mif-users icon', leaf: true },
            { id: '5_vport', text: 'vPort5', iconCls: 'mif-equalizer-v icon', leaf: true },
            { id: '6_diagnosis', text: 'Diagnosis', iconCls: 'mif-security icon', leaf: true },
            { id: '7_setting', text: 'Setting', iconCls: 'mif-notification icon', leaf: true },
        ]
    }
  }
  componentWillMount(){
  }
  onItemClick = (id)=>{
    console.log("onItemClick--:",id);
    let rightCntType = id.split('_')[1];
    $('#networkWindow .wi').each(function(){
      $(this).removeClass('active');
    });
    $('#networkWindow #wi_right_' + rightCntType).addClass('active');
    switch (id) {
      case '1_vport':
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

export default VlanSidebar;
