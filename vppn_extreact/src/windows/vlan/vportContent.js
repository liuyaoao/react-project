import React,{Component} from 'react';
import Intl from '../../intl/Intl';
import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,Column,RendererCell  } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

let bootsNodeOptions = [
    { text: '220.168.30.12', value: '220.168.30.12' },
    { text: '220.168.30.1', value: '220.168.30.1' },
    { text: '220.168.30.6', value: '220.168.30.6' }
];

export default class VportContent extends Component {
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
      let {contentId,myVirtualIp} = this.props;
      let idNum = contentId.split('_')[0];

      let vProxyIpOptions = this.props.vProxyIpArr.map((val)=>{
        return {text:val,value:val};
      });
      return (
        <div className="" style={{height:'100%'}}>
        <TabPanel cls='vportContent'
            height={'100%'}
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
        >
            <Container title={Intl.get('Remote Router','Remote Router')} cls="remoter_router" scrollable={true}>
              <div style={{margin:'20px'}}>
                <div>
                  <Container
                    layout={{ type: 'hbox', pack: Ext.os.is.Phone ? 'center' : 'left',align:'center'}}
                    margin="0 0 10 0"
                    defaults={{ margin: "0 10 0 0" }}
                  >
                    <span className={myVirtualIp?'myVirtualIp':'myVirtualIp no_connected'}>{myVirtualIp?myVirtualIp:'Connect Error!'}</span>
                    <span>{Intl.get("Boot Nodes")}：</span>
                    <SelectField
                       width="200"
                       name={'bootsNode'}
                       displayField={'value'}
                       value={selectedBootsNode}
                       onChange={this.onBootsNodeSelectChanged}
                       options={bootsNodeOptions}
                     />
                    <Button text={Intl.get("close")} ui={'decline alt'}></Button>
                    <Button text={""} ui={'confirm round alt'} iconCls={'x-fa fa-refresh'} alt={Intl.get("refresh")}></Button>
                  </Container>
                  <Container>
                    <Grid store={this.dataStore} grouped width={'99%'} height={'320px'} style={{margin:'0 auto',border:'1px solid #73d8ef'}}>
                        <Column text={Intl.get('state')} width="100" dataIndex="name"/>
                        <Column text={Intl.get('Remote Virtual IP')} width="120" dataIndex="price"/>
                        <Column text={Intl.get('Remote Subnet')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('Link State')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('delay')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('description')} width="100" dataIndex="priceChange"/>
                    </Grid>
                  </Container>
                  <Container margin="10 0 10 0"
                    layout={{ type: 'hbox', pack: Ext.os.is.Phone ? 'center' : 'left',align:'bottom'}}
                  >
                    <TextField width="300"
                      labelWidth="60"
                      labelAlign="left"
                      labelTextAlign='center'
                      label={Intl.get("Virtual")+" IP:"}
                    />
                    <Button text={Intl.get("Add New")} ui={'action raised'} style={{marginLeft:'10px'}}></Button>
                  </Container>
                </div>
              </div>
            </Container>

            <Container title={Intl.get('vPath')} cls="v_path" scrollable={true}>
                <div className="action">
                  <FormPanel>
                    <FieldSet title={ Intl.get('vPath_title',null,{idNum}) }
                      layout={{type:'hbox',pack:'start',align: 'bottom'}}
                      defaults={{labelAlign: "placeholder"}}
                      margin="10 10 10 10"
                      >
                        <TextField placeholder="Enter..." width="200" label={Intl.get('Please input keywords or domain or URL')+'：'} required flex={1}/>
                        <SelectField
                            label="vProxy"
                            flex={1}
                            width="200"
                            value={this.state.selectedVProxyIp}
                            onChange={this.onVProxySelectChanged}
                            options={vProxyIpOptions}
                        />
                        <Container flex={1}>
                          <Button ui="menu raised" text={Intl.get("Add")} style={{marginRight:'10px',marginBottom:'2px'}}>
                             <Menu defaults={{ handler: this.onAddTypeChange, group: 'buttonstyle' }}>
                                 <MenuItem text="Add" value="" iconCls={menuItemVal === '' && 'x-font-icon md-icon-check'}/>
                                 <MenuItem text="Import cloud vPath to 10.100.16.24" value="action" iconCls={menuItemVal === 'action' && 'x-font-icon md-icon-check'}/>
                                 <MenuItem text="import from China2World pack" value="decline" iconCls={menuItemVal === 'decline' && 'x-font-icon md-icon-check'}/>
                                 <MenuItem text="import from World2China pack" value="confirm" iconCls={menuItemVal === 'confirm' && 'x-font-icon md-icon-check'}/>
                             </Menu>
                          </Button>
                          <Button ui={'confirm round alt'} iconCls={'x-fa fa-refresh'}></Button>
                        </Container>
                    </FieldSet>
                  </FormPanel>
                  <Container>
                    <Grid store={this.dataStore} grouped width={'98%'} height={'320px'} style={{margin:'0 auto',border:'1px solid #73d8ef'}}>
                        <Column text={Intl.get('domain')} width="150" dataIndex="name"/>
                        <Column text={Intl.get('proxy')} width="85" dataIndex="price"/>
                        <Column text={Intl.get('description')} width="100" dataIndex="priceChange"/>
                    </Grid>
                  </Container>

                </div>
            </Container>
        </TabPanel>
        </div>
    )
  }
}
