
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,
  TextField,CheckBoxField,ContainerField,RadioField } from '@extjs/ext-react';

class CertificateComp extends Component{
  state = {
    bodyHeight:500,
    bodyWidth:'100%',
    DHCPServerOn:"1",
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
    let {DHCPServerOn} = this.state;
    const radioProps = {
        name: 'radios'
    };

    return (
        <div style={{padding:'10px'}}>
          <div className="cnt">
            <div className="title">{Intl.get('Action')}</div>
            <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
              <div style={{marginBottom:'10px'}}>{Intl.get('Create, extend, import, or issue certificates to use this server or other servers.')}</div>
              <Container layout={{type:'hbox',pack:'left',align:'top'}}>
                <Button text={Intl.get('Create Certificate')} ui={'confirm raised'} style={{marginRight:'10px'}}/>
                <Button text={Intl.get('Import Certificate')} ui={'confirm raised'} style={{marginLeft:'10px'}}/>
              </Container>
            </Container>
          </div>

          <div className="cnt" style={{marginTop:'10px'}}>
            <div className="title">{Intl.get('Server Certificate')}</div>
            <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
              <TextField disabled label={Intl.get('State')+"："}
                labelTextAlign="text" labelAlign="left" width="100%"
                value="192.168.1.1"
                cls="disable_text"
                textAlign="right"/>
              <TextField disabled label={Intl.get('Witness')+"："}
                labelTextAlign="text" labelAlign="left" width="100%"
                value="192.168.1.1"
                cls="disable_text"
                textAlign="right"/>
              <TextField disabled label={Intl.get('Issuer')+"："}
                labelTextAlign="text" labelAlign="left" width="100%"
                value="192.168.1.1"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <TextField disabled label={Intl.get('Expiration date')+"："}
                labelTextAlign="text" labelAlign="left" width="100%"
                value="192.168.1.1"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <div style={{margin:'10px 0'}}>{Intl.get('You can export the server certificate and private key of Router.')}</div>
              <Container layout={{type:'hbox',pack:'left',align:'top'}}>
                <Button text={Intl.get('Export Certificate')} ui={'confirm raised'}/>
              </Container>
            </Container>
          </div>

          <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
              <Button text={Intl.get('Apply')} ui={'confirm alt'} style={{marginRight:'10px'}}/>
              <Button text={Intl.get('Reset')} ui={'decline alt'} style={{marginLeft:'10px'}}/>
          </Container>

        </div>
    );
  }

}

export default CertificateComp;
