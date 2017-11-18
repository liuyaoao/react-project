
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel,
   Panel,TextField,CheckBoxField } from '@extjs/ext-react';

class ServiceComp extends Component{
  state = {
    bodyHeight:500,
    bodyWidth:'100%',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount () {
  }

  render () {

    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <div className="cnt">
            <div className="title">{Intl.get('Terminal')}</div>
            <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
              <CheckBoxField boxLabel={Intl.get('Enable SSH Functionality')} cls="black_label"/>
              <TextField label={"IP "+Intl.get('Address')+"："}
                labelTextAlign="text" labelAlign="left" width="100%"
                value="192.168.1.1"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
            </Container>
          </div>
          {/* SNMP*/}
          <div className="cnt" style={{marginTop:'10px'}}>
            <div className="title">{Intl.get('SNMP')}</div>
            <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
              <CheckBoxField boxLabel={Intl.get('Enable SNMP Service')} cls="black_label"/>
              <Container style={{width:'90%',marginLeft:'10%'}}>
                <TextField label={Intl.get('Device Name')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <TextField label={Intl.get('Device Location')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <TextField label={Intl.get('Contact Way')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <CheckBoxField boxLabel={"SNMPv1、SNMPv2c "+Intl.get('Service')} cls="black_label fl_lf"/>
                <TextField label={Intl.get('Community')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <CheckBoxField boxLabel={"SNMPv3 "+Intl.get('Service')} cls="black_label fl_lf"/>
                <TextField label={Intl.get('User Account')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <TextField label={Intl.get('Password')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
              </Container>

            </Container>
          </div>

          <Container layout={{type:'hbox',pack:'center',aglin:'bottom'}} margin="10 10 10 10">
            <Button text={Intl.get('Apply')} ui="confirm alt" style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Reset')} ui="decline alt" style={{marginLeft:'10px'}}/>
          </Container>
        </div>
      </div>
    );
  }

}

export default ServiceComp;
