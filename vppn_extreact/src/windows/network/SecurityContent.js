import React,{Component} from 'react';
import Intl from '../../intl/Intl';
import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,CheckColumn,ToggleField,CheckBoxField,ContainerField   } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class SecurityContent extends Component {
    state={
      wifi5GSwitch:true,
      menuItemVal:'',
      selectedBootsNode:'220.168.30.12',
    }
    onAddTypeChange = (item)=>{
      this.setState({menuItemVal:item.value});
    }
    onBootsNodeSelectChanged = (field, newValue)=>{
      this.setState({ selectedBootsNode:newValue });
      Ext.toast(`You selected the item with value ${newValue}`);
    }
    onClickWifi5GSwitch = (e)=>{
      console.log("点击了wifi 5GHz开关：",e);
      this.setState( {wifi5GSwitch:!this.state.wifi5GSwitch} );
    }
    render(){
      let {menuItemVal,selectedBootsNode} = this.state;

      return (
        <div className='security_content' style={{height:'100%'}}>
          <TabPanel cls='tabpanel_pc security_tabPanel'
            height={'100%'}
            defaults={{
                cls: "card",
                // layout: "center",
                tab: {
                    flex: 0,
                    minWidth: 100
                }
            }}
            tabBar={{
                layout: {
                    pack: 'left'
                }
            }}
          >
              <Container title={Intl.get('Security')} cls="security_tab" scrollable={true}>
                  <SecurityComp/>
              </Container>
              <Container title={Intl.get('Firewall')} cls="firewall_tab" scrollable={true}>
                  <FirewallComp/>
              </Container>
              <Container title={Intl.get('Auto Block')} cls="autoLock_tab" scrollable={true}>
                  <AutoBlockComp/>
              </Container>
              <Container title={Intl.get('Certificate')} cls="license_tab" scrollable={true}>
                  <CertificateComp/>
              </Container>
            </TabPanel>
        </div>
    )
  }
}

//安全性
class SecurityComp extends Component{
  state = {
  }
  componentDidMount(){
  }
  render () {
    return (
      <div style={{padding:'10px'}}>
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
      </div>
    );
  }
}

//防火墙
class FirewallComp extends Component{
  state = {
  }
  dataStore = new Ext.data.Store({
      data: [
        {index:1, name:' Wireless',price:'342.54', priceChange:'mif-wifi-connect icon'},
        {index:2, name:' Internet',price:'342.54', priceChange:'mif-earth icon'}
      ],
      sorters: 'name'
  })
  componentDidMount(){
  }
  render () {
    return (
        <div style={{padding:'10px'}}>
          <Container layout={{type:'hbox',pack:'left',aglin:'bottom'}} margin="10 0 0 0">
            <Button text={Intl.get('Add')} ui="confirm raised" style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Edit')} ui="decline raised" style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Delete')} ui="decline raised" style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Save')} ui="decline raised" style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Up')} ui="decline raised" style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Down')} ui="decline raised" style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Setting')} ui="decline raised" style={{marginRight:'10px'}}/>
          </Container>
          <Container margin="10 0 10 0">
            <Grid shadow grouped width="98%"
              store={this.dataStore}
              style={{minHeight:'360px'}}
              >
                <CheckColumn text={Intl.get('Enabled')} width="80" dataIndex="name" groupable={false} sortable={false}/>
                <Column text={Intl.get('Name')} width="100" dataIndex="price"/>
                <Column text={Intl.get('Port')} width="70" dataIndex="priceChange"/>
                <Column text={Intl.get('Communication Protocol')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Source IP')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Target IP')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Operation')} width="100" dataIndex="priceChange"/>
            </Grid>
          </Container>
        </div>
    );
  }
}

//自动封锁
class AutoBlockComp extends Component{
  state = {
  }
  componentDidMount(){
  }
  render () {
    return (
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
        </div>
    );
  }
}


//证书
class CertificateComp extends Component{
  state = {
  }
  componentDidMount(){
  }
  componentWillUnmount () {
  }
  render () {
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

        </div>
    );
  }
}
