
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem, TabPanel,FormPanel, Panel } from '@extjs/ext-react';

import LinkComp from './LinkComp';
import DDNS_Comp from './DDNS_Comp';
// import SRMSettingComp from './SRMSettingComp';
// import ServiceComp from './ServiceComp';
// import RegionOptionsComp from './RegionOptionsComp';
// import LED_Comp from './LED_Comp';
// import UsingStateComp from './UsingStateComp';

class InternetPageMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      titlebarRightText:'',
      showMenu:true,
      tabType:'link',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }

  componentWillUnmount () {
  }
  onTabTypeChange = (item)=>{
    console.log("onTabTypeChange:",item.value);
    this.setState({
      tabType:item.value,
    });
  }

  render () {
    let {tabType,bodyHeight,showMenu} = this.state;
    let {displayed} = this.props;
    return (
      <div className="page_content">
        <TitleBar
            cls="titlebar-mobile"
            title={Intl.get('Internet')}
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
                  <MenuItem text={Intl.get('Link')} value="link" iconCls={tabType === 'link' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('QuickConnect & DDNS')} value="DDNS" iconCls={tabType === 'DDNS' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('Port Forwarding')} value="portForwarding" iconCls={tabType === 'portForwarding' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('Port Trigger')} value="portTrigger" iconCls={tabType === 'portTrigger' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('DMZ')} value="DMZ" iconCls={tabType === 'DMZ' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={"IPv6 "+Intl.get('Tunnel')} value="IPv6Tunnel" iconCls={tabType === 'IPv6Tunnel' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('3G And 4G')} value="phoneMode" iconCls={tabType === 'phoneMode' && 'x-font-icon md-icon-check'}/>
              </Menu>
            </Button>:null
          }
        </TitleBar>
        <div className="page_content" style={{}}>
            {tabType=='link'?
              <LinkComp
                tabType={tabType} />:null
            }

            {tabType=='DDNS'?
              <DDNS_Comp
                tabType={tabType} />:null
            }

            {/*tabType=='portForwarding'?
              <WorkModeComp
                tabType={tabType} />:null
            */}

            {/*tabType=='portTrigger'?
              <WorkModeComp
                tabType={tabType} />:null
            */}

            {/*tabType=='DMZ'?
              <WorkModeComp
                tabType={tabType} />:null
            */}



        </div>
      </div>

    );
  }

}

export default InternetPageMobile;
