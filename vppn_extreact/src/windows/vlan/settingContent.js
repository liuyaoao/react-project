import React,{Component} from 'react';
import moment from 'moment';
import Intl from '../../intl/Intl';
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
  componentDidMount(){
    this.props.vpnActions.getPaymentInfo();
  }
  componentWillUnmount(){
    // $('.tab_settingContent').remove();
  }
  handleShow(key, e){
  }
  onListSelect = (records,opts)=>{
    console.log("records--opts--:",records,opts);
  }
  clickManagerServerTest = (serverNum) => { //点击 manager server 测试

  }
  clickManagerServerSave = (serverNum) => {  //点击 manager server 保存

  }
  itemTpl = (data)=>(<div>
              <a onClick={this.handleShow.bind(this, data.index)}>{data.name}</a>
            </div>)

  render(){
    let {paymentInfo} = this.props;
    let data= [{name:'127.0.0.1',abbrev:'999'}];
    return (
      <div className="" style={{height:'100%'}}>
        <TabPanel cls="tab_settingContent"
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
            <Container title={Intl.get('setting')} scrollable={true}>
              <ManagerServerComp serverNum={1}
                managerServer={this.props.managerServer}
                clickManagerServerTest={this.clickManagerServerTest}
                clickManagerServerSave={this.clickManagerServerSave}
              />
              <ManagerServerComp serverNum={2}
                managerServer={this.props.managerServer}
                clickManagerServerTest={this.clickManagerServerTest}
                clickManagerServerSave={this.clickManagerServerSave}
              />

              <FormPanel>
                <FieldSet title={Intl.get("Management Goal")}
                  layout={{type:'hbox',pack:'start',align: 'bottom'}}
                  defaults={{labelAlign: "placeholder"}}
                  margin="5 10 0 10"
                  >
                    <ComboBoxField
                      width={200}
                      label={Intl.get('Address')+"："}
                      store={data}
                      displayField="name"
                      valueField="abbrev"
                      queryMode="local"
                      labelAlign="placeholder"
                      clearable
                    />
                    <Container flex={1}>
                      <Button text={Intl.get('save')} ui={'action raised'} style={{marginLeft:'10px'}}></Button>
                    </Container>
                </FieldSet>
              </FormPanel>
              <FormPanel>
                <FieldSet title={Intl.get('Syslog')}
                  layout={{type:'hbox',pack:'start',align: 'bottom'}}
                  defaults={{labelAlign: "placeholder"}}
                  margin="5 10 0 10"
                  >
                    <ComboBoxField
                      width={200}
                      label={Intl.get('Address')+"："}
                      store={data}
                      displayField="name"
                      valueField="abbrev"
                      queryMode="local"
                      labelAlign="placeholder"
                      clearable
                    />
                    <SelectField
                       label={Intl.get('Level')+"："}
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
                      <Button text={Intl.get('Enable')} ui={'action raised'} style={{marginLeft:'10px'}}></Button>
                    </Container>
                </FieldSet>
              </FormPanel>
            </Container>

            <Container title={Intl.get('vPath packs')} scrollable={true}>
              <FormPanel>
                <FieldSet title={Intl.get('vPathPacks_title')}
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
                      width={'160'}/>
                  <Container flex={1} style={{marginLeft:'20px'}}>
                    <textarea style={{width:'100%',height:''+(this.props.windowHeight-200)+'px',border:'1px solid #a0cdd6'}} />
                    <Button text={Intl.get('save')} ui={'action raised'} style={{'float':'right',marginTop:'10px'}}></Button>
                  </Container>
                </FieldSet>
              </FormPanel>
            </Container>

            <Container title={Intl.get('payment')} scrollable={true}>
                {paymentInfo.type=='date' ?
                  <div style={{margin:'10px',fontSize:'23px',fontWeight:'600'}}>{Intl.get("Expiration date")}：{moment(+paymentInfo.endtime).format("MM-DD-YYYY")}</div>:
                  <div style={{margin:'10px',fontSize:'23px',fontWeight:'600'}}>{Intl.get("Remaining traffic")}：{parseInt(+paymentInfo.flow/1024)} kb</div>
                }
                <div style={{margin:'10px'}}>{Intl.get("Please click to pay")}：<span> PayPal</span></div>
            </Container>
        </TabPanel>
      </div>
    )
  }

}

function ManagerServerComp(props){
  return (
    <div>
      <FormPanel>
        <FieldSet title={Intl.get('Manage Server')+" "+props.serverNum}
          layout={{type:'hbox',pack:'stretch',align: 'bottom'}}
          defaults={{labelAlign: "placeholder"}}
          margin="5 10 0 10"
          >
            <TextField value={props.managerServer.cloud_host}
              label={Intl.get('Address')+"："}
              width="250"
              required />
            <TextField value={props.managerServer.cloud_port}
              label={Intl.get('Port')+"："}
              width="250"
              required />
            <Container>
              <Button text={Intl.get('test')}
                onClick={()=>props.clickManagerServerTest(props.serverNum)}
                ui={'confirm  raised'}
                style={{marginLeft:'10px',marginRight:'10px'}}></Button>
              <Button text={Intl.get('save')}
                onClick={()=>props.clickManagerServerSave(props.serverNum)}
                ui={'action raised'}></Button>
            </Container>
        </FieldSet>
      </FormPanel>
    </div>
  )
}
