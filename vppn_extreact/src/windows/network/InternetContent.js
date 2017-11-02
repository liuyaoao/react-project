import React,{Component} from 'react';
import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,Column,RendererCell  } from '@extjs/ext-react';
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
        <TabPanel cls='vportContent'
            flex={1}
            shadow
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
            <Container title="Remote Router" cls="remoter_router">
              <div style={{margin:'20px'}}>
                <div>
                  <Container
                    layout={{ type: 'hbox', pack: Ext.os.is.Phone ? 'center' : 'left',align:'center'}}
                    margin="0 0 10 0"
                    defaults={{ margin: "0 10 0 0" }}
                  >
                    <span>引导节点：</span>
                    <SelectField
                       width="200"
                       name={'bootsNode'}
                       displayField={'value'}
                       value={selectedBootsNode}
                       onChange={this.onBootsNodeSelectChanged}
                       options={bootsNodeOptions}
                     />
                    <Button text={"关闭"} ui={'decline alt'}></Button>
                    <Button text={""} ui={'confirm round alt'} iconCls={'x-fa fa-refresh'} alt="刷新"></Button>
                  </Container>
                  <Grid store={this.dataStore} grouped width={'99%'} height={'320px'} style={{margin:'0 auto',border:'1px solid #73d8ef'}}>
                      <Column text="状态" width="100" dataIndex="name"/>
                      <Column text="远程虚拟IP" width="120" dataIndex="price"/>
                      <Column text="远程子网" width="100" dataIndex="priceChange"/>
                      <Column text="链路状态" width="100" dataIndex="priceChange"/>
                      <Column text="延时" width="100" dataIndex="priceChange"/>
                      <Column text="描述" width="100" dataIndex="priceChange"/>
                  </Grid>
                  <Container margin="10 0 10 0"
                    layout={{ type: 'hbox', pack: Ext.os.is.Phone ? 'center' : 'left',align:'bottom'}}
                  >
                    <TextField width="300"
                      labelWidth="60"
                      labelAlign="left"
                      labelTextAlign='center'
                      label="虚拟IP:"
                    />
                    <Button text={"添加"} ui={'action raised'} style={{marginLeft:'10px'}}></Button>
                  </Container>
                </div>
              </div>
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
        </TabPanel>
    )
  }
}
