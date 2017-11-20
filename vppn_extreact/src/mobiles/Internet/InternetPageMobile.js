
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem, TabPanel,FormPanel, Panel,ContainerField } from '@extjs/ext-react';

import LinkComp from './LinkComp';
import DDNS_Comp from './DDNS_Comp';
import PortForwardingComp from './PortForwardingComp';
import PortTriggerComp from './PortTriggerComp';
import IPv6TunnelComp from './IPv6TunnelComp';
// import LED_Comp from './LED_Comp';
// import UsingStateComp from './UsingStateComp';

class InternetPageMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      titlebarRightText:'',
      showMenu:true,
      tabType:'link',

      enableDMZ:'Enabled',
      DMZHostIP:'192.168.9.12',
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

  onEnableDMZChange = (item)=>{
    this.setState({enableDMZ:item.value});
  }
  onDMZHostIPChange = (item)=>{
    this.setState({});
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

            {tabType=='portForwarding'?
              <PortForwardingComp
                tabType={tabType} />:null
            }

            {tabType=='portTrigger'?
              <PortTriggerComp
                tabType={tabType} />:null
            }
            {tabType=='DMZ'?
              <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
                <div style={{padding:'10px'}}>
                  <div>{Intl.get('DMZ allows you to display a server on the Internet so that all inbound packets will redirect to the server.')}</div>
                  <div style={{margin:'10px 0'}}>{Intl.get('This is very useful when the server is running applications that use an uncertain inbound port.')}</div>
                  <Container layout={{type:'vbox'}}>
                      <ContainerField label={Intl.get('Enable')+' DMZ:'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                        <Button ui="menu raised" text={Intl.get(this.state.enableDMZ)} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                           <Menu defaults={{ handler: this.onEnableDMZChange, group: 'buttonstyle' }}>
                               <MenuItem text={Intl.get('Enabled')} value="Enabled" iconCls={this.state.enableDMZ === 'Enabled' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text={Intl.get('Disabled')} value="Disabled" iconCls={this.state.enableDMZ === 'Disabled' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </ContainerField>
                      <ContainerField label={Intl.get('DMZ Host IP Address')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                        <Button ui="menu raised" text={this.state.DMZHostIP} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                           <Menu defaults={{ handler: this.onDMZHostIPChange, group: 'buttonstyle' }}>
                               <MenuItem text='192.168.9.12' value="Enabled" iconCls={this.state.DMZHostIP === 'Enabled' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text='192.168.9.14' value="Disabled" iconCls={this.state.DMZHostIP === 'Disabled' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </ContainerField>
                  </Container>
                </div>
              </div> : null
            }

            {tabType=='IPv6Tunnel'?
              <IPv6TunnelComp
                tabType={tabType} />:null
            }

            {tabType=='phoneMode'?
              <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
                <div style={{padding:'10px'}}>
                  <Container layout={{type:'hbox',pack:'space-between',aglin:'bottom'}}>
                    <Button text={Intl.get('Edit')} ui="confirm raised" />
                    <Button text={Intl.get('Connection')} ui="decline raised" />
                  </Container>
                </div>
              </div>:null
            }



        </div>
      </div>

    );
  }

}

export default InternetPageMobile;
