import React,{Component} from 'react';
import Intl from '../../intl/Intl';

import { TabPanel, Container, FormPanel,TextField,RadioField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,CheckColumn,
  Column,ToggleField,ContainerField,CheckBoxField   } from '@extjs/ext-react';

Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class LocalNetworkContent extends Component {
    state={
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

    render(){
      return (
        <div className='localNetwork_content' style={{height:'100%',position:'relative'}}>
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
              <Container title={Intl.get('Routine')} cls="state_Internet" scrollable={true}>
                  <RoutineComp/>
              </Container>
              <Container title="IPv6" cls="state_equipList" scrollable={true}>
                  <IPv6Comp/>
              </Container>
              <Container title={Intl.get('Static Route')} cls="state_CPU" scrollable={true}>
                  <StaticRouteComp/>
              </Container>
              <Container title={"DHCP "+Intl.get('Client')} cls="state_memory" scrollable={true}>
                  <DHCP_ClientComp/>
              </Container>

              <Container title={"DHCP "+Intl.get('Retain')} cls="state_memory" scrollable={true}>
                  <DHCP_RetainComp/>
              </Container>

              <Container title={Intl.get('IPTV And VoIP')} cls="state_memory" scrollable={true}>
                  <IPTV_And_VoIP_Comp/>
              </Container>

            </TabPanel>
            <Container layout={{type:'hbox',pack:'end',align:'bottom'}} height="40px" width="100%" style={{position:'absolute',bottom:'10px',right:'20px'}}>
                <Button text={Intl.get('Apply')} ui={'confirm alt'} style={{marginRight:'10px'}}/>
                <Button text={Intl.get('Reset')} ui={'decline alt'} style={{marginLeft:'10px'}}/>
            </Container>
        </div>
    )
  }
}

//常规 Routine
class RoutineComp extends Component{
  state={
    DHCPServerOn:'1', //1 表示启动， 0 表示关闭
    maskNumber:'225.225.225.0',
  }
  onMaskNumberChange = (newValue)=>{
    this.setState({ maskNumber:newValue });
  }

  onDHCPServerChange = (newValue)=>{
    this.setState({ DHCPServerOn:newValue });
  }
  render () {
    let {maskNumber,DHCPServerOn} = this.state;
    return (
      <div className="cnt" style={{margin:'10px',width:'95%',marginBottom:'50px'}}>
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
    );
  }
}

//IPv6
class IPv6Comp extends Component{
  state = {
    DHCPServerOn:"1",
  }
  onDHCPServerChange = (newValue)=>{
    this.setState({ DHCPServerOn:newValue });
  }
  componentDidMount(){
  }
  render () {
    let {DHCPServerOn} = this.state;
    const radioProps = {
        name: 'radios'
    };
    return (
        <div style={{padding:'10px'}}>
          <Container layout="vbox" >
              <Container flex={1}>
                <div style={{'float':'left'}}>
                  <CheckBoxField boxLabel={Intl.get('Enable ')+'IPv6'} cls="black_label"/>
                </div>
              </Container>
              <ContainerField label={Intl.get('Prefix')+"："}
                cls="black_label auto_width disable_text"
                width="100%"
                layout={'hbox'}
                labelAlign="left" labelTextAlign="left">
                <Button ui="menu" text={Intl.get('123.456.213')}
                  style={{width:'100%','float':'left'}}
                  textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onDHCPServerChange, group: 'buttonstyle' }}>
                       <MenuItem text={Intl.get('123.456.213')} value="1" iconCls={DHCPServerOn === '1' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text={Intl.get('123.456.213')} value="0" iconCls={DHCPServerOn === '0' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
              <TextField label={Intl.get('Main')+" DNS："}
                labelTextAlign="text" labelAlign="left"
                value="192.168.1.1"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <TextField label={Intl.get('Sub')+" DNS："}
                labelTextAlign="text" labelAlign="left"
                value="192.168.1.1"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <FormPanel layout={{type:'vbox',pack:'center',align:'left'}} padding="0">
                <RadioField {...radioProps} cls="black_label" boxLabel={Intl.get('Stateless mode')} value="checked1" checked/>
                <RadioField {...radioProps} cls="black_label" boxLabel={Intl.get('Stateless DHCPv6 mode')} value="checked2"/>
                <RadioField {...radioProps} cls="black_label" boxLabel={Intl.get('State mode')} value="checked3"/>
              </FormPanel>
              <TextField label={Intl.get('Start IP Address')+"："}
                labelTextAlign="text" labelAlign="left"
                value="225.225.225.0"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <TextField label={Intl.get('End IP Address')+"："}
                labelTextAlign="text" labelAlign="left"
                value=""
                cls="black_label auto_width disable_text"
                textAlign="right"/>
          </Container>
        </div>
    );
  }
}

//静态路由
class StaticRouteComp extends Component{
  state = {
    DHCPServerOn:"1",
  }
  dataStore = new Ext.data.Store({
      data: [
        {index:1, name:' Wireless',price:'342.54', priceChange:'mif-wifi-connect icon'},
        {index:2, name:' Internet',price:'342.54', priceChange:'mif-earth icon'}
      ],
      sorters: 'name'
  })
  onDHCPServerChange = (newValue)=>{
    this.setState({ DHCPServerOn:newValue });
  }
  componentDidMount(){
  }
  render () {
    let {DHCPServerOn} = this.state;
    return (
        <div style={{padding:'10px',marginBottom:'40px'}}>
          <Container layout={{type:'hbox',pack:'space-between',align:'bottom'}}>
            <Container style={{'float':'left'}}>
              <Button text={Intl.get('Add')} ui="confirm raised" style={{marginRight:'10px'}}/>
              <Button text={Intl.get('Delete')} ui="decline raised" style={{marginRight:'10px'}}/>
              <Button text={Intl.get('Save')} ui="decline raised" style={{marginRight:'10px'}}/>
              <Button text={'IP '+Intl.get('Routing table')} ui="decline raised" />
            </Container>
            <Container style={{'float':'right'}}>
              <Button ui="menu" text="IPv4"
                style={{width:'100%'}}>
                 <Menu defaults={{ handler: this.onDHCPServerChange, group: 'buttonstyle' }}>
                     <MenuItem text={Intl.get('IPv4')} value="1" iconCls={DHCPServerOn === '1' && 'x-font-icon md-icon-check'}/>
                     <MenuItem text={Intl.get('IPv6')} value="0" iconCls={DHCPServerOn === '0' && 'x-font-icon md-icon-check'}/>
                 </Menu>
              </Button>
            </Container>
          </Container>
          <Container width="100%" margin="10 0 10 0">
            <Grid shadow grouped
              store={this.dataStore}
              style={{minHeight:'400px'}}
              scrollable={true}>
                <CheckColumn text={Intl.get('Apply')} width="100" dataIndex="name" groupable={false} sortable={false}/>
                <Column text={Intl.get('Network target address')} width="120" dataIndex="price"/>
                <Column text={Intl.get('Subnet mask')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Gateway')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Interface')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('State')} width="100" dataIndex="priceChange"/>
            </Grid>
          </Container>
        </div>
    );
  }
}

//DHCP客户端
class DHCP_ClientComp extends Component{
  state = {
    DHCPServerOn:"1",
  }
  onDHCPServerChange = (newValue)=>{
    this.setState({ DHCPServerOn:newValue });
  }
  dataStore = new Ext.data.Store({
      data: [
        {index:1, name:' Wireless',price:'342.54', priceChange:'mif-wifi-connect icon'},
        {index:2, name:' Internet',price:'342.54', priceChange:'mif-earth icon'}
      ],
      sorters: 'name'
  })
  componentDidMount(){
  }
  render () {
    let {DHCPServerOn} = this.state;
    return (
        <div style={{padding:'10px',marginBottom:'40px'}}>
          <Container layout={{type:'hbox',pack:'space-between',align:'bottom'}}>
            <Container style={{'float':'left'}}>
              <Button text={Intl.get('Refresh')} ui="confirm raised" style={{marginRight:'10px'}}/>
              <Button text={Intl.get('Add to address reservation')} ui="decline raised" />
            </Container>
            <Container style={{'float':'right'}}>
              <Button ui="menu" text="IPv4"
                style={{width:'100%'}}>
                 <Menu defaults={{ handler: this.onDHCPServerChange, group: 'buttonstyle' }}>
                     <MenuItem text={Intl.get('IPv4')} value="1" iconCls={DHCPServerOn === '1' && 'x-font-icon md-icon-check'}/>
                     <MenuItem text={Intl.get('IPv6')} value="0" iconCls={DHCPServerOn === '0' && 'x-font-icon md-icon-check'}/>
                 </Menu>
              </Button>
            </Container>
          </Container>
          <Container width="100%" margin="10 0 10 0">
            <Grid shadow grouped
              store={this.dataStore}
              style={{minHeight:'400px'}}
              scrollable={true}>
                <Column text={Intl.get('MAC/DUID')} width="120" dataIndex="price"/>
                <Column text={Intl.get('IP')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Host')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Expiration date')} width="100" dataIndex="priceChange"/>
            </Grid>
          </Container>
        </div>
    );
  }
}

//DHCP保留
class DHCP_RetainComp extends Component{
  state = {
    DHCPServerOn:"1",
  }
  dataStore = new Ext.data.Store({
      data: [
        {index:1, name:' Wireless',price:'342.54', priceChange:'mif-wifi-connect icon'},
        {index:2, name:' Internet',price:'342.54', priceChange:'mif-earth icon'}
      ],
      sorters: 'name'
  })
  componentDidMount(){
  }
  render () {
    let {DHCPServerOn} = this.state;
    return (
        <div style={{padding:'10px',marginBottom:'40px'}}>
          <Container layout={{type:'hbox',pack:'space-between',align:'bottom'}}>
            <Container style={{'float':'left'}}>
              <Button text={Intl.get('Add')} ui="confirm raised" style={{marginRight:'10px'}}/>
              <Button text={Intl.get('Delete')} ui="decline raised" style={{marginRight:'10px'}}/>
              <Button text={Intl.get('Save')} ui="decline raised" />
            </Container>
            <Container style={{'float':'right'}}>
              <Button ui="menu" text="IPv4"
                style={{width:'100%'}}>
                 <Menu defaults={{ handler: this.onDHCPServerChange, group: 'buttonstyle' }}>
                     <MenuItem text={Intl.get('IPv4')} value="1" iconCls={DHCPServerOn === '1' && 'x-font-icon md-icon-check'}/>
                     <MenuItem text={Intl.get('IPv6')} value="0" iconCls={DHCPServerOn === '0' && 'x-font-icon md-icon-check'}/>
                 </Menu>
              </Button>
            </Container>
          </Container>
          <Container width="100%" margin="10 0 10 0">
            <Grid shadow grouped
              store={this.dataStore}
              style={{minHeight:'400px'}}
              scrollable={true}>
                <Column text={Intl.get('MAC/DUID')} width="120" dataIndex="price"/>
                <Column text={Intl.get('IP')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Host')} width="100" dataIndex="priceChange"/>
            </Grid>
          </Container>
        </div>
    );
  }
}

//IPTV 和 VoIP
class IPTV_And_VoIP_Comp extends Component{
  state = {
    maskNumber:"1",
  }
  componentDidMount(){
  }
  onMaskNumberChange = (item)=>{

  }
  render () {
    let {maskNumber} = this.state;
    return (
        <div style={{padding:'10px'}}>
          <Container layout="vbox">
            <Container flex={1}>
              <div style={{'float':'left'}}>
                <CheckBoxField boxLabel={'Enable '+Intl.get('IPTV/VoIP')} cls="black_label"/>
              </div>
            </Container>
            <ContainerField label={Intl.get('Mode')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
              <Button ui="menu raised" text={'IPTV/VoIP '+Intl.get('Configuration')} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                 <Menu defaults={{ handler: this.onMaskNumberChange, group: 'buttonstyle' }}>
                     <MenuItem text={'IPTV/VoIP '+Intl.get('Configuration')} value="1" iconCls={maskNumber === '1' && 'x-font-icon md-icon-check'}/>
                     <MenuItem text="12334556" value="2" iconCls={maskNumber === '2' && 'x-font-icon md-icon-check'}/>
                 </Menu>
              </Button>
            </ContainerField>
            <ContainerField label={'ISP '+Intl.get('Configuration')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
              <Button ui="menu raised" text={"M1-Fiber"} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                 <Menu defaults={{ handler: this.onMaskNumberChange, group: 'buttonstyle' }}>
                     <MenuItem text="M1-Fiber" value="1" iconCls={maskNumber === '1' && 'x-font-icon md-icon-check'}/>
                     <MenuItem text="M2-Fiber" value="2" iconCls={maskNumber === '2' && 'x-font-icon md-icon-check'}/>
                 </Menu>
              </Button>
            </ContainerField>
          </Container>
        </div>
    );
  }
}
