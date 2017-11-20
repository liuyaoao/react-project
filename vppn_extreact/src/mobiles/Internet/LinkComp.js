
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,TextField,ContainerField } from '@extjs/ext-react';

class LinkComp extends Component{
  state = {
    bodyHeight:500,
    bodyWidth:'100%',
    connectionType:'Automatic',
    defaultGateway:'Enabled',
    jumboFrame:'Enabled',

  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount () {
  }

  onConnectionTypeChange = (item)=>{ //设置连接类型
    this.setState({ connectionType: item.value});
  }
  onDefaultGatewayChange = (item)=>{ //是否设置为默认网关
    this.setState({ defaultGateway:item.value});
  }
  onJumboFrameChange = (item)=>{ //是否启动 Jumbo Frame
    this.setState({jumboFrame:item.value});
  }

  render () {
    let {connectionType,defaultGateway,jumboFrame} = this.state;
    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <div>{Intl.get('You can set up the Internet connection here. Your connection type is determined by the network environment. Please consult ISP to get the help you need.')}</div>
          <Container layout={{type:'vbox',pack:'space-between',align:'stretch'}}>
              <ContainerField label={Intl.get('Connection Type')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                <Button ui="menu raised" text={Intl.get(connectionType)} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onConnectionTypeChange, group: 'buttonstyle' }}>
                       <MenuItem text={Intl.get('Automatic')} value="Automatic" iconCls={connectionType === 'Automatic' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text={Intl.get('Manual')} value="Manual" iconCls={connectionType === 'Manual' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
              <ContainerField label={Intl.get('Set as default gateway')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                <Button ui="menu raised" text={Intl.get(defaultGateway)} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onDefaultGatewayChange, group: 'buttonstyle' }}>
                       <MenuItem text={Intl.get('Enabled')} value="Enabled" iconCls={defaultGateway === 'Enabled' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text={Intl.get('Disabled')} value="Disabled" iconCls={defaultGateway === 'Disabled' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
              <TextField label={"DNS "+Intl.get('Server')+"："}
                labelTextAlign="text" labelAlign="left" width="100%"
                value="192.168.1.1"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <ContainerField label={Intl.get('Enable')+' Jumbo Frame:'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                <Button ui="menu raised" text={Intl.get(jumboFrame)} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onJumboFrameChange, group: 'buttonstyle' }}>
                       <MenuItem text={Intl.get('Enabled')} value="Enabled" iconCls={jumboFrame === 'Enabled' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text={Intl.get('Disabled')} value="Disabled" iconCls={jumboFrame === 'Disabled' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>

              <Button text={'ISP '+Intl.get('Setting')} ui="confirm raised" width="90%" style={{margin:'10px 5% 10px 5%'}}/>
              <Button text={'ISP '+Intl.get('Setting')+'('+Intl.get('IPTV And VoIP')+')'} ui="confirm raised" width="90%" style={{margin:'0 5% 10px 5%'}}/>
              <Button text={'VPN '+Intl.get('Setting')} ui="confirm raised" width="90%" style={{margin:'0 5% 10px 5%'}}/>
              <Button text={'IPv6 '+Intl.get('Setting')} ui="confirm raised" width="90%" style={{margin:'0 5% 10px 5%'}}/>
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

export default LinkComp;
