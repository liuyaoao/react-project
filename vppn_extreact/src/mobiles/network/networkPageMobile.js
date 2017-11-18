
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,Menu,MenuItem, Label,FormPanel, Panel } from '@extjs/ext-react';

import NetStateMB from './NetStateMB'
import NetWirelessMB from './NetWirelessMB'
import NetFlowCtrlMB from './NetFlowCtrlMB'

class NetworkPageMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      titlebarRightText:'',
      tabType:'state',
      showMenu:true,
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  onTabTypeChange = (item)=>{
    console.log("onVantypeChange:",item.value);
    this.setState({
      tabType:item.value,
    });
  }
  componentWillUnmount () {
  }

  render () {
    let {showMenu,tabType} = this.state;
    let {displayed} = this.props;
    return (
      <div className="page_content" style={{}}>
        <TitleBar
            cls="titlebar-mobile"
            title={Intl.get('Network Center')}
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
          {showMenu?
            <Button align="right" ui="default" iconCls="x-fa fa-ellipsis-h" arrow={false}>
              <Menu defaults={{ handler: this.onTabTypeChange, group: 'buttonstyle' }}>
                  <MenuItem text={Intl.get('State')} value="state" iconCls={tabType === 'state' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('Wireless')} value="wireless" iconCls={tabType === 'wireless' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('Flow Control')} value="flowCtrl" iconCls={tabType === 'flowCtrl' && 'x-font-icon md-icon-check'}/>
              </Menu>
            </Button>:null
          }
        </TitleBar>
        <div className="page_content" style={{padding:'10px'}}>
          {tabType=='state'?
            <NetStateMB
              tabType={tabType}/>:null
          }

          {tabType=='wireless'?
            <NetWirelessMB
              tabType={tabType}/>:null
          }

          {tabType=='flowCtrl'?
            <NetFlowCtrlMB
              tabType={tabType} />:null
          }

        </div>
      </div>
    );
  }

}

export default NetworkPageMobile;
