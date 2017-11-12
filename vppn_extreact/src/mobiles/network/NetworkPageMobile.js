
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,Menu,MenuItem, Label,FormPanel, Panel } from '@extjs/ext-react';

import NetStateMB from './NetStateMB'
import NetWirelessMB from './NetWirelessMB'
import NetInternetMB from './NetInternetMB'
import NetLocalMB from './NetLocalMB'

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
            title="Network Center"
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
                  <MenuItem text="状态" value="state" iconCls={tabType === 'state' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="无线" value="wireless" iconCls={tabType === 'wireless' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="互联网" value="Internet" iconCls={tabType === 'Internet' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="本地网络" value="localNetwork" iconCls={tabType === 'localNetwork' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="家长控制" value="parentalCtrl" iconCls={tabType === 'parentalCtrl' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="流量控制" value="flowCtrl" iconCls={tabType === 'flowCtrl' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="安全性" value="security" iconCls={tabType === 'security' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="通知设置" value="noticeSettings" iconCls={tabType === 'noticeSettings' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="管理" value="management" iconCls={tabType === 'management' && 'x-font-icon md-icon-check'}/>
              </Menu>
            </Button>:null
          }
        </TitleBar>
        <div className="page_content" style={{}}>
          {tabType=='state'?
            <NetStateMB
              tabType={tabType}
            />:null
          }
          {tabType=='wireless'?
            <NetWirelessMB
              tabType={tabType}
            />:null
          }
          {tabType=='Internet'?
            <NetInternetMB
              tabType={tabType}
            />:null
          }
        </div>
      </div>
    );
  }

}

export default NetworkPageMobile;
