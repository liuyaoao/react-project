import React,{Component} from 'react';
import { Container, TreeList, List, Button, SearchField } from '@extjs/ext-react';
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
      <div className='sidebar3' style={{height:'100%',background:'#fff'}}>
        <Container layout="vbox">
          <Container layout={{type:'hbox',pack:'left',align:'left'}} padding="0 0 10 0" style={{backgroundColor:'#ecf0f4'}}>
            <Button cls='iconBtn' ui={'confirm alt'} iconCls={'x-fa fa-th'} onTap={this.props.onShowModuleIconView}></Button>
            <SearchField width="80%" margin="0 0 0 10"
                ui="faded"
                placeholder="Search"/>
          </Container>
          <TreeList cls="ext_treeList_container"
              ui="nav"
              expanderFirst={false}
              onItemClick={this.onItemClick}
              selection={this.props.contentId}
              store={this.props.modulesData}
          />
        </Container>
      </div>
    )
  }


}

export default NetworkSidebar;
