import React,{Component} from 'react';
import Intl from '../../intl/Intl';

import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,ToggleField,Panel,CheckBoxField   } from '@extjs/ext-react';
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
              <Container title="工作模式" cls="state_Internet" scrollable={true}>
                <div style={{margin:'20px'}}>工作模式
                </div>
              </Container>
              <Container title="更新和还原" cls="state_equipList" scrollable={true}>
                  <div className="">
                    更新和还原
                  </div>
              </Container>
              <Container title="SRM设置" cls="state_CPU" scrollable={true}>
                  <div className="">
                    SRM设置
                  </div>
              </Container>
              <Container title="服务" cls="state_memory" scrollable={true}>
                  <ServiceTab />
              </Container>

              <Container title="区域选项" cls="state_memory" scrollable={true}>
                  <div className="">
                    区域选项
                  </div>
              </Container>

              <Container title="LED" cls="state_memory" scrollable={true}>
                  <div className="">
                    LED
                  </div>
              </Container>

              <Container title="使用状况" cls="state_memory" scrollable={true}>
                  <div className="">
                    使用状况
                  </div>
              </Container>

            </TabPanel>
        </div>
    )
  }
}

//服务tab页内容
class ServiceTab extends Component{
  state={

  }
  render(){
    return (
      <div className="cnt" style={{margin:'20px'}}>
        <div className="title">终端机</div>
        <Panel
          margin='10 0 10 0'
          layout="vbox"
        >
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel="启用SSH功能"/></div>
            </Container>
            <TextField label="端口：" labelTextAlign="left" labelAlign="left" value="22" />
        </Panel>

        <div className="title">SNMP</div>
        <Panel
          margin='10 0 10 0'
          layout="vbox"
        >
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel="启用SNMP功能（请参阅Synology MIB Guide以获得更多信息。）"/></div>
            </Container>
            <TextField label="Device Name：" labelTextAlign="left" labelAlign="left" value="" />
            <TextField label="Device Location：" labelTextAlign="left" labelAlign="left" value="" />
            <TextField label="联系方式：" labelTextAlign="left" labelAlign="left" value="" />
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel="SNMPv1、SNMPv2c服务"/></div>
            </Container>
            <TextField label="社群：" labelTextAlign="left" labelAlign="left" value="" />
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel="SNMPv3服务"/></div>
            </Container>
            <TextField label="用户账号：" labelTextAlign="left" labelAlign="left" value="" />
            <TextField label="密码：" labelTextAlign="left" labelAlign="left" value="" />

        </Panel>

      </div>
    );
  }
}
