import React,{Component} from 'react';
import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,ToggleField   } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

let bootsNodeOptions = [
    { text: '220.168.30.12', value: '220.168.30.12' },
    { text: '220.168.30.1', value: '220.168.30.1' },
    { text: '220.168.30.6', value: '220.168.30.6' }
];

export default class StateContent extends Component {
    state={
      wifi5GSwitch:true,
      wifi2_4GSwitch:true,
      menuItemVal:'',
      selectedBootsNode:'220.168.30.12',
      selectedVProxyIp:'', //选中的vProxy IP.
    }
    onAddTypeChange = (item)=>{
      this.setState({menuItemVal:item.value});
    }
    dataStore = new Ext.data.Store({
        data: [
          {index:1, name:' Wireless',price:'342.54', priceChange:'mif-wifi-connect icon'},
          {index:2, name:' Internet',price:'342.54', priceChange:'mif-earth icon'}
        ],
        sorters: 'name'
    })
    onBootsNodeSelectChanged = (field, newValue)=>{  //引导节点有改变。
      this.setState({ selectedBootsNode:newValue });
      Ext.toast(`You selected the item with value ${newValue}`);
    }
    onVProxySelectChanged = (field, newValue) => { //vProxy 路由ip有改变。
      this.setState({ selectedVProxyIp:newValue });
      Ext.toast(`You selected the item with value ${newValue}`);
    }
    onClickWifi5GSwitch = (e)=>{
      console.log("点击了wifi 5GHz开关：",e);
      this.setState( {wifi5GSwitch:!this.state.wifi5GSwitch} );
    }
    render(){
      let {menuItemVal,selectedBootsNode} = this.state;

      return (
        <div className='stateContent' style={{height:'100%'}}>
            <Container
              layout={{ type: 'hbox', pack: Ext.os.is.Phone ? 'center' : 'left',align:'top'}}
              margin="0 0 10 0"
              height="auto"
              defaults={{ margin: "0 10 0 0",border:'1px solid #fff987',borderRadius:'4px' }}
            >
              <Container flex={1} margin="10 10 10 10">
                <SelectField cls="state_title"
                  value={1}
                  onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                  options={[
                      { text: 'Internet连接-IPv4', value: 1 },
                      { text: 'Internet连接-IPv6', value: 2 },
                      { text: 'Option 3', value: 3 }
                  ]}
                />
                <div style={{height:'24px',color:'green',fontSize:'20px',margin:'8px 0 0 0'}}>
                  <i className="big check circle outline icon"></i> 已联机
                </div>
                <TextField ui="disabled-ui" label="IP 地址" value="192.168.1.9" disabled/>
                <TextField ui="disabled-ui" label="网关" value="192.168.1.1" disabled/>
                <TextField ui="disabled-ui" label="DNS Server" value="192.168.1.1" disabled/>
              </Container>
              <Container flex={1} margin="10 10 10 10">
                  <TextField cls="state_title" value="Wi-Fi 5GHz" disabled/>
                  <div className="small ui toggle checkbox" style={{margin:'8px 0 0 0'}}>
                    <input type="checkbox" name="public"/>
                    <label> on</label>
                  </div>
                  <TextField label="名称（SSID）" value="Synology 5G" disabled/>
                  <TextField label="安全模式" value="WAP-个人，AES" disabled/>
                  <TextField label="MAC地址" value="00:11:32:53:bd:50" disabled/>
              </Container>
              <Container flex={1} margin="10 10 10 10">
                <TextField cls="state_title" value="Wi-Fi 2.4GHz" disabled/>
                <div className="small ui toggle checkbox" style={{margin:'8px 0 0 0'}}>
                  <input type="checkbox" name="public"/>
                  <label> on</label>
                </div>
                <TextField label="名称（SSID）" value="Synology" disabled/>
                <TextField label="安全模式" value="WAP-个人，AES" disabled/>
                <TextField label="MAC地址" value="00:11:32:53:bd:50" disabled/>
              </Container>
            </Container>

            <TabPanel cls='state_tabPanel'
                flex={1}
                height={'200px'}
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
              <Container title="互联网" cls="state_Internet">
                <div style={{margin:'20px'}}>

                </div>
              </Container>
              <Container title="设备列表" cls="state_equipList">
                  <div className="">
                    设备列表块
                  </div>
              </Container>
              <Container title="CPU" cls="state_CPU">
                  <div className="">
                    CPU块
                  </div>
              </Container>
              <Container title="内存" cls="state_memory">
                  <div className="">
                    内存块
                  </div>
              </Container>
            </TabPanel>
        </div>
    )
  }
}
