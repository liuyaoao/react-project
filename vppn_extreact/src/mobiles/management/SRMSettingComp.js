
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet,TextField, CheckBoxField,TabPanel,FormPanel, Panel } from '@extjs/ext-react';

class SRMSettingComp extends Component{
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
          <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
            <TextField label={Intl.get('System Name')+"："}
              labelTextAlign="text" labelAlign="left" width="100%"
              value="192.168.1.1"
              cls="black_label auto_width disable_text"
              textAlign="right"/>
            <FieldSet title={Intl.get('Default Port Number')} width="100%" margin="10 0 0 0">
              <Container style={{width:'90%',marginLeft:'10%'}}>
                <TextField label={Intl.get('HTTP')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <TextField label={Intl.get('HTTPS')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
              </Container>
            </FieldSet>
            <CheckBoxField
              boxLabel={Intl.get('Redirect the HTTP connection automatically to HTTPS')}
              cls="black_label"/>
            <div>{Intl.get('You can import certificates on the certificate page.')}</div>
            <CheckBoxField boxLabel={Intl.get('Enable')+' HSTS'} cls="black_label fl_lf"/>
            <div style={{marginLeft:'20px'}}>{Intl.get('Enabling HSTS will force browsers to use secure connections.')}</div>
            <CheckBoxField boxLabel={Intl.get('Enable Windows network discovery')} cls="black_label fl_lf"/>
            <div style={{marginLeft:'20px'}}>{Intl.get('After this option is enabled,Windows network discovery will be able to search the Router.')}</div>
            <CheckBoxField boxLabel={Intl.get('Allow external access to SRM')} cls="black_label fl_lf"/>
            <div style={{marginLeft:'20px'}}>{Intl.get('Starting this option allows external access to SRM through HTTP/HTTPS ports (such as: 8000 and 8001).')}</div>
          </Container>
          
          <Container layout={{type:'hbox',pack:'center',aglin:'bottom'}} margin="10 10 10 10">
            <Button text={Intl.get('Apply')} ui="confirm alt" style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Reset')} ui="decline alt" style={{marginLeft:'10px'}}/>
          </Container>

        </div>
      </div>
    );
  }

}

export default SRMSettingComp;
