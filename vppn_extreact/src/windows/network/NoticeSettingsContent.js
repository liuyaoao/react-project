import React,{Component} from 'react';
import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,ToggleField   } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class NoticeSettingsContent extends Component {
    state={
      wifi5GSwitch:true,
      menuItemVal:'',
      selectedBootsNode:'220.168.30.12',
    }
    onAddTypeChange = (item)=>{
      this.setState({menuItemVal:item.value});
    }
    onBootsNodeSelectChanged = (field, newValue)=>{
      this.setState({ selectedBootsNode:newValue });
      Ext.toast(`You selected the item with value ${newValue}`);
    }
    onClickWifi5GSwitch = (e)=>{
      console.log("点击了wifi 5GHz开关：",e);
      this.setState( {wifi5GSwitch:!this.state.wifi5GSwitch} );
    }
    render(){
      let {menuItemVal,selectedBootsNode} = this.state;

      return (
        <div className='noticeSettings_content' style={{height:'100%'}}>
          <TabPanel cls='noticeSettings_tabPanel'
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
              <Container title="电子邮件" cls="email_tab">
                <div style={{margin:'20px'}}>电子邮件
                </div>
              </Container>
              <Container title="短信" cls="message_tab">
                  <div className="">
                    短信
                  </div>
              </Container>
              <Container title="推送服务" cls="pushService_tab">
                  <div className="">
                    推送服务
                  </div>
              </Container>
              <Container title="高级设置" cls="superSetting_tab">
                  <div className="">
                    高级设置
                  </div>
              </Container>

            </TabPanel>
        </div>
    )
  }
}
