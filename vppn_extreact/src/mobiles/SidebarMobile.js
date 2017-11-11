
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
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
            { id: 'mSide_NetworkCenterWindow', text: '<div class="">Network Center</div>', iconCls: 'mif-earth icon', leaf: true },
            { id: 'mSide_FileStationWindow', text: 'ReadySHARE', iconCls: 'mif-local-service icon', leaf: true },
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
  render () {
    let {contentId} = this.state;
    let {displayed} = this.props;
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
              <div><Button ui="alt" cls="icon_big" iconCls="x-fa fa-gear" onTap={this.onShowHeaderPopup}/></div>
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
