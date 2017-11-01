import React,{Component} from 'react';
import { TabPanel, Container,FormPanel,FieldSet,TextField,Button,
  SelectField,ComboBoxField,List,TextAreaField } from '@extjs/ext-react';

Ext.require('Ext.Toast');
Ext.require('store.chained');

export default class SettingContent extends Component{

  dataStore = {
      data: [
        {index:1, name:' China2World'},
        {index:2, name:' World2China'}
      ],
      sorters: 'name'
  }
  componentWillMount(){

  }
  handleShow(key, e){
  }
  onListSelect = (records,opts)=>{
    console.log("records--opts--:",records,opts);
  }
  itemTpl = (data)=>(<div>
              <a onClick={this.handleShow.bind(this, data.index)}>{data.name}</a>
            </div>)
  render(){
    let data= [{name:'127.0.0.1',abbrev:'999'}];
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
            <Container title="setting">
              <FormPanel>
                <FieldSet title={"管理服务器1"}
                  layout={{type:'hbox',pack:'start',align: 'bottom'}}
                  defaults={{labelAlign: "placeholder"}}
                  margin="5 10 0 10"
                  >
                    <TextField placeholder="Enter..." labelAlign={'placeholder'} width="200" label="地址：" required flex={1}/>
                    <TextField placeholder="Enter..." width="200" label="端口：" required flex={1}/>
                    <Container flex={1}>
                      <Button text={"测试"} ui={'confirm  raised'} style={{marginLeft:'10px',marginRight:'10px'}}></Button>
                      <Button text={"保存"} ui={'action raised'}></Button>
                    </Container>
                </FieldSet>
              </FormPanel>
              <FormPanel>
                <FieldSet title={"管理服务器2"}
                  layout={{type:'hbox',pack:'start',align: 'bottom'}}
                  defaults={{labelAlign: "placeholder"}}
                  margin="5 10 0 10"
                  >
                    <TextField placeholder="Enter..." width="200" label="地址：" required flex={1}/>
                    <TextField placeholder="Enter..." width="200" label="端口：" required flex={1}/>
                    <Container flex={1}>
                      <Button text={"测试"} ui={'confirm raised'} style={{marginLeft:'10px',marginRight:'10px'}}></Button>
                      <Button text={"保存"} ui={'action raised'}></Button>
                    </Container>
                </FieldSet>
              </FormPanel>
              <FormPanel>
                <FieldSet title={"管理目标"}
                  layout={{type:'hbox',pack:'start',align: 'bottom'}}
                  defaults={{labelAlign: "placeholder"}}
                  margin="5 10 0 10"
                  >
                    <ComboBoxField
                      width={200}
                      label="地址："
                      store={data}
                      displayField="name"
                      valueField="abbrev"
                      queryMode="local"
                      labelAlign="placeholder"
                      clearable
                    />
                    <Container flex={1}>
                      <Button text={"保存"} ui={'action raised'} style={{marginLeft:'10px'}}></Button>
                    </Container>
                </FieldSet>
              </FormPanel>
              <FormPanel>
                <FieldSet title={"Syslog"}
                  layout={{type:'hbox',pack:'start',align: 'bottom'}}
                  defaults={{labelAlign: "placeholder"}}
                  margin="5 10 0 10"
                  >
                    <ComboBoxField
                      width={200}
                      label="地址："
                      store={data}
                      displayField="name"
                      valueField="abbrev"
                      queryMode="local"
                      labelAlign="placeholder"
                      clearable
                    />
                    <SelectField
                       label="Level:"
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
                      <Button text={"Enable"} ui={'action raised'} style={{marginLeft:'10px'}}></Button>
                    </Container>
                </FieldSet>
              </FormPanel>
            </Container>

            <Container title="vPath packs">
              <FormPanel>
                <FieldSet title={"vPathPacks:请选择一个要编辑的vPathPack"}
                  layout={{type:'hbox',pack:'start',align: 'top'}}
                  defaults={{labelAlign: "placeholder"}}
                  margin="5 5 5 5"
                  >
                  <List cls="" shadow
                      itemTpl={this.itemTpl}
                      store={this.dataStore}
                      onSelect={this.onListSelect}
                      zIndex={999}
                      height={''+(this.props.windowHeight-169)}
                      width={'160'}
                    />
                    <Container flex={1} style={{marginLeft:'20px'}}>
                      <textarea style={{width:'100%',height:''+(this.props.windowHeight-200),border:'1px solid #a0cdd6'}} />
                      <Button text={"保存"} ui={'action raised'} style={{'float':'right',marginTop:'10px'}}></Button>
                    </Container>
                </FieldSet>
              </FormPanel>
            </Container>

            <Container title="payment">
                <div className="action" style={{margin:'10px'}}>到期时间：2020-11-09</div>
                <div style={{margin:'10px'}}>支付请点击：<span> PayPal</span></div>
            </Container>
        </TabPanel>
    )
  }

}
