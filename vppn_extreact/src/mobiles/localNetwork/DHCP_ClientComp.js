
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,TextField } from '@extjs/ext-react';

class DHCP_ClientComp extends Component{
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
        <Container layout="vbox" padding="10 10 10 10">
          <FormPanel>
            <TextField labelAlign="left" ui="disabled-ui" label={Intl.get('System Name')+':'} value="SynologyRouter" disabled/>
            <FieldSet title={Intl.get('Default Port Number')}>
                <TextField labelAlign="left" ui="disabled-ui" label={Intl.get('HTTP')+':'} value="8000" disabled/>
                <TextField labelAlign="left" ui="disabled-ui" label={Intl.get('HTTPS')+':'} value="8001" disabled/>
            </FieldSet>
          </FormPanel>

        </Container>
      </div>
    );
  }

}

export default DHCP_ClientComp;
