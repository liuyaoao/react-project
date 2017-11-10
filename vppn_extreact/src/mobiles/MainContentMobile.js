
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SegmentedButton, Label,FormPanel, Panel } from '@extjs/ext-react';

import FileStationPageMobile from './fileStation/FileStationPageMobile';
import NetworkPageMobile from './network/NetworkPageMobile';
import VlanPageMobile from './vlan/VlanPageMobile';

class MainContentMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      titlebarRightText:'完成',
      moduleName:'fileStation',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount () {
  }

  render () {
    let {displayed} = this.props;
    return (
      <div className="" style={{width:'100%',height:'100%',position:'relative'}}>
        <TitleBar cls="titlebar-mobile" title="主内容区" docked="top" height="45px"
            platformConfig={{
                phone: {
                    titleAlign: 'center'
                }
            }}
        >
          <Button align="left" ui="default" iconCls="x-fa fa-bars" onTap={this.props.toggleMenu}/>
          {this.state.titlebarRightText?
            <Button align="right" ui="default" text={this.state.titlebarRightText}/>:null
          }
        </TitleBar>
        {this.state.moduleName=="fileStation"?<FileStationPageMobile /> : null}
        {this.state.moduleName=="network"?<NetworkPageMobile /> : null}
        {this.state.moduleName=="vlan"?<VlanPageMobile /> : null}
      </div>
    );
  }

}

export default MainContentMobile;
