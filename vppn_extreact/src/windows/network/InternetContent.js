import React,{Component} from 'react';
import Intl from '../../intl/Intl';

import { TabPanel, Container, FormPanel,TextField,Panel,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,Column,CheckColumn,
  CheckBoxField,RadioField,ContainerField   } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

let bootsNodeOptions = [
    { text: '220.168.30.12', value: '220.168.30.12' },
    { text: '220.168.30.1', value: '220.168.30.1' },
    { text: '220.168.30.6', value: '220.168.30.6' }
];

export default class InternetContent extends Component {
    state={
      menuItemVal:'',
      selectedBootsNode:'220.168.30.12',
      selectedVProxyIp:'', //选中的vProxy IP.
    }
    onAddTypeChange = (item)=>{
      this.setState({menuItemVal:item.value});
    }
    onBootsNodeSelectChanged = (field, newValue)=>{  //引导节点有改变。
      this.setState({ selectedBootsNode:newValue });
      Ext.toast(`You selected the item with value ${newValue}`);
    }
    onVProxySelectChanged = (field, newValue) => { //vProxy 路由ip有改变。
      this.setState({ selectedVProxyIp:newValue });
      Ext.toast(`You selected the item with value ${newValue}`);
    }
    render(){
      let {menuItemVal,selectedBootsNode} = this.state;
      return (
        <div className='Internet_content' style={{height:'100%'}}>
          <TabPanel cls='Internet_tabPanel'
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
              <Container title={Intl.get('Link')} cls="connect_tab" scrollable={true}>
                <div>
                  <FormPanel>
                    <FieldSet title={Intl.get('You can set up the Internet connection here. Your connection type is determined by the network environment. Please consult ISP to get the help you need.')}
                      layout={{type:'vbox',pack:'left',align: 'left'}}
                      defaults={{labelAlign: "placeholder"}}
                      width={'100%'}
                      margin="10 10 10 10">
                        <SelectField label={Intl.get('Connection Type')+':'} width={'90%'}
                            labelTextAlign="left" labelAlign="left" value={1}
                            onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                            options={[
                                { text: '高 - WAP2-个人', value: 1 },
                                { text: 'Option 1', value: 2 }
                            ]}
                        />
                        <SelectField label={Intl.get('Set as default gateway')+':'} width={'90%'}
                            labelTextAlign="left" labelAlign="left" value={1}
                            onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                            options={[
                                { text: '已启用', value: 1 },
                                { text: '已停用', value: 2 }
                            ]}
                        />
                        <TextField width={'90%'} label={"DNS "+Intl.get('Server')+"："} labelTextAlign="left" labelAlign="left" value="" />
                        <SelectField label={Intl.get('Enable')+' Jumbo Frame:'} width={'90%'}
                            labelTextAlign="left" labelAlign="left" value={1}
                            onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                            options={[
                                { text: '已停用', value: 1 },
                                { text: '已启用', value: 2 }
                            ]}
                        />
                    </FieldSet>
                  </FormPanel>
                  <Container
                    layout={{ type: 'hbox', pack: 'left'}}
                    margin="0 0 10 0"
                    defaults={{ margin: "0 10 10 0" }}>
                      <Button ui="confirm raised" text={'ISP '+Intl.get('Setting')}/>
                      <Button ui="raised" text={'ISP '+Intl.get('Setting')+'('+Intl.get('IPTV And VoIP')+')'}/>
                      <Button ui="raised" text={'VPN '+Intl.get('Setting')}/>
                      <Button ui="raised" text={'IPv6 '+Intl.get('Setting')}/>
                  </Container>
                </div>
              </Container>

              {/* QuickConnect & DDNS 内容区 */}
              <Container title={Intl.get('QuickConnect & DDNS')} cls="ddns_tab" scrollable={true}>
                  <DDNS_Comp/>
              </Container>

              {/* 端口转发 tab 内容区 */}
              <Container title={Intl.get('Port Forwarding')} cls="portTransfer_tab" scrollable={true}>
                  <div style={{background:'',border:'1px solid #9dd4d6',padding:'10px',margin:'10px',background:'#e4f3f5'}}>
                    <div style={{padding:'1px'}}>随处连接到您的 Synology Router</div>
                    <div style={{marginLeft:'10px',textAlign:'left'}}>
                      <div><span style={{width:'100px',display:'inline-block',paddingTop:'10px'}}>网页浏览器：</span><span>已停用</span></div>
                      <div><span style={{width:'100px',display:'inline-block',paddingTop:'10px'}}>DDNS：</span><span>已停用</span></div>
                      <div><span style={{width:'100px',display:'inline-block',paddingTop:'10px'}}>移动应用程序：</span><span>已停用</span></div>
                    </div>
                  </div>
                  <div className="cnt" style={{margin:'20px'}}>
                    <div className="title">5GHz</div>
                    <Panel
                      margin='10 0 10 0'
                      layout="vbox"
                    >
                      <div>QuickConnect能够让您在任何地方轻松连接到Synology Router，只需启动下方的QuickConnect并注册一组Synology账户即可完成。</div>
                      <Container flex={1}>
                        <div style={{'float':'left'}}><CheckBoxField boxLabel="启用QuickConnect"/></div>
                      </Container>
                    </Panel>
                  </div>

              </Container>

              {/* 端口触发 tab 内容区 */}
              <Container title={Intl.get('Port Trigger')} cls="portTrigger_tab" scrollable={true}>
                <div style={{padding:'10px'}}>
                  <Container layout={{type:'hbox',pack:'left',aglin:'bottom'}}>
                    <Button text={Intl.get('Add')} ui="confirm raised" />
                    <Button text={Intl.get('Edit')} ui="confirm raised" />
                    <Button text={Intl.get('Delete')} ui="decline raised" />
                    <Button text={Intl.get('Save')} ui="decline raised" />
                  </Container>
                  <Container width="100%" margin="10 0 10 0">
                    <Grid shadow grouped
                      store={this.dataStore}
                      style={{minHeight:'600px'}}
                      selectable={{}}
                      scrollable={true}>
                        <CheckColumn text={Intl.get('Enabled')} width="100" dataIndex="name" groupable={false} sortable={false}/>
                        <Column text={Intl.get('Full Name')} width="120" dataIndex="price"/>
                        <Column text={Intl.get('Trigger Port')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('Inbound Port')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('Source IP')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('MAC')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('Communication Protocol')} width="100" dataIndex="priceChange"/>
                    </Grid>
                  </Container>
                </div>
              </Container>

              {/* DMZ tab 内容区 */}
              <Container title={Intl.get('DMZ')} cls="DMZ_tab" scrollable={true}>
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
              </Container>

              {/* IPv6隧道 tab 内容区 */}
              <Container title={"IPv6 "+Intl.get('Tunnel')} cls="IPv6_tab" scrollable={true}>
                  <IPv6TunnelComp />
              </Container>

              {/* 3G和4G tab 内容区 */}
              <Container title={Intl.get('3G And 4G')} cls="threeFourG_tab" scrollable={true}>
                  <Container
                      layout={{ type: 'hbox', pack: 'left'}}
                      margin="10 0 10 10"
                      defaults={{ margin: "10 0 10 10" }}
                    >
                      <Button ui="raised" text="编辑"/>
                      <Button ui="confirm raised" text="连接"/>
                  </Container>
              </Container>

          </TabPanel>
        </div>
    )
  }
}


//
class DDNS_Comp extends Component{
  state = {
  }
  componentDidMount(){
  }
  render () {
    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <Container shadow padding="10 10 10 10">
            <FieldSet title={Intl.get('Connect to your router everywhere')} >
                <TextField disabled label={"DNS "+Intl.get('Server')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="disable_text"
                  textAlign="right"/>
                <TextField disabled label={"DNS "+Intl.get('Server')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="disable_text"
                  textAlign="right"/>
                <TextField disabled label={"DNS "+Intl.get('Server')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="disable_text"
                  textAlign="right"/>
            </FieldSet>
          </Container>

          <div className="cnt" style={{marginTop:'10px'}}>
            <div className="title">{Intl.get('QuickConnect')}</div>
            <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
              <div>{Intl.get('Internet_DDNS_desc')}</div>
              <CheckBoxField boxLabel={Intl.get('Enable')+' QuickConnect'} cls="black_label"/>
              <Container layout={{ type: 'hbox', pack:'left',align:'left'}}>
                <TextField label={Intl.get('QuickConnect ID')+"："}
                  labelTextAlign="text" labelAlign="left" width="70%"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <Button ui="confirm raised" text={Intl.get('Advanced Setting')} style={{marginRight:'10px'}}/>
              </Container>

            </Container>
          </div>

          <div className="cnt" style={{marginTop:'10px'}}>
            <div className="title">{Intl.get('DDNS')}</div>
            <div style={{margin:'10px 0'}}>{Intl.get('Enable DDNS to enable users to connect to servers with registered host names.')}</div>
            <Container layout={{type:'hbox',pack:'start',align:'left'}} width="100%">
              <Button ui="confirm alt raised" text={Intl.get('Add New')} style={{marginRight:'10px'}}/>
              <Button ui="confirm raised" text={Intl.get('Immediate updates')} style={{marginRight:'10px'}}/>
            </Container>
          </div>

          <Container layout={{type:'hbox',pack:'center',aglin:'bottom'}} margin="10 10 10 10">
            <Button text={Intl.get('Apply')} ui="confirm alt" style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Reset')} ui="decline alt" style={{marginLeft:'10px'}}/>
          </Container>

        </div>
      </div>
    );
  }
}

//IPv6隧道
class IPv6TunnelComp extends Component{
  state = {
  }
  componentDidMount(){
  }
  render () {
    const radioProps = {
        name: 'radios'
    };
    return (
      <div style={{padding:'10px'}}>
          <div>{Intl.get('Starting Tunnel can use IPv6 communication protocol in IPv4 network environment.')}</div>
          <FormPanel layout={{type:'vbox',pack:'center',align:'left'}} padding="0">
            <CheckBoxField boxLabel={Intl.get('Enable')+' Tunnel'} cls="black_label"/>
            <RadioField {...radioProps} boxLabel={Intl.get('Set as default gateway')} value="checked1" checked/>
            <TextField label={Intl.get('Server Address')+"："}
              labelTextAlign="text" labelAlign="left" width="100%"
              value="192.168.1.1"
              cls="black_label auto_width disable_text"
              textAlign="right"/>
            <RadioField {...radioProps} boxLabel={Intl.get('Anonymous online')} value="checked2"/>
            <RadioField {...radioProps} boxLabel={Intl.get('Online with current accounts')} value="checked3"/>
            <TextField label={Intl.get('User Name')+"："}
              labelTextAlign="text" labelAlign="left" width="100%"
              value="192.168.1.1"
              cls="black_label auto_width disable_text"
              textAlign="right"/>
            <TextField label={Intl.get('Password')+"："}
              labelTextAlign="text" labelAlign="left" width="100%"
              value="192.168.1.1"
              cls="black_label auto_width disable_text"
              textAlign="right"/>
          </FormPanel>

          <div style={{marginTop:'20px'}}>
            <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
            <TextField disabled label={Intl.get('Connection state')+"："}
              labelTextAlign="text" labelAlign="left" width="100%"
              value="已断线"
              cls="disable_text"
              textAlign="right"/>
            <TextField disabled label={Intl.get('External address')+"："}
              labelTextAlign="text" labelAlign="left" width="100%"
              value="--"
              cls="disable_text"
              textAlign="right"/>
            </Container>
          </div>
      </div>
    );
  }

}
