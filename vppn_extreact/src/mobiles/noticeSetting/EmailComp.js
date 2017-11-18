
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SelectField,ContainerField,Menu,MenuItem, TabPanel,
  FormPanel, Panel,TextField,CheckBoxField } from '@extjs/ext-react';

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
      <div style={{margin:'0'}}>
        <div>{Intl.get('email_desc')}</div>
        <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
          <CheckBoxField boxLabel={Intl.get('Enable email notification')} cls="black_label"/>
          <TextField label={Intl.get('Recipient')+"："}
            labelTextAlign="text" labelAlign="left" width="100%"
            value=''
            cls="disable_text"
            textAlign="right"/>
          <TextField label={Intl.get('Subject prefix')+"："}
            labelTextAlign="text" labelAlign="left" width="100%"
            value=''
            cls="disable_text"
            textAlign="right"/>
          <TextField label={Intl.get('Service provider')+"："}
            labelTextAlign="text" labelAlign="left" width="100%"
            value=''
            cls="disable_text"
            textAlign="right"/>
            <Button text={Intl.get('Log in to Gmail')} ui="raised" style={{marginTop:'10px'}}/>
            <CheckBoxField boxLabel={Intl.get('Send welcome messages to new users')} cls="black_label"/>
            <Button text={Intl.get('Send test email')} ui="confirm raised" style={{marginBottom:'10px'}}/>
        </Container>
        <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
            <Button text={Intl.get('Apply')} ui={'confirm alt'} style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Reset')} ui={'decline alt'} style={{marginLeft:'10px'}}/>
        </Container>
      </div>
    );
  }

}

export default EmailComp;
