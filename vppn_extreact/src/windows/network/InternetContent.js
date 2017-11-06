import React,{Component} from 'react';
import { TabPanel, Container, FormPanel,TextField,Panel,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,Column,CheckBoxField   } from '@extjs/ext-react';
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
        <TabPanel cls='InternetContent'
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
            <Container title="链接" cls="connect_tab">
              <div >
                <FormPanel>
                  <FieldSet title={"您可在此设置Internet连接。您的连接类型由网络环境决定。请咨询ISP以获得所需的帮助。"}
                    layout={{type:'vbox',pack:'left',align: 'left'}}
                    defaults={{labelAlign: "placeholder"}}
                    width={'100%'}
                    margin="10 10 10 10"
                    >
                      <SelectField label="连接类型：" width={'100%'}
                          labelTextAlign="left" labelAlign="left" value={1}
                          onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                          options={[
                              { text: '高 - WAP2-个人', value: 1 },
                              { text: 'Option 1', value: 2 }
                          ]}
                      />
                      <SelectField label="设置默认网关：" width={'100%'}
                          labelTextAlign="left" labelAlign="left" value={1}
                          onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                          options={[
                              { text: '已启用', value: 1 },
                              { text: '已停用', value: 2 }
                          ]}
                      />
                      <TextField width={'100%'} label="DNS Server:" labelTextAlign="left" labelAlign="left" value="" />
                      <SelectField label="启用Jumbo Frame：" width={'100%'}
                          labelTextAlign="left" labelAlign="left" value={1}
                          onChange={(field, newValue) => Ext.toast(`You selected the item with value ${newValue}`)}
                          options={[
                              { text: '已停用', value: 1 },
                              { text: '已启用', value: 2 }
                          ]}
                      />
                  </FieldSet>
                </FormPanel>
                <Container
                  layout={{ type: 'hbox', pack: 'left'}}
                  margin="0 0 10 0"
                  defaults={{ margin: "0 10 10 0" }}
                >
                    <Button ui="confirm raised" text="ISP设置"/>
                    <Button ui="raised" text="ISP设置(IPTV和VoIP)"/>
                    <Button ui="raised" text="VPN设置"/>
                    <Button ui="raised" text="IPv6设置"/>
                </Container>
              </div>
            </Container>

            {/* QuickConnect & DDNS 内容区 */}
            <Container title="QuickConnect & DDNS" cls="ddns_tab">
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

                </div>
            </Container>

            {/* 端口转发 tab 内容区 */}
            <Container title="端口转发" cls="portTransfer_tab">
                <div style={{background:'',border:'1px solid #9dd4d6',padding:'10px',margin:'10px',background:'#e4f3f5'}}>
                  <div style={{padding:'1px'}}>随处连接到您的 Synology Router</div>
                  <div style={{marginLeft:'10px',textAlign:'left'}}>
                    <div><span style={{width:'100px',display:'inline-block',paddingTop:'10px'}}>网页浏览器：</span><span>已停用</span></div>
                    <div><span style={{width:'100px',display:'inline-block',paddingTop:'10px'}}>DDNS：</span><span>已停用</span></div>
                    <div><span style={{width:'100px',display:'inline-block',paddingTop:'10px'}}>移动应用程序：</span><span>已停用</span></div>
                  </div>
                </div>
                <div className="cnt" style={{margin:'20px'}}>
                  <div className="title">5GHz</div>
                  <Panel
                    margin='10 0 10 0'
                    layout="vbox"
                  >
                    <div>QuickConnect能够让您在任何地方轻松连接到Synology Router，只需启动下方的QuickConnect并注册一组Synology账户即可完成。</div>
                    <Container flex={1}>
                      <div style={{'float':'left'}}><CheckBoxField boxLabel="启用QuickConnect"/></div>
                    </Container>

                  </Panel>
                </div>

            </Container>

            {/* 端口触发 tab 内容区 */}
            <Container title="端口触发" cls="portTrigger_tab">
                <Container
                    layout={{ type: 'hbox', pack: 'left'}}
                    margin="10 0 10 10"
                    defaults={{ margin: "10 0 10 10" }}
                  >
                    <Button ui="confirm raised" text="新增"/>
                    <Button ui="raised" text="编辑"/>
                    <Button ui="raised" text="删除"/>
                    <Button ui="raised" text="保存"/>
                    <Button ui="raised" text="设置"/>
                </Container>

            </Container>

        </TabPanel>
    )
  }
}
