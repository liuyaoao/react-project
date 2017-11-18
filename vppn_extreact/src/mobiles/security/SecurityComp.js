
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SelectField,ContainerField,Menu,MenuItem, TabPanel,
  FormPanel, Panel,TextField,CheckBoxField } from '@extjs/ext-react';

class SecurityComp extends Component{
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
        <div>{Intl.get('security_desc')}</div>
        <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
          <TextField label={Intl.get('Wait timeout(min)')+"："}
            labelTextAlign="text" labelAlign="left" width="100%"
            value=''
            cls="disable_text"
            textAlign="right"/>
          <CheckBoxField boxLabel={Intl.get('Ignore IP checks to enhance browser compatibility')} cls="black_label"/>
          <div>{Intl.get('Enabling this option provides better compatibility for browsers using proxy servers, but reduces the security level.')}</div>

          <CheckBoxField style={{paddingBottom:'0'}}
            boxLabel={Intl.get('Improve the protection of Cross Site Request Forgery attack.')}
            cls="black_label"/>
          <CheckBoxField style={{paddingTop:'0'}}
            boxLabel={Intl.get('SRM is not allowed to be embedded by iFrame')}
            cls="black_label"/>
          <div>{Intl.get('Allow specific sites to embed SRM using iFrame.')}</div>
          <Button text={Intl.get('Allowed websites')} ui={'confirm raised'} style={{marginTop:'8px'}}/>
        </Container>
        <div className="cnt" style={{marginTop:'10px'}}>
          <div className="title">{Intl.get('Dos Protect')}</div>
          <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
            <div>{Intl.get('Denial of service(Dos) protection helps prevent malicious attacks on Internet.')}</div>
            <CheckBoxField boxLabel={Intl.get('Enable Dos protection')} cls="black_label"/>
          </Container>
        </div>
        <div className="cnt" style={{marginTop:'10px'}}>
          <div className="title">{Intl.get('VPN Pass-through')}</div>
          <Container layout={{type:'vbox',pack:'start',align:'left'}} width="100%">
            <div>{Intl.get('Please select the option according to the VPN protocol used by the VPN client, so that the VPN client traffic can be passed through the router.')}</div>
            <CheckBoxField boxLabel={Intl.get('PPTP Pass-through')} cls="black_label"/>

            
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

export default SecurityComp;
