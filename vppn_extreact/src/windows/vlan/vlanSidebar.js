import React,{Component} from 'react';
import { Container,TreeList, List,SearchField,Button } from '@extjs/ext-react';
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
            { id: '1_vport', text: 'vPort1', iconCls: 'mif-list2 icon', leaf: true },
            { id: '2_vport', text: 'vPort2', iconCls: 'mif-list2 icon', leaf: true },
            { id: '3_vport', text: 'vPort3', iconCls: 'mif-list2 icon', leaf: true },
            { id: '4_vport', text: 'vPort4', iconCls: 'mif-list2 icon', leaf: true },
            { id: '5_vport', text: 'vPort5', iconCls: 'mif-list2 icon', leaf: true },
            { id: '6_diagnosis', text: 'Diagnosis', iconCls: 'mif-tools icon', leaf: true },
            { id: '7_setting', text: 'Setting', iconCls: 'x-fa fa-gear icon', leaf: true },
        ]
    }
  }
  componentWillMount(){
  }
  onItemClick = (id)=>{
    console.log("onItemClick--:",id);
    let rightCntType = id.split('_')[1];
    // $('#cloudVpnWindow .wi').each(function(){
    //   $(this).removeClass('active');
    // });
    // $('#cloudVpnWindow #wi_right_' + rightCntType).addClass('active');
    this.props.onMenuItemClick(id);
  }
  render(){
    return (
      <div className="sidebar3" style={{height:'100%',background:'#fff'}}>
        <Container layout="vbox">
          <Container layout={{type:'hbox',pack:'left',align:'left'}} padding="0 0 10 0" style={{backgroundColor:'#ecf0f4'}}>
            <Button cls='iconBtn' ui={'confirm alt'} iconCls={'x-fa fa-th'} onTap={this.props.onShowModuleIconView}></Button>
            <SearchField width="80%" margin="0 0 0 10"
                ui="faded"
                placeholder="Search"
            />
          </Container>
          <TreeList cls="ext_treeList_container"
              ui="nav"
              expanderFirst={false}
              onItemClick={(tree, item) => this.onItemClick(item.node.getId())}
              selection={this.props.contentId}
              store={this.treeListData}
          />
        </Container>
      </div>
    )
  }


}

export default VlanSidebar;
