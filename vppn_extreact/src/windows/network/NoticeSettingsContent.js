import React,{Component} from 'react';
import Intl from '../../intl/Intl';
import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,CheckColumn,ToggleField,CheckBoxField,ContainerField   } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class NoticeSettingsContent extends Component {
    state={
      noticeType:"",
      vPathList:new Ext.data.Store({
        data:[
          {uri:'432',vproxy:'gregre',desc:'gfretgre'},
          {uri:'765',vproxy:'fdegre',desc:'bresgr'}
        ],
        sorters:'domain'
      }),//vPath列表
    }

    onNoticeTypeChanged = (item)=>{
      this.setState({ noticeType:item.value });
    }
    render(){
      let {noticeType} = this.state;

      return (
        <div className='noticeSettings_content' style={{height:'100%',position:'relative'}}>
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
              <Container title="电子邮件" cls="email_tab" scrollable={true}>
                <EmailComp/>
              </Container>
              <Container title="短信" cls="message_tab" scrollable={true}>
                  <MessageComp/>
              </Container>
              <Container title="推送服务" cls="pushService_tab" scrollable={true}>
                <div style={{padding:'10px'}}>
                  <div>{Intl.get('pushSevice_desc')}</div>
                  <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
                    <CheckBoxField boxLabel={Intl.get('Sending notifications about system status via e-mail server')} cls="black_label"/>
                    <TextField label={Intl.get('Recipient')+"："}
                      labelTextAlign="text" labelAlign="left"
                      value=''/>
                      <CheckBoxField boxLabel={Intl.get('Start mobile device notifications')} cls="black_label"/>
                      <Container layout={{type:'hbox',pack:'left',align:'bottom'}}>
                          <Button text={Intl.get('Management paired device')} ui={'confirm raised'} style={{marginRight:'10px'}}/>
                          <Button text={Intl.get('Enable browser notifications')} ui={'decline raised'} />
                      </Container>
                      <Button text={Intl.get('Send test message')} ui="confirm raised" margin="10 10 10 0"/>
                  </Container>

                </div>
              </Container>
              <Container title="高级设置" cls="superSetting_tab" scrollable={true}>
                  <Container layout={{type:'hbox',pack:'space-between',align:'bottom'}} margin='10'>
                    <Container style={{'float':'left'}}>
                        <Button text={Intl.get('Edit Message')} ui={'confirm raised'} style={{marginRight:'10px',marginBottom:'10px'}}/>
                        <Button text={Intl.get('Save')} ui={'decline raised'} style={{marginRight:'10px',marginBottom:'10px'}}/>
                        <Button text={Intl.get('Edit Variables')} ui={'decline raised'} style={{marginRight:'10px',marginBottom:'10px'}}/>
                    </Container>
                    <Container style={{'float':'right'}}>
                      <Button shadow ui="menu raised" text="所有通知" style={{'float':'right',marginRight:'5px',marginBottom:'10px'}}>
                         <Menu defaults={{ handler: this.onNoticeTypeChanged, group: 'buttonstyle' }}>
                             <MenuItem text="所有通知" value="所有通知" iconCls={noticeType === '所有通知' && 'x-font-icon md-icon-check'}/>
                             <MenuItem text="电子邮件" value="电子邮件" iconCls={noticeType === '电子邮件' && 'x-font-icon md-icon-check'}/>
                         </Menu>
                      </Button>
                    </Container>
                  </Container>
                  <Grid store={this.state.vPathList} grouped width={'98%'} height={'320px'} style={{margin:'0 auto',border:'1px solid #73d8ef'}}>
                      <Column text={Intl.get('Events')} flex={2} dataIndex="uri"/>
                      <CheckColumn text={Intl.get('Email')} flex={1} dataIndex="vproxy" groupable={false} sortable={false}/>
                      <CheckColumn text={Intl.get('Message')} flex={1} dataIndex="desc" groupable={false} sortable={false}/>
                      <CheckColumn text={Intl.get('Mobile Device')} flex={1} dataIndex="desc" groupable={false} sortable={false}/>
                  </Grid>
              </Container>

            </TabPanel>
            <Container layout={{type:'hbox',pack:'end',align:'bottom'}} height="40px" width="100%" style={{position:'absolute',bottom:'10px',right:'20px'}}>
                <Button text={Intl.get('Apply')} ui={'confirm alt'} style={{marginRight:'10px'}}/>
                <Button text={Intl.get('Reset')} ui={'decline alt'} style={{marginLeft:'10px'}}/>
            </Container>
        </div>
    )
  }
}

//电子邮件tab页内容
class EmailComp extends Component{
  state = {
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount() {
  }

  render () {
    let {bodyHeight} = this.state;
    let {} = this.state;
    let {contentId} = this.props;
    return (
      <div style={{padding:'10px'}}>
        <div>{Intl.get('email_desc')}</div>
        <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
          <CheckBoxField boxLabel={Intl.get('Enable email notification')} cls="black_label"/>
          <TextField label={Intl.get('Recipient')+"："}
            labelTextAlign="text" labelAlign="left" width="70%" labelWidth="160"
            value=''/>
          <TextField label={Intl.get('Subject prefix')+"："}
            labelTextAlign="text" labelAlign="left" width="70%" labelWidth="160"
            value=''/>
          <TextField label={Intl.get('Service provider')+"："}
            labelTextAlign="text" labelAlign="left" width="70%" labelWidth="160"
            value=''/>
            <Button text={Intl.get('Log in to Gmail')} ui="raised" style={{marginTop:'10px'}}/>
            <CheckBoxField boxLabel={Intl.get('Send welcome messages to new users')} cls="black_label"/>
            <Button text={Intl.get('Send test email')} ui="confirm raised" style={{marginBottom:'10px'}}/>
        </Container>
      </div>
    );
  }

}

//短信设置tab页内容
class MessageComp extends Component{
  state = {
    SMS_Provider:'',
  }
  componentDidMount(){
  }
  onSMS_ProviderChanged = (item)=>{

  }
  render () {
    let {SMS_Provider} = this.state;
    return (
      <div style={{padding:'10px'}}>
        <div>{Intl.get('message_desc')}</div>
        <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
          <CheckBoxField boxLabel={Intl.get('Enable message notification')} cls="black_label"/>
          <ContainerField label={Intl.get('SMS provider')+'：'}
            width="70%" labelWidth="160"
            layout={'hbox'} cls="disable_text"
            labelAlign="left"
            labelTextAlign="left">
            <Button ui="menu" text="clickatell" style={{width:'100%','float':'left'}}>
               <Menu defaults={{ handler: this.onSMS_ProviderChanged, group: 'buttonstyle' }}>
                   <MenuItem text="clickatell" value="clickatell" iconCls={SMS_Provider === 'clickatell' && 'x-font-icon md-icon-check'}/>
                   <MenuItem text="220.168.30.1" value="2" iconCls={SMS_Provider === '2' && 'x-font-icon md-icon-check'}/>
               </Menu>
            </Button>
          </ContainerField>
          <Container layout={{type:'hbox',pack:'let',align:'bottom'}} margin="10 10 10 10">
              <Button text={Intl.get('Edit')} ui={'confirm raised'} style={{marginRight:'10px'}}/>
              <Button text={Intl.get('Delete')} ui={'decline raised'} style={{marginLeft:'10px'}}/>
          </Container>
          <TextField label={Intl.get('User Account')+"："}
            labelTextAlign="text" labelAlign="left" width="70%" labelWidth="160"
            value=''/>
          <TextField label={Intl.get('Password')+"："}
            labelTextAlign="text" labelAlign="left" width="70%" labelWidth="160"
            value=''/>
          <TextField label={Intl.get('Confirm Password')+"："}
            labelTextAlign="text" labelAlign="left" width="70%" labelWidth="160"
            value=''/>
          <TextField label={Intl.get('API ID')+"："}
            labelTextAlign="text" labelAlign="left" width="70%" labelWidth="160"
            value=''/>
            <Button text={Intl.get('Add New SMS Provider')} ui="raised" style={{margin:'10px 0'}}/>
            <TextField label={Intl.get('Main Phone Number')+"："}
              labelTextAlign="text" labelAlign="left" width="70%" labelWidth="160"
              value=''/>
            <TextField label={Intl.get('Secondary Phone Number')+"："}
              labelTextAlign="text" labelAlign="left" width="70%" labelWidth="160"
              value=''/>

            <CheckBoxField boxLabel={Intl.get('Set SMS spacing restrictions')} cls="black_label"/>
            <TextField label={Intl.get('Each message is at least a few minutes apart')+"："}
              labelTextAlign="text" labelAlign="top" width="70%"
              value=''/>
            <Button text={Intl.get('Send test message')} ui="confirm raised" style={{marginBottom:'10px'}}/>
        </Container>
      </div>
    );
  }

}
