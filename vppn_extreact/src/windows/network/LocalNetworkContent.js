import React,{Component} from 'react';
import Intl from '../../intl/Intl';

import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,ToggleField   } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class LocalNetworkContent extends Component {
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
        <div className='localNetwork_content' style={{height:'100%'}}>
          <TabPanel cls='localNetwork_tabPanel'
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
              <Container title="常规" cls="state_Internet" scrollable={true}>
                <div style={{margin:'20px'}}>常规
                </div>
              </Container>
              <Container title="IPv6" cls="state_equipList" scrollable={true}>
                  <div className="">
                    IPv6
                  </div>
              </Container>
              <Container title="静态路由" cls="state_CPU" scrollable={true}>
                  <div className="">
                    静态路由
                  </div>
              </Container>
              <Container title="DHCP客户端" cls="state_memory" scrollable={true}>
                  <div className="">
                    DHCP客户端
                  </div>
              </Container>

              <Container title="DHCP保留" cls="state_memory" scrollable={true}>
                  <div className="">
                    DHCP客户端
                  </div>
              </Container>

              <Container title="IPTV和VoIP" cls="state_memory" scrollable={true}>
                  <div className="">
                    IPTV和VoIP
                  </div>
              </Container>

            </TabPanel>
        </div>
    )
  }
}
