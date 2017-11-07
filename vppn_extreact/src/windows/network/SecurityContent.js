import React,{Component} from 'react';
import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,ToggleField   } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class SecurityContent extends Component {
    state={
      wifi5GSwitch:true,
      menuItemVal:'',
      selectedBootsNode:'220.168.30.12',
    }
    onAddTypeChange = (item)=>{
      this.setState({menuItemVal:item.value});
    }
    onBootsNodeSelectChanged = (field, newValue)=>{
      this.setState({ selectedBootsNode:newValue });
      Ext.toast(`You selected the item with value ${newValue}`);
    }
    onClickWifi5GSwitch = (e)=>{
      console.log("点击了wifi 5GHz开关：",e);
      this.setState( {wifi5GSwitch:!this.state.wifi5GSwitch} );
    }
    render(){
      let {menuItemVal,selectedBootsNode} = this.state;

      return (
        <div className='security_content' style={{height:'100%'}}>
          <TabPanel cls='security_tabPanel'
            height={'100%'}
            defaults={{
                cls: "card",
                // layout: "center",
                tab: {
                    flex: 0,
                    minWidth: 100
                }
            }}
            tabBar={{
                layout: {
                    pack: 'left'
                }
            }}
          >
              <Container title="安全性" cls="security_tab">
                <div style={{margin:'20px'}}>安全性
                </div>
              </Container>
              <Container title="防火墙" cls="firewall_tab">
                  <div className="">
                    防火墙
                  </div>
              </Container>
              <Container title="自动封锁" cls="autoLock_tab">
                  <div className="">
                    自动封锁
                  </div>
              </Container>
              <Container title="证书" cls="license_tab">
                  <div className="">
                    证书
                  </div>
              </Container>

              <Container title="DHCP保留" cls="DHCP_tab">
                  <div className="">
                    DHCP客户端
                  </div>
              </Container>

              <Container title="IPTV和VoIP" cls="IPTV_tab">
                  <div className="">
                    IPTV和VoIP
                  </div>
              </Container>

            </TabPanel>
        </div>
    )
  }
}
