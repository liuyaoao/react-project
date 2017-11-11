
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
    let {contentId,displayed} = this.props;
    return (
      <div className="main_content">
        <TitleBar
            cls="titlebar-mobile"
            title="主内容区"
            docked="top"
            height="45px"
            zIndex="108"
            platformConfig={{
                phone: {
                    titleAlign: 'center'
                }
            }}
            style={{position:'fixed',top:'0'}}
        >
          <Button align="left" ui="default" iconCls="x-fa fa-bars" onTap={this.props.toggleSidebar}/>
          {this.state.titlebarRightText?
            <Button align="right" ui="default" text={this.state.titlebarRightText}/>:null
          }
        </TitleBar>
        {contentId=="FileStationWindow"||contentId==""?<FileStationPageMobile /> : null}
        {contentId=="NetworkCenterWindow"?<NetworkPageMobile /> : null}
        {contentId=="VlanWindow"?<VlanPageMobile /> : null}
      </div>
    );
  }

}

export default MainContentMobile;
