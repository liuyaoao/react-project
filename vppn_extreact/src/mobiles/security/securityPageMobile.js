
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,Menu,MenuItem, TabPanel,FormPanel, Panel } from '@extjs/ext-react';

import SecurityComp from './SecurityComp';  //安全性
import FirewallComp from './FirewallComp';   //防火墙
import AutoBlockComp from './AutoBlockComp';  //自动封锁
import CertificateComp from './CertificateComp'; //证书

class SecurityPageMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      titlebarRightText:'',
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
    let {bodyHeight} = this.state;
    let {displayed} = this.props;
    return (
      <div className="page_content">
        <TitleBar
            cls="titlebar-mobile"
            title={Intl.get('security')}
            height="45px"
            zIndex="108"
            platformConfig={{
                phone: {titleAlign: 'center'}
            }}
            style={{position:'fixed',top:'0'}}
        >
          <Button align="left" ui="default" iconCls="x-fa fa-bars" onTap={this.props.toggleSidebar}/>
          {this.state.titlebarRightText?
            <Button align="right" ui="default" text={this.state.titlebarRightText}/>:null
          }
        </TitleBar>
        <div className="page_content" style={{}}>
          <div className='' style={{height:(bodyHeight-45)+"px"}}>
            <TabPanel cls='tabpanel_m tabpanel_bottom_m'
                height={'100%'} margin='0 0 60 0'
                tabBar={{ docked: 'bottom' }}
            >
                <Container title={Intl.get('Security')} padding="10 10 60 10">
                    <SecurityComp />
                </Container>
                {/* 可设置右上角的标记文本：badgeText="4" */}
                <Container title={Intl.get('Firewall')} >
                    <FirewallComp />
                </Container>
                <Container title={Intl.get('Auto Block')} >
                    <AutoBlockComp/>
                </Container>
                <Container title={Intl.get('Certificate')} >
                    <CertificateComp/>
                </Container>
            </TabPanel>
          </div>
        </div>
      </div>

    );
  }

}

export default SecurityPageMobile;
