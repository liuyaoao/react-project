
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem, TabPanel,FormPanel, Panel } from '@extjs/ext-react';

import RoutineComp from './RoutineComp';
import IPv6Comp from './IPv6Comp';
import StaticRouteComp from './StaticRouteComp';
import DHCP_ClientComp from './DHCP_ClientComp';
import DHCP_RetainComp from './DHCP_RetainComp';

import IPTV_And_VoIP_Comp from './IPTV_And_VoIP_Comp';

class LocalNetworkPageMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      titlebarRightText:'',
      showMenu:true,
      tabType:'Routine',
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
            title={Intl.get('management')}
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
                  <MenuItem text={Intl.get('Routine')} value="Routine" iconCls={tabType === 'Routine' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('IPv6')} value="IPv6" iconCls={tabType === 'IPv6' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('Static Route')} value="staticRoute" iconCls={tabType === 'staticRoute' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={"DHCP "+Intl.get('Client')} value="DHCP_Client" iconCls={tabType === 'DHCP_Client' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={"DHCP "+Intl.get('Retain')} value="DHCP_Retain" iconCls={tabType === 'DHCP_Retain' && 'x-font-icon md-icon-check'}/>
                  <MenuItem text={Intl.get('IPTV And VoIP')} value="IPTV_And_VoIP" iconCls={tabType === 'IPTV_And_VoIP' && 'x-font-icon md-icon-check'}/>
              </Menu>
            </Button>:null
          }
        </TitleBar>
        <div className="page_content" style={{}}>
            {tabType=='Routine'?
              <RoutineComp
                tabType={tabType} />:null
            }
            {tabType=='IPv6'?
              <IPv6Comp tabType={tabType}/>:null
            }

            {tabType=='staticRoute'?
              <StaticRouteComp tabType={tabType}/>:null
            }

             {tabType=='DHCP_Client'?
               <DHCP_ClientComp
                 tabType={tabType}/>:null
             }
             {tabType=='DHCP_Retain'?
               <DHCP_RetainComp
                 tabType={tabType}/>:null
             }

             {tabType=='IPTV_And_VoIP'?
               <IPTV_And_VoIP_Comp
                 tabType={tabType}/>:null
             }

        </div>
      </div>

    );
  }

}

export default LocalNetworkPageMobile;
