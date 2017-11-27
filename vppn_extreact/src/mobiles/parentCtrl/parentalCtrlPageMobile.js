
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,Menu,MenuItem, TabPanel,FormPanel, Panel } from '@extjs/ext-react';

import ParentPlanMB from './ParentPlanMB'
import ParentFilterMB from './ParentFilterMB'

class ParentalCtrlPageMobile extends Component{
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
            title={Intl.get('parentalCtrl')}
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
                height={'100%'} margin='0 0 60 0'
                tabBar={{ docked: 'bottom' }}
            >
                <Container title={Intl.get('Plan')} cls='fix_bottom'>
                    <ParentPlanMB />
                </Container>
                {/* 可设置右上角的标记文本：badgeText="4" */}
                <Container title={Intl.get('Website Filter')} cls='fix_bottom'>
                    <ParentFilterMB/>
                </Container>
            </TabPanel>
        </div>
      </div>

    );
  }

}

export default ParentalCtrlPageMobile;
