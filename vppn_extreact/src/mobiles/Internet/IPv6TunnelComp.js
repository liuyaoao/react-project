
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,TextField,
  CheckBoxField,RadioField } from '@extjs/ext-react';

class IPv6TunnelComp extends Component{
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
    const radioProps = {
        name: 'radios'
    };
    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <div>{Intl.get('Starting Tunnel can use IPv6 communication protocol in IPv4 network environment.')}</div>
          <FormPanel layout={{type:'vbox',pack:'center',align:'left'}} padding="0">
            <CheckBoxField boxLabel={Intl.get('Enable')+' Tunnel'} cls="black_label"/>
            <RadioField {...radioProps} boxLabel={Intl.get('Set as default gateway')} value="checked1" checked/>

            <TextField label={Intl.get('Server Address')+"："}
              labelTextAlign="text" labelAlign="left" width="100%"
              value="192.168.1.1"
              cls="black_label auto_width disable_text"
              textAlign="right"/>
            <RadioField {...radioProps} boxLabel={Intl.get('Anonymous online')} value="checked2"/>
            <RadioField {...radioProps} boxLabel={Intl.get('Online with current accounts')} value="checked3"/>
            <TextField label={Intl.get('User Name')+"："}
              labelTextAlign="text" labelAlign="left" width="100%"
              value="192.168.1.1"
              cls="black_label auto_width disable_text"
              textAlign="right"/>
            <TextField label={Intl.get('Password')+"："}
              labelTextAlign="text" labelAlign="left" width="100%"
              value="192.168.1.1"
              cls="black_label auto_width disable_text"
              textAlign="right"/>
          </FormPanel>

          <div style={{marginTop:'20px'}}>
            <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
            <TextField disabled label={Intl.get('Connection state')+"："}
              labelTextAlign="text" labelAlign="left" width="100%"
              value="已断线"
              cls="disable_text"
              textAlign="right"/>
            <TextField disabled label={Intl.get('External address')+"："}
              labelTextAlign="text" labelAlign="left" width="100%"
              value="--"
              cls="disable_text"
              textAlign="right"/>

            </Container>
          </div>


        </div>
      </div>
    );
  }

}

export default IPv6TunnelComp;
