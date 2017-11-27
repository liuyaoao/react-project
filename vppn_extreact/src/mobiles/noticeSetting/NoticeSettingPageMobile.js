
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,Menu,MenuItem, TabPanel,FormPanel, Panel } from '@extjs/ext-react';

import EmailComp from './EmailComp'; //电子邮件服务
import MessageComp from './MessageComp'; //短信通知
import PushServiceComp from './PushServiceComp'; //推送服务
import AdvancedSettingComp from './AdvancedSettingComp'; //高级设置

class NoticeSettingPageMobile extends Component{
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
            title={Intl.get('noticeSettings')}
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
        <div>
            <TabPanel cls='tabpanel_m tabpanel_bottom_m'
                height={'100%'}
                tabBar={{ docked: 'bottom' }}
            >
                <Container title={Intl.get('Email')} cls='fix_bottom'>
                    <EmailComp />
                </Container>
                {/* 可设置右上角的标记文本：badgeText="4" */}
                <Container title={Intl.get('Message')} cls='fix_bottom'>
                    <MessageComp/>
                </Container>
                <Container title={Intl.get('Push Service')} cls='fix_bottom'>
                    <PushServiceComp/>
                </Container>
                <Container title={Intl.get('Advanced Setting')} cls='fix_bottom'>
                    <AdvancedSettingComp/>
                </Container>
            </TabPanel>
        </div>
      </div>

    );
  }

}

export default NoticeSettingPageMobile;
