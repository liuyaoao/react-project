
import React,{Component} from 'react';
import Intl from '../../intl/Intl';

import { TabPanel,Panel, Container, FormPanel,TextField,FieldSet,
  SelectField,Button,Menu,MenuItem,Grid,Column,CheckColumn,CheckBoxField,RadioField } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');
Ext.require('Ext.panel.Collapser');
// Ext.require('layout.center');
// Ext.require('layout.left');

let bootsNodeOptions = [
    { text: '220.168.30.12', value: '220.168.30.12' },
    { text: '220.168.30.1', value: '220.168.30.1' },
    { text: '220.168.30.6', value: '220.168.30.6' }
];
//无线 tab内容块。
export default class WirelessContent extends Component {
    state={
      tabIndex:0,
    }
    dataStore = new Ext.data.Store({
        data: [
          {index:1, name:' Wireless',price:'342.54', priceChange:'mif-wifi-connect icon'},
          {index:2, name:' Internet',price:'342.54', priceChange:'mif-earth icon'}
        ],
        sorters: 'name'
    })
    // onBootsNodeSelectChanged = (field, newValue)=>{  //引导节点有改变。
    //   this.setState({ selectedBootsNode:newValue });
    // }
    // onVProxySelectChanged = (field, newValue) => { //vProxy 路由ip有改变。
    //   this.setState({ selectedVProxyIp:newValue });
    // }

    onActiveItemChange = (sender, value, oldValue,opts)=>{
      let activeItem = this.refs.mainTab.getActiveItem();
      console.log("onActiveItemChange-----",activeItem.title);
      let tabTitleArr = ["Wi-Fi", 'WPS', Intl.get('Guest Network'), "MAC "+Intl.get('Filter')];
      this.setState({
        tabIndex:tabTitleArr.indexOf(activeItem.title)
      });
    }

    render(){
      return (
        <div className='wireless_content' style={{height:'100%'}}>
          <TabPanel cls='tabpanel_pc wireless_tabPanel'
              height={'100%'}
              ref={'mainTab'}
              defaults={{
                  cls: "card",
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
              onActiveItemChange={this.onActiveItemChange}
          >
            <Container title="Wi-Fi" cls="wifi_tab" scrollable={true}>
              <WiFi_Comp/>
            </Container>
            {/* WPS tab块内容*/}
            <Container title="WPS" cls="wps_tab" scrollable={true}>
                <WPS_Comp/>
            </Container>
            {/*访客网络 tab 内容区*/}
            <Container title={Intl.get('Guest Network')} cls="guest_tab" scrollable={true}>
                <GuestNetworkTab />
            </Container>
            {/*MAc 过滤器 tab的内容区*/}
            <Container title={"MAC "+Intl.get('Filter')} cls="MAC_filter_tab" scrollable={true}>
                <MACFilterTab />
            </Container>
          </TabPanel>
          {this.state.tabIndex!=3?
            <div><Container layout={{type:'hbox',pack:'end',align:'bottom'}} height="40px" width="100%" style={{position:'absolute',bottom:'10px',right:'30px'}}>
                <Button text={Intl.get('Apply')} ui={'confirm alt'} style={{marginRight:'10px'}}/>
                <Button text={Intl.get('Reset')} ui={'decline alt'} style={{marginLeft:'10px'}}/>
            </Container></div>:null
          }
        </div>
    )
  }
}

//Wi-Fi tab的内容区
class WiFi_Comp extends Component{
  state={
    nameType:'show',
  }
  onNameMenuChange = (item)=>{
      this.setState({nameType:item.value});
  }
  render (){
    let {nameType} = this.state;
    return (
      <div className="cnt" style={{margin:'10px',width:'96%',marginBottom:'50px'}}>
        <div className="title">5GHz</div>
        <Panel
          margin='10 0 10 0'
          layout="vbox"
        >
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel={Intl.get('Enable wireless broadcast')}/></div>
            </Container>
            <Container layout={{ type: 'hbox', pack:'left',align:'left'}}>
              <TextField label={Intl.get('Name')+" (SSID)："} labelTextAlign="left" labelAlign="left" value="5G" labelWidth="160" width="80%"/>
              <Button ui="menu raised" text={Intl.get('Show')} style={{marginRight:'10px'}}>
                 <Menu defaults={{ handler: this.onNameMenuChange, group: 'buttonstyle' }}>
                     <MenuItem text={Intl.get('Show')} value="show" iconCls={nameType === 'show' && 'x-font-icon md-icon-check'}/>
                     <MenuItem text={Intl.get('Hide')} value="hide" iconCls={nameType === 'hide' && 'x-font-icon md-icon-check'}/>
                 </Menu>
              </Button>
            </Container>
            <SelectField label={Intl.get('Security Level')+':'}
                labelTextAlign="left" labelAlign="left" labelWidth="160" value={1}
                onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                options={[
                    { text: '高 - WAP2-个人', value: 1 },
                    { text: 'Option 1', value: 2 }
                ]} />
            <TextField label={Intl.get('Password')+'：'} labelTextAlign="left" labelAlign="left" labelWidth="160" value="siteview"/>
            <SelectField label={Intl.get('Wireless Mode')+'：'}
                labelTextAlign="left" labelAlign="left" labelWidth="160" value={1}
                onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                options={[
                    { text: 'an+ac', value: 1 },
                    { text: 'Option 1', value: 2 }
                ]} />
            <div style={{color:'#07439e'}}>{Intl.get('Advanced Options')}<span className="x-fa fa-chevron-down"></span></div>
        </Panel>

        <div className="title">2.4GHz</div>
        <Panel
          margin='10 0 10 0'
          layout="vbox"
        >
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel={Intl.get('Enable wireless broadcast')}/></div>
            </Container>
            <Container layout={{ type: 'hbox', pack:'left',align:'left'}}>
              <TextField label={Intl.get('Name')+" (SSID)："} labelTextAlign="left" labelAlign="left" labelWidth="160" value="" width="80%"/>
              <Button ui="menu raised" text={Intl.get('Show')} style={{marginRight:'10px'}}>
                 <Menu defaults={{ handler: this.onNameMenuChange, group: 'buttonstyle' }}>
                     <MenuItem text={Intl.get('Show')} value="show" iconCls={nameType === 'show' && 'x-font-icon md-icon-check'}/>
                     <MenuItem text={Intl.get('Hide')} value="hide" iconCls={nameType === 'hide' && 'x-font-icon md-icon-check'}/>
                 </Menu>
              </Button>
            </Container>
            <SelectField label={Intl.get('Security Level')+"："}
                labelTextAlign="left" labelAlign="left" labelWidth="160" value={1}
                onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                options={[
                    { text: '高 - WAP2-个人', value: 1 },
                    { text: 'Option 1', value: 2 }
                ]}
            />
            <TextField label={Intl.get('Password')+"："} labelTextAlign="left" labelAlign="left" labelWidth="160" value="siteview"/>
            <SelectField label={Intl.get('Wireless Mode')+"："}
                labelTextAlign="left" labelAlign="left" labelWidth="160" value={1}
                onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                options={[
                    { text: 'b+g+n', value: 1 },
                    { text: 'Option 1', value: 2 }
                ]}
            />
            <div style={{color:'#07439e'}}>{Intl.get('Advanced Options')}<span className="x-fa fa-chevron-down"></span></div>
        </Panel>
      </div>
    );
  }
}

//WPS tab 的内容去
class WPS_Comp extends Component{
  state={}
  render () {
    return (
      <div className="" style={{marginBottom:'50px'}}>
        <div style={{margin:'10px'}}>
          <div>{Intl.get('wps_tab_desc')}</div>
          <div style={{'float':'left'}}>
            <CheckBoxField boxLabel={Intl.get('Enable')+" WPS"} cls="wps_tab_checkbox"/>
          </div>
          <Container layout={{ type: 'hbox', pack:'left',align:'left'}}>
            <div>{Intl.get('Connection State')}：<span>{Intl.get('Ready')}</span></div>
            <div style={{marginLeft:'20px'}}>{Intl.get('Connection Type')}：<span>2.4GHz</span></div>
          </Container>
        </div>
        <Container layout={{type:'vbox',pack:'center',align:'left'}}>
          <Panel
            title={Intl.get('By Push Button')}
            width={'100%'}
            bodyPadding={20}
            collapsible={{
                direction: 'top',
                dynamic: true
            }}
            bodyPadding={10}
          >
          <Container layout={{ type: 'hbox', pack:'left',align:'left'}}>
            <Container flex={1}>
              <p>{Intl.get('Press the WPS button on Router.')}</p>
              <div style={{padding:'20px'}}><img src='images/network/pushBtn_1.png'/></div>
            </Container>
            <Container flex={1}>
              <p>{Intl.get('Press the WPS button on the wireless device.')}</p>
              <div style={{padding:'20px'}}><img src='images/network/pushBtn_2.png'/></div>
            </Container>
            <Container flex={1}>
              <p>{Intl.get('These devices have been connected.')}</p>
              <div style={{padding:'20px'}}><img src='images/network/pushBtn_3.png'/></div>
            </Container>
          </Container>
          </Panel>
          <Panel
            title={Intl.get('Device PIN code')}
            width={'100%'}
            bodyPadding={20}
            collapsible={{
                direction: 'top',
                dynamic: true
            }}
            bodyPadding={10}
          >
            <Container>
              设备PIN码 内容区
            </Container>
          </Panel>
        </Container>
      </div>
    );
  }
}

//访客网络 tab 的内容区 子组件
class GuestNetworkTab extends Component{
  state={
  }
  render(){
    return (
      <div className="cnt" style={{margin:'10px',width:'96%',marginBottom:'50px'}}>
        <div className="title">5GHz</div>
        <Panel
          margin='10 10 10 10'
          layout="vbox"
        >
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel={Intl.get('Enable')+' '+Intl.get('Guest Network')}/></div>
            </Container>
            <TextField label={Intl.get('Name')+"(SSID)："} labelTextAlign="left" labelAlign="left" value="RouterGuest" />
            <SelectField label={Intl.get('Security Level')+"："}
                labelTextAlign="left" labelAlign="left" value={1}
                onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                options={[
                    { text: '高 - WAP2-个人', value: 1 },
                    { text: 'Option 1', value: 2 }
                ]}
            />
            <TextField label={Intl.get('Password')+"："} labelTextAlign="left" labelAlign="left" value="siteview"/>
            <SelectField label={Intl.get('Effective')+"："}
                labelTextAlign="left" labelAlign="left" value={1}
                onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                options={[
                    { text: '1'+Intl.get('Week'), value: 1 },
                    { text: '2'+Intl.get('Week'), value: 2 },
                    { text: Intl.get('Permanent validity'), value: 3 },
                ]}
            />
            <div style={{'clear':'both'}}>
              <div style={{width:'100px','float':'left',textAlign:'left','lineHeight':'46px'}}>{"AP "+Intl.get('Insulate')+"："}</div>
              <span style={{'float':'left'}}>
                <FormPanel layout={{type: 'hbox', align: 'left'}}>
                  <RadioField name="ap_5GHz" boxLabel={Intl.get('Enabled')} value="checked" checked style={{marginRight:'10px'}}/>
                  <RadioField name="ap_5GHz" boxLabel={Intl.get('Deactivated')} value="unchecked"/>
                </FormPanel>
              </span>
            </div>
        </Panel>

        <div className="title">2.4GHz</div>
        <Panel
          margin='10 0 10 0'
          layout="vbox"
        >
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel={Intl.get('Enable wireless broadcast')}/></div>
            </Container>
            <TextField label={Intl.get('Name')+"(SSID)："} labelTextAlign="left" labelAlign="left" value="RouterGuest_2.4GHz" />
            <SelectField label={Intl.get('Security Level')+"："}
                labelTextAlign="left" labelAlign="left" value={1}
                onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                options={[
                    { text: '高 - WAP2-个人', value: 1 },
                    { text: 'Option 1', value: 2 }
                ]}
            />
            <TextField label={Intl.get('Password')+"："} labelTextAlign="left" labelAlign="left" value="siteview"/>
            <SelectField label={Intl.get('Effective')+"："}
                labelTextAlign="left" labelAlign="left" value={1}
                onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                options={[
                  { text: '1'+Intl.get('Week'), value: 1 },
                  { text: '2'+Intl.get('Week'), value: 2 },
                  { text: Intl.get('Permanent validity'), value: 3 },
                ]}
            />
            <div style={{'clear':'both'}}>
              <div style={{width:'100px','float':'left',textAlign:'left','lineHeight':'46px'}}>{"AP "+Intl.get('Insulate')+"："}</div>
              <span style={{'float':'left'}}>
                <FormPanel layout={{type: 'hbox', align: 'left'}}>
                  <RadioField name="ap_24GHz" boxLabel={Intl.get('Enabled')} value="checked" checked style={{marginRight:'10px'}}/>
                  <RadioField name="ap_24GHz" boxLabel={Intl.get('Deactivated')} value="unchecked"/>
                </FormPanel>
              </span>
            </div>
        </Panel>

        <div className="title">{Intl.get('Local network access')}</div>
        <Panel
          margin='10 0 10 0'
          layout="vbox"
        >
        <Container flex={1}>
          <div style={{'float':'left'}}><CheckBoxField boxLabel={Intl.get('Allow local network access to visitor network')}/></div>
        </Container>
        </Panel>

      </div>
    );
  }
}

//MAC过滤器 tab 的内容区 子组件
class MACFilterTab extends Component{
  state={
    dataStore:[
      {index:1, name:' Wireless',MACAdredss:'00:11:32:53:bd:50', description:'mif-wifi-connect icon'},
      {index:2, name:' Internet',MACAdredss:'00:11:32:53:bd:50', description:'mif-earth icon'}
    ],
  }
  render(){
    return (
      <div className="cnt" style={{margin:'10px',width:'96%',position:'relative'}}>
        <Container
            layout={{ type: 'hbox', pack: 'left'}}
            margin="10 0 10 0"
            defaults={{ margin: "0 10 10 0" }}>
          <Button ui="confirm alt raised" text={Intl.get('Add')}/>
          <Button ui="raised" text={Intl.get('Edit')}/>
          <Button ui="raised" text={Intl.get('Delete')}/>
          <Button ui="raised" text={Intl.get('Save')}/>
        </Container>
        <Grid store={this.state.dataStore} grouped width={'99%'} height={'320px'} style={{margin:'0 auto',border:'1px solid #73d8ef'}}>
            <CheckColumn text={Intl.get('Apply')} width="80" dataIndex="name" groupable={false} sortable={false}/>
            <Column text={Intl.get('Description')} width="120" dataIndex="description"/>
            <Column text={"MAC"+Intl.get('Address')} width="100" dataIndex="MACAdredss"/>
        </Grid>
        <Container layout={{type:'hbox',pack:'start',align:'bottom'}} height="40px" width="100%" style={{position:'absolute',bottom:'-50px',left:'10px'}}>
            <div style={{height:'45px',lineHeight:'45px'}}>{Intl.get('Access strategy')+': '}</div>
            <FormPanel layout={{type: 'hbox', align: 'left'}}>
              <RadioField name="accessStrategy" boxLabel={Intl.get('Refuse')} value="checked" checked style={{marginRight:'10px'}}/>
              <RadioField name="accessStrategy" boxLabel={Intl.get('Allow')} value="unchecked"/>
            </FormPanel>
        </Container>
      </div>
    );
  }
}
