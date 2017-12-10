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
              <Container title="安全性" cls="security_tab" scrollable={true}>
                <div style={{margin:'20px'}}>安全性
                </div>
              </Container>
              <Container title="防火墙" cls="firewall_tab" scrollable={true}>
                  <div className="">
                    防火墙
                  </div>
              </Container>
              <Container title="自动封锁" cls="autoLock_tab" scrollable={true}>
                  <div className="">
                    自动封锁
                  </div>
              </Container>
              <Container title="证书" cls="license_tab" scrollable={true}>
                  <CertificateComp/>
              </Container>

              <Container title="DHCP保留" cls="DHCP_tab" scrollable={true}>
                  <div className="">
                    DHCP客户端
                  </div>
              </Container>

              <Container title="IPTV和VoIP" cls="IPTV_tab" scrollable={true}>
                  <div className="">
                    IPTV和VoIP
                  </div>
              </Container>

            </TabPanel>
        </div>
    )
  }
}


//证书
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

        </div>
    );
  }
}
