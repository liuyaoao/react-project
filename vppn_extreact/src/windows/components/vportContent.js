import React,{Component} from 'react';
import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,Column,RendererCell  } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');

export default class VportContent extends Component {
    state={
      menuItemVal:'',
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
    render(){
      let {menuItemVal} = this.state;
      let {contentId} = this.props;
      let idNum = contentId.split('_')[0];
      return (
        <TabPanel
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
            <Container title="Remote Router">
              <div style={{margin:'20px'}}>
                <div>
                  <Container
                    layout={{ type: 'hbox', pack: Ext.os.is.Phone ? 'center' : 'left',align:'center'}}
                    margin="0 0 10 0"
                    defaults={{ margin: "0 10 0 0" }}
                  >
                    <span style={{marginRight:'20px'}}>Connect Error!</span>
                    <span>引导节点：</span>
                    <Button ui="action raised" text="Add">
                       <Menu defaults={{ handler: this.onAddTypeChange, group: 'buttonstyle' }}>
                           <MenuItem text="None" value="" iconCls={menuItemVal === '' && 'x-font-icon md-icon-check'}/>
                           <MenuItem text="Action" value="action" iconCls={menuItemVal === 'action' && 'x-font-icon md-icon-check'}/>
                           <MenuItem text="Decline" value="decline" iconCls={menuItemVal === 'decline' && 'x-font-icon md-icon-check'}/>
                           <MenuItem text="Confirm" value="confirm" iconCls={menuItemVal === 'confirm' && 'x-font-icon md-icon-check'}/>
                           <MenuItem text="Menu" value="menu" iconCls={menuItemVal === 'menu' && 'x-font-icon md-icon-check'}/>
                       </Menu>
                    </Button>
                    <Button text={"关闭"} ui={'decline raised'}></Button>
                    <Button text={""} ui={'action round alt raised'} iconCls={'x-fa fa-refresh'} alt="刷新"></Button>
                  </Container>
                  <Grid store={this.dataStore} grouped width={'98%'} height={'320px'} style={{margin:'0 auto',border:'1px solid #73d8ef'}}>
                      <Column text="状态" width="100" dataIndex="name"/>
                      <Column text="远程虚拟IP" width="120" dataIndex="price"/>
                      <Column text="远程子网" width="100" dataIndex="priceChange"/>
                      <Column text="链路状态" width="100" dataIndex="priceChange"/>
                      <Column text="延时" width="100" dataIndex="priceChange"/>
                      <Column text="描述" width="100" dataIndex="priceChange"/>
                  </Grid>
                  <Container margin="0 0 10 0"
                    layout={{ type: 'hbox', pack: Ext.os.is.Phone ? 'center' : 'left',align:'center'}}
                  >
                    <TextField
                      labelAlign="placeholder"
                      label="虚拟IP:"
                    />
                    <Button text={"添加"} ui={'action raised'}></Button>
                  </Container>
                </div>
              </div>
            </Container>
            <Container title="vPath">
                <div className="action">
                  <FormPanel>
                    <FieldSet title={"来自vPort"+ idNum+"的域名的流量将通过所选的vProxy路由。"}
                      layout={{type:'hbox',pack:'start',align: 'bottom'}}
                      defaults={{labelAlign: "placeholder"}}
                      margin="10 10 10 10"
                      >
                        <TextField placeholder="Enter..." width="200" label="请输入关键字或域名或URL" required flex={1}/>
                        <SelectField
                            label="vProxy"
                            flex={1}
                            width="200"
                            onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                            options={[
                                { text: '', value: null },
                                { text: 'Option 1', value: 1 },
                                { text: 'Option 2', value: 2 },
                                { text: 'Option 3', value: 3 }
                            ]}
                        />
                        <Container flex={1}>
                          <Button ui="action raised" text="Add" style={{marginRight:'10px'}}>
                             <Menu defaults={{ handler: this.onAddTypeChange, group: 'buttonstyle' }}>
                                 <MenuItem text="None" value="" iconCls={menuItemVal === '' && 'x-font-icon md-icon-check'}/>
                                 <MenuItem text="Action" value="action" iconCls={menuItemVal === 'action' && 'x-font-icon md-icon-check'}/>
                                 <MenuItem text="Decline" value="decline" iconCls={menuItemVal === 'decline' && 'x-font-icon md-icon-check'}/>
                                 <MenuItem text="Confirm" value="confirm" iconCls={menuItemVal === 'confirm' && 'x-font-icon md-icon-check'}/>
                                 <MenuItem text="Menu" value="menu" iconCls={menuItemVal === 'menu' && 'x-font-icon md-icon-check'}/>
                             </Menu>
                          </Button>
                          <Button text={""} ui={'action round alt raised'} iconCls={'x-fa fa-refresh'}></Button>
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
