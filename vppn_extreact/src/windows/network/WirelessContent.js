import React,{Component} from 'react';
import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,Column,CheckBoxField  } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

let bootsNodeOptions = [
    { text: '220.168.30.12', value: '220.168.30.12' },
    { text: '220.168.30.1', value: '220.168.30.1' },
    { text: '220.168.30.6', value: '220.168.30.6' }
];
//无线 tab内容块。
export default class WirelessContent extends Component {
    state={
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
    render(){
      let {menuItemVal,selectedBootsNode} = this.state;

      return (
        <TabPanel cls='state_tabPanel'
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
          <Container title="Wi-Fi" cls="state_Internet">
            <div style={{margin:'20px'}}>
            <div>5GHz</div>
            <div style={{"float":"left"}}>
              <CheckBoxField boxLabel="启用无线广播"/>
            </div>
            </div>
          </Container>
          <Container title="WPS" cls="state_equipList">
              <div className="">
                WPS块
              </div>
          </Container>
          <Container title="访客网络" cls="state_CPU">
              <div className="">
                访客网络块
              </div>
          </Container>
          <Container title="MAC过滤器" cls="state_memory">
              <div className="">
                MAC过滤器块
              </div>
          </Container>
        </TabPanel>
    )
  }
}
