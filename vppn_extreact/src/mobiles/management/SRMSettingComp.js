
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
        <Container layout="vbox" padding="10 10 10 10">
          <Panel layout="vbox">
            <div>终端机</div>
            <Container flex={1}>
              <div style={{'float':'left'}}><CheckBoxField boxLabel={Intl.get('Enable SSH Functionality')}/></div>
              <TextField label={Intl.get('Port')+"："} labelTextAlign="left" labelAlign="left" value="8000" width="80%"/>
            </Container>
          </Panel>
          <Panel layout="vbox">
            <div>SNMP</div>

          </Panel>

        </Container>
      </div>
    );
  }

}

export default SRMSettingComp;
