
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SelectField,ContainerField,Menu,MenuItem, TabPanel,
  FormPanel, Panel,TextField,CheckBoxField } from '@extjs/ext-react';

class PushServiceComp extends Component{
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
        <div>{Intl.get('pushSevice_desc')}</div>
        <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
          <CheckBoxField boxLabel={Intl.get('Sending notifications about system status via e-mail server')} cls="black_label"/>
          <TextField label={Intl.get('Recipient')+"："}
            labelTextAlign="text" labelAlign="left" width="100%"
            value=''
            cls="disable_text"
            textAlign="right"/>
            <CheckBoxField boxLabel={Intl.get('Start mobile device notifications')} cls="black_label"/>
            <Container layout={{type:'vbox',pack:'center',align:'stretch'}} width="100%" margin="10 10 10 10">
                <Button text={Intl.get('Management paired device')} ui={'confirm raised'} />
                <Button text={Intl.get('Enable browser notifications')} ui={'decline raised'} />
                <Button text={Intl.get('Send test message')} ui="confirm raised" />
            </Container>
        </Container>
        <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
            <Button text={Intl.get('Apply')} ui={'confirm alt'} style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Reset')} ui={'decline alt'} style={{marginLeft:'10px'}}/>
        </Container>
      </div>
    );
  }

}

export default PushServiceComp;
