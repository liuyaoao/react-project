import React,{Component} from 'react';
import { TreeList, List } from '@extjs/ext-react';
import { medium, large } from '../../responsiveFormulas';

Ext.require('Ext.data.TreeStore');
// Ext.require('Ext.data.store.chained');
// Ext.require('Ext.data.Store');

class NetworkSidebar extends Component{
  state = {
  }
  
  componentWillMount(){
  }
  onItemClick = (sender, info, opts)=>{
    // console.log("onItemClick:", info);
    let id = info.node.id;
    // let rightCntType = id.split('_')[0];
    this.props.onMenuItemClick(id);
  }
  render(){
    return (
      <TreeList cls="sidebar3 ext_treeList_container"
            ui="nav"
            expanderFirst={false}
            onItemClick={this.onItemClick}
            selection={this.props.contentId}
            store={this.props.modulesData}
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
