import React,{Component} from 'react';
import Intl from '../../intl/Intl';

import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,ToggleField,ContainerField,CheckBoxField   } from '@extjs/ext-react';

Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class LocalNetworkContent extends Component {
    state={
      DHCPServerOn:'1', //1 表示启动， 0 表示关闭
      maskNumber:'225.225.225.0',
      // wifi5GSwitch:true,
      // menuItemVal:'',
      // selectedBootsNode:'220.168.30.12',
    }
    // onAddTypeChange = (item)=>{
    //   this.setState({menuItemVal:item.value});
    // }
    // onBootsNodeSelectChanged = (field, newValue)=>{
    //   this.setState({ selectedBootsNode:newValue });
    //   Ext.toast(`You selected the item with value ${newValue}`);
    // }
    // onClickWifi5GSwitch = (e)=>{
    //   console.log("点击了wifi 5GHz开关：",e);
    //   this.setState( {wifi5GSwitch:!this.state.wifi5GSwitch} );
    // }

    onMaskNumberChange = (newValue)=>{
      this.setState({ maskNumber:newValue });
    }

    onDHCPServerChange = (newValue)=>{
      this.setState({ DHCPServerOn:newValue });
    }
    render(){
      let {maskNumber,DHCPServerOn} = this.state;

      return (
        <div className='localNetwork_content' style={{height:'100%'}}>
          <TabPanel cls='tabpanel_pc localNetwork_tabPanel'
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
                <div className="cnt" style={{margin:'10px',width:'95%'}}>
                  <div className="title">{Intl.get('Local')+' IP'}</div>
                  <Container layout="vbox">
                    <TextField label={"IP "+Intl.get('Address')+"："}
                      labelTextAlign="text"
                      labelAlign="left" value="192.168.1.1"
                      cls="black_label"/>
                    <SelectField label={Intl.get('Mask')+':'}
                      labelTextAlign="left" labelAlign="left" value={maskNumber}
                      onChange={(field, newValue) => this.onMaskNumberChange(newValue)}
                      options={[
                          { text: '225.225.225.0', value: '225.225.225.0' },
                          { text: '225.225.225.3', value: '225.225.225.3' }
                      ]}
                      cls="black_label"/>
                  </Container>

                  <div className="title" style={{marginTop:'10px'}}>{'DHCP '+Intl.get('Server')}</div>
                  <Container layout="vbox" >
                      <SelectField label={'DHCP '+Intl.get('Server')+"："}
                        labelTextAlign="left" labelAlign="left" labelWidth='150px'
                        value={DHCPServerOn}
                        onChange={(field, newValue) => this.onDHCPServerChange(newValue)}
                        options={[
                            { text: 'Enabled', value: 'Enabled' },
                            { text: 'Closed', value: 'Closed' }
                        ]}
                        cls="black_label"/>
                      <TextField label={Intl.get('Start IP Address')+"："}
                        labelTextAlign="text" labelAlign="left" labelWidth='150px'
                        value="192.168.1.1"
                        cls="black_label"/>
                      <TextField label={Intl.get('End IP Address')+"："}
                        labelTextAlign="text" labelAlign="left" labelWidth='150px'
                        value="192.168.1.1"
                        cls="black_label"/>
                      <TextField label={Intl.get('Rent Address Time(Unit s)')+"："}
                        labelTextAlign="text" labelAlign="left" labelWidth='150px'
                        value="12134"
                        cls="black_label"/>
                      <TextField label={Intl.get('Gateway')+"："}
                        labelTextAlign="text" labelAlign="left" labelWidth='150px'
                        value="225.225.225.0"
                        cls="black_label"/>
                      <TextField label={'DHCP '+Intl.get('Server')+"："}
                        labelTextAlign="text" labelAlign="left" labelWidth='150px'
                        value=""
                        cls="black_label"/>
                      <SelectField label={Intl.get('Transfer to known DHCP Server')+':'}
                        labelTextAlign="left" labelAlign="left" labelWidth='150px'
                        value={DHCPServerOn}
                        onChange={(field, newValue) => this.onDHCPServerChange(newValue)}
                        options={[
                            { text: 'Enabled', value: 'Enabled' },
                            { text: 'Closed', value: 'Closed' }
                        ]}
                        cls="black_label"/>
                      <Container flex={1}>
                        <div style={{'float':'left'}}><CheckBoxField boxLabel={Intl.get('Enable web proxy server to automatically discover')}/></div>
                      </Container>
                      <TextField label={Intl.get('Website')+"："}
                        labelTextAlign="text" labelAlign="left" labelWidth='150px'
                        value=""
                        cls="black_label"/>
                      <SelectField label={Intl.get('Enable')+" UPnP："}
                        labelTextAlign="left" labelAlign="left" labelWidth='150px'
                        value={DHCPServerOn}
                        onChange={(field, newValue) => this.onDHCPServerChange(newValue)}
                        options={[
                            { text: 'Enabled', value: 'Enabled' },
                            { text: 'Closed', value: 'Closed' }
                        ]}
                        cls="black_label"/>

                      <Container layout={{type:'hbox',pack:'left',align:'bottom'}} margin="10 10 10 10">
                          <Button text={'UPnP '+Intl.get('Client list')} ui={'confirm alt'} />
                      </Container>
                      <SelectField label={Intl.get('Enable PPPoE relay')+"："}
                        labelTextAlign="left" labelAlign="left" labelWidth='150px'
                        value={DHCPServerOn}
                        onChange={(field, newValue) => this.onDHCPServerChange(newValue)}
                        options={[
                            { text: 'Enabled', value: 'Enabled' },
                            { text: 'Closed', value: 'Closed' }
                        ]}
                        cls="black_label"/>
                  </Container>

                  <div className="title" style={{marginTop:'10px'}}>{Intl.get('Guest')+' DHCP '+Intl.get('Server')}</div>
                  <Container layout="vbox">
                      <TextField label={Intl.get('Start IP Address')+"："}
                        labelTextAlign="text" labelAlign="left" labelWidth='150px'
                        value="192.168.1.1"
                        cls="black_label"/>
                      <TextField label={Intl.get('End IP Address')+"："}
                        labelTextAlign="text" labelAlign="left" labelWidth='150px'
                        value="192.168.1.1"
                        cls="black_label"/>
                      <TextField disabled label={Intl.get('Gateway')+"："}
                        labelTextAlign="text" labelAlign="left" labelWidth='150px'
                        value="225.225.225.0"
                        cls="black_label disable_text"/>
                  </Container>

                  <div className="title" style={{marginTop:'10px'}}>{Intl.get('Advanced Options')}</div>
                  <Container layout="vbox">
                      <SelectField label={Intl.get('IGMP Snooping')+"："}
                        labelTextAlign="left" labelAlign="left" labelWidth='150px'
                        value={DHCPServerOn}
                        onChange={(field, newValue) => this.onDHCPServerChange(newValue)}
                        options={[
                            { text: 'Enabled', value: 'Enabled' },
                            { text: 'Closed', value: 'Closed' }
                        ]}
                        cls="black_label"/>
                      <SelectField label={Intl.get('NAT')+"："}
                        labelTextAlign="left" labelAlign="left" labelWidth='150px'
                        value={DHCPServerOn}
                        onChange={(field, newValue) => this.onDHCPServerChange(newValue)}
                        options={[
                            { text: 'Enabled', value: 'Enabled' },
                            { text: 'Closed', value: 'Closed' }
                        ]}
                        cls="black_label"/>
                  </Container>
                </div>
                <Container layout={{type:'hbox',pack:'right',align:'bottom'}} margin="10 10 10 10">
                    <Button text={Intl.get('Apply')} ui={'confirm alt'} style={{marginRight:'10px'}}/>
                    <Button text={Intl.get('Reset')} ui={'decline alt'} style={{marginLeft:'10px'}}/>
                </Container>

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
