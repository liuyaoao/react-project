
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,Menu,MenuItem, Label,FormPanel, Panel } from '@extjs/ext-react';

import VlanPortMB from './VlanPortMB'
import VlanSettingMB from './VlanSettingMB'
import VlanDiagnosisMB from './VlanDiagnosisMB'

class VlanPageMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      vProxyIpArr:['10.100.16.84','10.100.16.9','10.100.16.68'],
      titlebarRightText:'',
      tabName:'vPort',
      tabType:'vPort_1',
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
      tabName:item.value.split('_')[0]
    });
  }
  componentWillUnmount () {
  }

  render () {
    let {tabName,showMenu,tabType} = this.state;
    let {displayed} = this.props;
    return (
      <div>
        <TitleBar
            cls="titlebar-mobile"
            title="Cloud VPN"
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
                  <MenuItem text="vPort1" value="vPort_1" iconCls={tabType === 'vPort_1' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="vPort2" value="vPort_2" iconCls={tabType === 'vPort_2' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="vPort3" value="vPort_3" iconCls={tabType === 'vPort_3' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="vPort4" value="vPort_4" iconCls={tabType === 'vPort_4' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="vPort5" value="vPort_5" iconCls={tabType === 'vPort_5' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="Diagnosis" value="diagnosis" iconCls={tabType === 'diagnosis' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text="Setting" value="setting" iconCls={tabType === 'setting' && 'x-font-icon md-icon-check'}/>
              </Menu>
            </Button>:null
          }
        </TitleBar>
        <div className="page_content" style={{}}>
          {tabName=='vPort'?
            <VlanPortMB
              vProxyIpArr={this.state.vProxyIpArr}
              tabType={tabType}
            />:null
          }
          {tabName=='setting'?
            <VlanSettingMB
              tabType={tabType}
            />:null
          }
          {tabName=='diagnosis'?
            <VlanDiagnosisMB
              tabType={tabType}
            />:null
          }
        </div>
      </div>

    );
  }

}

export default VlanPageMobile;
