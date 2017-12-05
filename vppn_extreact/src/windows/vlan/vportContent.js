import React,{Component} from 'react';
import Intl from '../../intl/Intl';

import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,Column,RendererCell  } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class VportContent extends Component {
    state={
      menuItemVal:'',
      selectedBootsNode:'220.168.30.12',
      selectedVProxyIp:'', //选中的vProxy IP.
      routerList:[],//远程路由器列表
      vPathList:[],//vPath列表
    }
    componentDidMount(){
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.remoteRouterList){
        this.setState({
          routerList:new Ext.data.Store({
            data: nextProps.remoteRouterList,
            sorters: 'name'
          }),
          vPathList:new Ext.data.Store({
            data:nextProps.vPathList,
            sorters:'domain'
          })
        });
      }
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
      let {routerList,vPathList,menuItemVal,selectedBootsNode} = this.state;
      let {contentId,myVirtualIP,vPortBootNodesList} = this.props;
      let idNum = contentId.split('_')[0]; //端口号索引
      let bootsNodeOptions = [];
      vPortBootNodesList.map((item)=>{ //获取某个端口的启动节点列表
        if(item.ServerType == ('vppn'+idNum)){
          bootsNodeOptions.push({ text:item.IP, value:item.IP });
        }
      });

      let vProxyIpOptions = this.props.vProxyList;
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
                    <span className={myVirtualIP?'myVirtualIP':'myVirtualIP no_connected'}>{myVirtualIP?myVirtualIP:'Connect Error!'}</span>
                    <span>{Intl.get("Boot Nodes")}：</span>
                    <SelectField
                       width="200"
                       name={'bootsNode'}
                       displayField={'value'}
                       value={selectedBootsNode}
                       onChange={this.onBootsNodeSelectChanged}
                       options={bootsNodeOptions} />
                    <Button text={Intl.get("close")} ui={'decline alt'}></Button>
                    <Button text={""} ui={'confirm round alt'} iconCls={'x-fa fa-refresh'} alt={Intl.get("refresh")}></Button>
                  </Container>
                  <Container>
                    <Grid store={routerList} grouped width={'99%'} height={'320px'} style={{margin:'0 auto',border:'1px solid #73d8ef'}}>
                        <Column text={Intl.get('state')}
                          width="100"
                          dataIndex="status"/>
                        <Column text={Intl.get('Remote Virtual IP')} width="120" dataIndex="virtualIp"/>
                        <Column text={Intl.get('Remote Subnet')} width="100" dataIndex="subnet"/>
                        <Column text={Intl.get('Link State')} width="100" dataIndex="link"/>
                        <Column text={Intl.get('delay')} width="100" dataIndex="latency"/>
                        <Column text={Intl.get('description')} width="100" dataIndex="latency"/>
                    </Grid>
                  </Container>
                  <Container margin="10 0 10 0"
                    layout={{ type: 'hbox', pack: Ext.os.is.Phone ? 'center' : 'left',align:'bottom'}}
                  >
                    <TextField width="300"
                      labelWidth="80"
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
                    <Grid store={vPathList} grouped width={'98%'} height={'320px'} style={{margin:'0 auto',border:'1px solid #73d8ef'}}>
                        <Column text={Intl.get('domain')} width="150" dataIndex="domain"/>
                        <Column text={Intl.get('proxy')} width="85" dataIndex="proxy"/>
                        <Column text={Intl.get('description')} width="100" dataIndex="desc"/>
                    </Grid>
                  </Container>

                </div>
            </Container>
        </TabPanel>
        </div>
    )
  }
}
