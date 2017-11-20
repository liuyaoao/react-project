
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,TextField,CheckBoxField } from '@extjs/ext-react';

class DDNS_Comp extends Component{
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
          <Container shadow padding="10 10 10 10">
            <FieldSet title={Intl.get('Connect to your router everywhere')} >
                <TextField disabled label={"DNS "+Intl.get('Server')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="disable_text"
                  textAlign="right"/>
                <TextField disabled label={"DNS "+Intl.get('Server')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="disable_text"
                  textAlign="right"/>
                <TextField disabled label={"DNS "+Intl.get('Server')+"："}
                  labelTextAlign="text" labelAlign="left" width="100%"
                  value="192.168.1.1"
                  cls="disable_text"
                  textAlign="right"/>
            </FieldSet>
          </Container>

          <div className="cnt" style={{marginTop:'10px'}}>
            <div className="title">{Intl.get('QuickConnect')}</div>
            <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
              <div>{Intl.get('Internet_DDNS_desc')}</div>
              <CheckBoxField boxLabel={Intl.get('Enable')+' QuickConnect'} cls="black_label"/>
              <Container layout={{ type: 'hbox', pack:'left',align:'left'}}>
                <TextField label={Intl.get('QuickConnect ID')+"："}
                  labelTextAlign="text" labelAlign="left" width="70%"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <Button ui="confirm raised" text={Intl.get('Advanced Setting')} style={{marginRight:'10px'}}/>
              </Container>

            </Container>
          </div>

          <div className="cnt" style={{marginTop:'10px'}}>
            <div className="title">{Intl.get('DDNS')}</div>
            <div style={{margin:'10px 0'}}>{Intl.get('Enable DDNS to enable users to connect to servers with registered host names.')}</div>
            <Container layout={{type:'hbox',pack:'start',align:'left'}} width="100%">
              <Button ui="confirm alt raised" text={Intl.get('Add New')} style={{marginRight:'10px'}}/>
              <Button ui="confirm raised" text={Intl.get('Immediate updates')} style={{marginRight:'10px'}}/>
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

export default DDNS_Comp;
