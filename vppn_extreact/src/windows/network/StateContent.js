import React,{Component} from 'react';
import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,ToggleField  } from '@extjs/ext-react';
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
        <div className='stateContent'>
            <Container
              layout={{ type: 'hbox', pack: Ext.os.is.Phone ? 'center' : 'left',align:'top'}}
              margin="0 0 10 0"
              defaults={{ margin: "0 10 0 0",border:'1px solid #fff987',borderRadius:'4px' }}
            >
              <Container flex={1} margin="10 10 10 10">
                <SelectField
                  value={1}
                  onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                  options={[
                      { text: 'Option 1', value: 1 },
                      { text: 'Option 2', value: 2 },
                      { text: 'Option 3', value: 3 }
                  ]}
                />
                <div style={{height:'24px',color:'green',fontSize:'20px',margin:'8px 0 0 0'}}>
                  <i className="big check circle outline icon"></i> 已联机
                </div>
                <TextField labelAlign="placeholder" label="IP 地址" value="192.168.1.9" editable={false}/>
                <TextField labelAlign="placeholder" label="网关" value="192.168.1.1" editable={false}/>
                <TextField labelAlign="placeholder" label="DNS Server" value="192.168.1.1" disabled/>
              </Container>
              <Container flex={1} margin="10 10 10 10">
                  <TextField labelAlign="placeholder" value="Wi-Fi 5GHz" disabled/>
                  <div className="small ui toggle checkbox" style={{margin:'8px 0 0 0'}}>
                    <input type="checkbox" name="public"/>
                    <label> on</label>
                  </div>
                  <TextField labelAlign="placeholder" label="名称（SSID）" value="Synology 5G" disabled/>
                  <TextField labelAlign="placeholder" label="安全模式" value="WAP-个人，AES" disabled/>
              </Container>
              <Container flex={1} margin="10 10 10 10">
                <TextField labelAlign="placeholder" value="Wi-Fi 2.4GHz" disabled/>
                <div className="small ui toggle checkbox" style={{margin:'8px 0 0 0'}}>
                  <input type="checkbox" name="public"/>
                  <label> on</label>
                </div>
                <TextField labelAlign="placeholder" label="名称（SSID）" value="Synology" disabled/>
                <TextField labelAlign="placeholder" label="安全模式" value="WAP-个人，AES" disabled/>

              </Container>
            </Container>

            <Container title="vPath" cls="v_path">
                <div className="action">
                  <FormPanel>
                    <FieldSet title={"来自vPort的域名的流量将通过所选的vProxy路由。"}
                      layout={{type:'hbox',pack:'start',align: 'bottom'}}
                      defaults={{labelAlign: "placeholder"}}
                      margin="10 10 10 10"
                      >
                        <TextField placeholder="Enter..." width="200" label="请输入关键字或域名或URL" required flex={1}/>
                        <Container flex={1}>
                          <Button ui="menu raised" text="Add" style={{marginRight:'10px',marginBottom:'2px'}}>
                             <Menu defaults={{ handler: this.onAddTypeChange, group: 'buttonstyle' }}>
                                 <MenuItem text="Add" value="" iconCls={menuItemVal === '' && 'x-font-icon md-icon-check'}/>
                                 <MenuItem text="Import cloud vPath to 10.100.16.24" value="action" iconCls={menuItemVal === 'action' && 'x-font-icon md-icon-check'}/>
                                 <MenuItem text="import from China2World pack" value="decline" iconCls={menuItemVal === 'decline' && 'x-font-icon md-icon-check'}/>
                                 <MenuItem text="import from World2China pack" value="confirm" iconCls={menuItemVal === 'confirm' && 'x-font-icon md-icon-check'}/>
                             </Menu>
                          </Button>
                          <Button text={""} ui={'confirm round alt'} iconCls={'x-fa fa-refresh'}></Button>
                        </Container>
                    </FieldSet>
                  </FormPanel>

                  <Grid store={this.dataStore} grouped width={'98%'} height={'340px'} style={{margin:'0 auto',border:'1px solid #73d8ef'}}>
                      <Column text="域名" width="150" dataIndex="name"/>
                      <Column text="代理" width="85" dataIndex="price"/>
                      <Column text="描述" width="100" dataIndex="priceChange"/>
                  </Grid>
                </div>
            </Container>
        </div>
    )
  }
}
