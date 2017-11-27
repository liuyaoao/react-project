
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SelectField,ContainerField,Menu,MenuItem, TabPanel,
  FormPanel, Panel,TextField,CheckBoxField } from '@extjs/ext-react';

class MessageComp extends Component{
  state = {
    SMS_Provider:'',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount() {
  }
  onSMS_ProviderChanged = (item)=>{

  }

  render () {
    let {bodyHeight,SMS_Provider} = this.state;
    let {} = this.state;
    let {contentId} = this.props;
    return (
      <div style={{padding:'10px'}}>
        <div>{Intl.get('message_desc')}</div>
        <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
          <CheckBoxField boxLabel={Intl.get('Enable message notification')} cls="black_label"/>
          <ContainerField label={Intl.get('SMS provider')+'：'}
            cls="black_label auto_width disable_text"
            width="100%"
            layout={'hbox'}
            labelAlign="left"
            labelTextAlign="left">
            <Button ui="menu" text="clickatell" style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
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
            labelTextAlign="text" labelAlign="left" width="100%"
            value=''
            cls="disable_text"
            textAlign="right"/>
          <TextField label={Intl.get('Password')+"："}
            labelTextAlign="text" labelAlign="left" width="100%"
            value=''
            cls="disable_text"
            textAlign="right"/>
          <TextField label={Intl.get('Confirm Password')+"："}
            labelTextAlign="text" labelAlign="left" width="100%" labelWidth="45%"
            value=''
            cls="disable_text"
            textAlign="right"/>
          <TextField label={Intl.get('API ID')+"："}
            labelTextAlign="text" labelAlign="left" width="100%"
            value=''
            cls="disable_text"
            textAlign="right"/>
            <Button text={Intl.get('Add New SMS Provider')} ui="raised" style={{margin:'10px 0'}}/>
            <TextField label={Intl.get('Main Phone Number')+"："}
              labelTextAlign="text" labelAlign="left" width="100%" labelWidth="50%"
              value=''
              cls="disable_text"
              textAlign="right"/>
            <TextField label={Intl.get('Secondary Phone Number')+"："}
              labelTextAlign="text" labelAlign="left" width="100%" labelWidth="50%"
              value=''
              cls="disable_text"
              textAlign="right"/>

            <CheckBoxField boxLabel={Intl.get('Set SMS spacing restrictions')} cls="black_label"/>
            <TextField label={Intl.get('Each message is at least a few minutes apart')+"："}
              labelTextAlign="text" labelAlign="top" width="100%"
              value=''
              cls="disable_text"/>
            <Button text={Intl.get('Send test message')} ui="confirm raised" style={{marginBottom:'10px'}}/>
        </Container>
        <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
            <Button text={Intl.get('Apply')} ui={'confirm alt'} style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Reset')} ui={'decline alt'} style={{marginLeft:'10px'}}/>
        </Container>
      </div>
    );
  }

}

export default MessageComp;
