import React,{Component} from 'react';
import Intl from '../../intl/Intl';

import { TabPanel, Container, FormPanel,TextField,Label,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,ContainerField,
  Column,ToggleField,Panel,CheckBoxField,TextAreaField    } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class ManagementContent extends Component {
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
        <div className='management_content' style={{height:'100%'}}>
          <TabPanel cls='management_tabPanel'
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
              <Container title={Intl.get('Work Mode')} cls="state_Internet" scrollable={true}>
                <WorkModeComp/>
              </Container>
              <Container title={Intl.get('Update And Reset')} cls="state_equipList" scrollable={true}>
                  <UpdateAndResetComp/>
              </Container>
              <Container title={"SRM "+Intl.get('Setting')} cls="state_CPU" scrollable={true}>
                  <SRMSettingComp/>
              </Container>
              <Container title={Intl.get('Service')} cls="state_memory" scrollable={true}>
                  <ServiceTab />
              </Container>

              <Container title={Intl.get('Region Options')} cls="state_memory" scrollable={true}>
                  <RegionOptionsComp/>
              </Container>

              <Container title="LED" cls="state_memory" scrollable={true}>
                  <div className="">
                    LED
                  </div>
              </Container>

              <Container title={Intl.get('Using State')} cls="state_memory" scrollable={true}>
                  <div className="">
                    使用状况
                  </div>
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

//工作模式tab页内容
class WorkModeComp extends Component{
  state = {
    workMode:'wirelessRouter',
  }
  componentDidMount(){
  }
  onChoseWorkMode = (workMode)=>{
    this.setState({workMode});
  }
  render () {
    let {workMode} = this.state;

    return (
        <div style={{padding:'10px'}}>
          <div>{Intl.get('workMode_desc')}</div>

          <div className={workMode=="wirelessRouter"?"setting_zone active":"setting_zone"} onClick={()=>this.onChoseWorkMode("wirelessRouter")}>
            <div>{Intl.get('Wireless Router')}</div>
            <Panel layout={{type:'hbox',pack:'space-between',align:'stretch'}} height="65px" padding="10 10 10 10">
                <Container><span className="mif-earth icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-feed icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-laptop icon fg-blue mif-3x"></span></Container>
            </Panel>
          </div>
          <div className={workMode=="wirelessAcPoint"?"setting_zone active":"setting_zone"} onClick={()=>this.onChoseWorkMode("wirelessAcPoint")}>
            <div>{Intl.get('Wireless access point')}</div>
            <Panel layout={{type:'hbox',pack:'space-between',align:'stretch'}} height="65px" padding="10 10 10 10">
                <Container><span className="mif-earth icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-feed icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-feed icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-laptop icon fg-blue mif-3x"></span></Container>
            </Panel>
          </div>
          <div className={workMode=="wirelessClient"?"setting_zone active":"setting_zone"} onClick={()=>this.onChoseWorkMode("wirelessClient")}>
            <div>{Intl.get('Wireless client')}</div>
            <Panel layout={{type:'hbox',pack:'space-between',align:'stretch'}} height="65px" padding="10 10 10 10">
                <Container><span className="mif-earth icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-feed icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-feed icon fg-blue mif-3x"></span></Container>
                <Container><span className="mif-laptop icon fg-blue mif-3x"></span></Container>
            </Panel>
          </div>

        </div>
    );
  }
}

//更新和还原
class UpdateAndResetComp extends Component{
  state = {
  }
  componentDidMount(){
  }
  render () {
    return (
        <div style={{padding:'10px'}}>
          <div className="cnt">
            <div className="title">{Intl.get('System Update')}</div>
            <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
              <TextField label={Intl.get('Product model')+"："}
                labelTextAlign="text" labelAlign="left" labelWidth="160" width="98%"
                value="RT1900ac"/>
              <TextField label={"SRM "+Intl.get('Version')+"："}
                labelTextAlign="text" labelAlign="left" labelWidth="160" width="98%"
                value="SRM 1.0.2-60022 Update 1"/>
              <TextAreaField  label={Intl.get('State')+"："}
                labelTextAlign="text" labelAlign="left" labelWidth="160" height="60px" width="98%"
                value={Intl.get('Version can be downloaded',null,{version:'SRM 1.1.5-6542'})}
                maxRows={2}/>
              <Container layout={{type:'hbox',pack:'start',aglin:'left'}} margin="10 0 10 0">
                <Button flex={1} text={Intl.get('Download')} ui="decline alt" style={{marginLeft:'10px'}}/>
              </Container>
            </Container>
            <Container layout={{type:'hbox',pack:'start',aglin:'bottom'}} margin="10 0 10 0">
              <Button text={Intl.get('Manual Update')+' SRM'} ui="confirm alt" style={{marginRight:'10px'}}/>
              <Button text={Intl.get('Update Setting')} ui="decline alt"/>
            </Container>
          </div>

          <div className="cnt">
            <div className="title">{Intl.get('Configuring backup and restore')}</div>
            <Container layout={{type:'vbox',pack:'start',align:'left'}}>
              <div>{Intl.get('Backup router configuration and save configuration file(.dss) to your computer.')}</div>
              <Container layout={{type:'hbox',pack:'start',aglin:'left'}} margin="10 0 10 0">
                <Button text={Intl.get('Backup Configuration')} ui="confirm alt"/>
              </Container>
              <div>{Intl.get('Restore the backup configuration or restore the router to factory settings.')}</div>
              <Container layout={{type:'hbox',pack:'start',aglin:'left'}} margin="10 0 10 0">
                <Button text={Intl.get('Restore Configuration')} ui="confirm alt" style={{marginRight:'10px'}}/>
                <Button text={Intl.get('Restore Factory Settings')} ui="decline alt"/>
              </Container>
            </Container>
          </div>

        </div>
    );
  }

}

//SRM设置
class SRMSettingComp extends Component{
  state = {
  }
  componentDidMount(){
  }
  render () {
    return (
        <div style={{padding:'10px'}}>
          <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
            <TextField label={Intl.get('System Name')+"："}
              labelTextAlign="text" labelAlign="left" labelWidth="160" width="98%"
              value="192.168.1.1"/>
            <FieldSet title={Intl.get('Default Port Number')} width="100%" margin="10 0 0 0">
              <Container style={{width:'90%',marginLeft:'20px'}}>
                <TextField label={Intl.get('HTTP')+"："}
                  labelTextAlign="text" labelAlign="left" labelWidth="160"
                  value="192.168.1.1"/>
                <TextField label={Intl.get('HTTPS')+"："}
                  labelTextAlign="text" labelAlign="left" labelWidth="160"
                  value="192.168.1.1"/>
              </Container>
            </FieldSet>
            <CheckBoxField
              boxLabel={Intl.get('Redirect the HTTP connection automatically to HTTPS')}
              cls="black_label"/>
            <div>{Intl.get('You can import certificates on the certificate page.')}</div>
            <CheckBoxField boxLabel={Intl.get('Enable')+' HSTS'} cls="black_label fl_lf"/>
            <div style={{marginLeft:'20px'}}>{Intl.get('Enabling HSTS will force browsers to use secure connections.')}</div>
            <CheckBoxField boxLabel={Intl.get('Enable Windows network discovery')} cls="black_label fl_lf"/>
            <div style={{marginLeft:'20px'}}>{Intl.get('After this option is enabled,Windows network discovery will be able to search the Router.')}</div>
            <CheckBoxField boxLabel={Intl.get('Allow external access to SRM')} cls="black_label fl_lf"/>
            <div style={{marginLeft:'20px'}}>{Intl.get('Starting this option allows external access to SRM through HTTP/HTTPS ports (such as: 8000 and 8001).')}</div>
          </Container>

        </div>
    );
  }
}


//服务tab页内容
class ServiceTab extends Component{
  state={
  }
  render(){
    return (
      <div className="cnt" style={{padding:'10px'}}>
        <div className="title">{Intl.get('Terminal')}</div>
        <Panel
          margin='10 0 10 0'
          layout="vbox"
        >
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel={Intl.get('Enable SSH Functionality')}/></div>
            </Container>
            <TextField label={Intl.get('Port')+"："} labelTextAlign="left" labelAlign="left" value="22" labelWidth="160"/>
        </Panel>

        <div className="title">SNMP</div>
        <Panel
          margin='10 0 10 0'
          layout="vbox"
        >
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel={Intl.get('Enable SNMP Service')}/></div>
            </Container>
            <TextField label={Intl.get('Device Name')+"："} labelTextAlign="left" labelAlign="left" value="" labelWidth="160"/>
            <TextField label={Intl.get('Device Location')+"："} labelTextAlign="left" labelAlign="left" value="" labelWidth="160"/>
            <TextField label={Intl.get('Contact Way')+"："} labelTextAlign="left" labelAlign="left" value="" labelWidth="160"/>
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel={"SNMPv1、SNMPv2c "+Intl.get('Service')}/></div>
            </Container>
            <TextField label={Intl.get('Community')+"："} labelTextAlign="left" labelAlign="left" value="" labelWidth="160"/>
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel={"SNMPv3 "+Intl.get('Service')}/></div>
            </Container>
            <TextField label={Intl.get('User Account')+"："} labelTextAlign="left" labelAlign="left" value="" labelWidth="160"/>
            <TextField label={Intl.get('Password')+"："} labelTextAlign="left" labelAlign="left" value="" labelWidth="160"/>

        </Panel>

      </div>
    );
  }
}

//区域选项tab页内容
class RegionOptionsComp extends Component{
  state = {
    timeZone:'(GMT+08:00)Beijing',
    serverAddr:'www.dragon.com',
  }
  componentDidMount(){
  }
  onTimeZoneChange = (item)=>{
    this.setState({timeZone:item.value});
  }
  onServerAddrChange = (item)=>{
    this.setState({serverAddr:item.value});
  }
  render () {
    let {timeZone,serverAddr} = this.state;
    return (
        <div style={{padding:'10px'}}>
          <div className="cnt">
            <div className="title">{Intl.get('Present Time')}</div>
            <FieldSet title="Fri Nov 18:21:35 2017" >
              <ContainerField label={Intl.get('Time Zone')+':'}
                layout={'hbox'} labelWidth="160"
                labelAlign="left"
                labelTextAlign="left">
                <Button ui="menu raised" text={timeZone} style={{width:'98%','float':'left',margin:'5px'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onTimeZoneChange, group: 'buttonstyle' }}>
                       <MenuItem text="225.225.225.0" value="225.225.225.0" iconCls={timeZone === '225.225.225.0' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text="225.225.225.0" value="225.225.225.3" iconCls={timeZone === '225.225.225.3' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
              <ContainerField label={Intl.get('Server Address')+':'}
                layout={'hbox'} labelWidth="160"
                labelAlign="left"
                labelTextAlign="left">
                <Button ui="menu raised" text={serverAddr} style={{width:'98%','float':'left',margin:'5px'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onServerAddrChange, group: 'buttonstyle' }}>
                       <MenuItem text="225.225.225.0" value="225.225.225.0" iconCls={serverAddr === '225.225.225.0' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text="225.225.225.0" value="225.225.225.3" iconCls={serverAddr === '225.225.225.3' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
              <Button ui="confirm raised" text={Intl.get('Immediate updates')}/>
            </FieldSet>
          </div>
          {/* 国家*/}
          <div className="cnt">
            <div className="title">{Intl.get('Country')}</div>
            <div >{Intl.get('choose_country_desc')}</div>
            <div style={{marginTop:'10px'}}><Label html={Intl.get('choose_country_hint')}/></div>
            <FieldSet>
              <ContainerField label={Intl.get('Country')+':'}
                layout={'hbox'} labelWidth="160"
                labelAlign="left"
                labelTextAlign="left">
                <Button ui="menu raised" text={Intl.get('China')} style={{width:'98%',margin:'5px'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onServerAddrChange, group: 'buttonstyle' }}>
                       <MenuItem text={Intl.get('China')} value="225.225.225.0" iconCls={serverAddr === '225.225.225.0' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text={Intl.get('Others')} value="225.225.225.3" iconCls={serverAddr === '225.225.225.3' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
            </FieldSet>
          </div>
          {/* 界面显示语言*/}
          <div className="cnt" style={{padding:'10px'}}>
            <div className="title">{Intl.get('Interface display language')}</div>
            <div >{Intl.get('choose_language_desc')}</div>
            <FieldSet>
              <ContainerField label={Intl.get('Interface display language')+':'}
                layout={'hbox'} labelWidth="160"
                labelAlign="left"
                labelTextAlign="left">
                <Button ui="menu raised" text={Intl.get('Chinese')} style={{width:'98%',margin:'5px'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onServerAddrChange, group: 'buttonstyle' }}>
                       <MenuItem text={Intl.get('Chinese')} value="225.225.225.0" iconCls={serverAddr === '225.225.225.0' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text={Intl.get('English')} value="225.225.225.3" iconCls={serverAddr === '225.225.225.3' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
            </FieldSet>
          </div>
        </div>
    );
  }
}

//LED设置tab页内容
class LED_Comp extends Component{
  state = {
  }
  componentDidMount(){
  }
  render () {
    return (
      <div style={{padding:'10px'}}>
          <div>LED的内容区</div>

      </div>
    );
  }
}

//使用状态tab页内容
class UsingStateComp extends Component{
  state = {
  }
  componentDidMount(){
  }
  render () {
    return (
      <div style={{padding:'10px'}}>
          <div>使用状态内容区</div>

      </div>
    );
  }
}
