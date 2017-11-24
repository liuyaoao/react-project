
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,
  TextField,CheckBoxField,ContainerField,RadioField } from '@extjs/ext-react';

class AutoBlockComp extends Component{
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
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <div style={{marginBottom:'10px'}}>{Intl.get('Enable this option to block IP addresses (including through SSH, FTP, WebDAV, mobile applications, File Station and SRM) when login fails several times.')}</div>
          <Container layout="vbox" >
              <Container flex={1}>
                <div style={{'float':'left'}}>
                  <CheckBoxField boxLabel={Intl.get('Enable Auto Black')} cls="black_label"/>
                </div>
              </Container>
              <div>{Intl.get('If the number of logon failures reaches the following settings in the following setup time, the system will automatically block the login IP.')}</div>
              <TextField label={Intl.get('Try login times')+"："}
                labelTextAlign="text" labelAlign="left"
                value="192.168.1.1"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <TextField label={Intl.get('Within a few minutes')+"："}
                labelTextAlign="text" labelAlign="left"
                value="192.168.1.1"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <div style={{'float':'left'}}>
                <CheckBoxField boxLabel={Intl.get('Enable Black Expire')} cls="black_label"/>
              </div>
              <div>{Intl.get('When the expiration function is blocked, the blocked IP will be blocked after the following days.')}</div>

              <TextField label={Intl.get('Blockade Days')+"："}
                labelTextAlign="text" labelAlign="left"
                value="225.225.225.0"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <div style={{margin:'10px 0'}}>{Intl.get('Create and manage the permission list to add your trusted IP address, or create a blocked list to prevent login of a specific IP address.')}</div>

              <Button text={Intl.get('Allow/Block List')} ui={'confirm raised'} style={{marginRight:'10px'}}/>

          </Container>
          <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
              <Button text={Intl.get('Apply')} ui={'confirm alt'} style={{marginRight:'10px'}}/>
              <Button text={Intl.get('Reset')} ui={'decline alt'} style={{marginLeft:'10px'}}/>
          </Container>

        </div>
      </div>
    );
  }

}

export default AutoBlockComp;
