
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,ContainerField,
  TextField,CheckBoxField } from '@extjs/ext-react';

class RoutineComp extends Component{
  state = {
    bodyHeight:500,
    bodyWidth:'100%',
    DHCPServerOn:'1', //1 表示启动， 0 表示关闭
    maskNumber:'225.225.225.0',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount () {
  }

  onMaskNumberChange = (item)=>{
    this.setState({ maskNumber:item.value });
  }

  onDHCPServerChange = (item)=>{
    this.setState({ DHCPServerOn:item.value });
  }

  render () {
    let {maskNumber,DHCPServerOn} = this.state;
    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <div className="cnt">
            <div className="title">{Intl.get('Local')} IP</div>
            <Container layout="vbox">
              <TextField label={"IP "+Intl.get('Address')+"："} labelTextAlign="text" labelAlign="left" value="192.168.1.1" cls="black_label auto_width disable_text" textAlign="right"/>
              <ContainerField label={Intl.get('Mask')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                <Button ui="menu raised" text={maskNumber} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onMaskNumberChange, group: 'buttonstyle' }}>
                       <MenuItem text="225.225.225.0" value="225.225.225.0" iconCls={maskNumber === '225.225.225.0' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text="225.225.225.0" value="225.225.225.3" iconCls={maskNumber === '225.225.225.3' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
            </Container>
          </div>
          <div className="cnt">
            <div className="title">DHCP {Intl.get('Server')}</div>
            <Container layout="vbox" >
                <ContainerField label={'DHCP '+Intl.get('Server')+"："} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                  <Button ui="menu" text={Intl.get('Enabled')} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                     <Menu defaults={{ handler: this.onDHCPServerChange, group: 'buttonstyle' }}>
                         <MenuItem text={Intl.get('Enabled')} value="1" iconCls={DHCPServerOn === '1' && 'x-font-icon md-icon-check'}/>
                         <MenuItem text={Intl.get('Closed')} value="0" iconCls={DHCPServerOn === '0' && 'x-font-icon md-icon-check'}/>
                     </Menu>
                  </Button>
                </ContainerField>
                <TextField label={Intl.get('Start IP Address')+"："}
                  labelTextAlign="text" labelAlign="left"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <TextField label={Intl.get('End IP Address')+"："}
                  labelTextAlign="text" labelAlign="left"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <TextField label={Intl.get('Rent Address Time(Unit s)')+"："}
                  labelTextAlign="text" labelAlign="left"
                  value="12134"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <TextField label={Intl.get('Gateway')+"："}
                  labelTextAlign="text" labelAlign="left"
                  value="225.225.225.0"
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <TextField label={'DHCP '+Intl.get('Server')+"："}
                  labelTextAlign="text" labelAlign="left"
                  value=""
                  cls="black_label auto_width disable_text"
                  textAlign="right"/>
                <ContainerField label={Intl.get('Transfer to known DHCP Server')+"："} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                  <Button ui="menu" text={Intl.get('Enabled')} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                     <Menu defaults={{ handler: this.onDHCPServerChange, group: 'buttonstyle' }}>
                         <MenuItem text={Intl.get('Enabled')} value="1" iconCls={DHCPServerOn === '1' && 'x-font-icon md-icon-check'}/>
                         <MenuItem text={Intl.get('Disabled')} value="0" iconCls={DHCPServerOn === '0' && 'x-font-icon md-icon-check'}/>
                     </Menu>
                  </Button>
                </ContainerField>
                <Container flex={1}>
                  <div style={{'float':'left'}}>
                    <CheckBoxField boxLabel={Intl.get('Enable web proxy server to automatically discover')} cls="black_label"/>
                  </div>
                </Container>
                <TextField label={Intl.get('Website')+"："}
                  labelTextAlign="text" labelAlign="left" textAlign="right"
                  value=""
                  cls="black_label auto_width disable_text"/>
                <ContainerField label={Intl.get('Enable')+" UPnP："}
                  cls="black_label auto_width disable_text"
                  width="100%" layout={'hbox'}
                  labelAlign="left" labelTextAlign="left">
                  <Button ui="menu" text={Intl.get('Enabled')} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                     <Menu defaults={{ handler: this.onDHCPServerChange, group: 'buttonstyle' }}>
                         <MenuItem text={Intl.get('Enabled')} value="1" iconCls={DHCPServerOn === '1' && 'x-font-icon md-icon-check'}/>
                         <MenuItem text={Intl.get('Disabled')} value="0" iconCls={DHCPServerOn === '0' && 'x-font-icon md-icon-check'}/>
                     </Menu>
                  </Button>
                </ContainerField>

                <Container layout={{type:'hbox',pack:'left',align:'bottom'}} margin="10 10 10 10">
                    <Button text={'UPnP '+Intl.get('Client list')} ui={'confirm alt'} />
                </Container>
                <ContainerField label={Intl.get('Enable PPPoE relay')+"："}
                  cls="black_label auto_width disable_text"
                  width="100%" layout={'hbox'}
                  labelAlign="left" labelTextAlign="left">
                  <Button ui="menu" text={Intl.get('Enabled')} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                     <Menu defaults={{ handler: this.onDHCPServerChange, group: 'buttonstyle' }}>
                         <MenuItem text={Intl.get('Enabled')} value="1" iconCls={DHCPServerOn === '1' && 'x-font-icon md-icon-check'}/>
                         <MenuItem text={Intl.get('Disabled')} value="0" iconCls={DHCPServerOn === '0' && 'x-font-icon md-icon-check'}/>
                     </Menu>
                  </Button>
                </ContainerField>

            </Container>
          </div>

          <div className="cnt">
            <div className="title">{Intl.get('Guest')+' DHCP '+Intl.get('Server')}</div>
            <Container layout="vbox">
                <TextField label={Intl.get('Start IP Address')+"："}
                  labelTextAlign="text" labelAlign="left" textAlign="right"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"/>
                <TextField label={Intl.get('End IP Address')+"："}
                  labelTextAlign="text" labelAlign="left" textAlign="right"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"/>
                <TextField disabled label={Intl.get('Gateway')+"："}
                  labelTextAlign="text" labelAlign="left" textAlign="right"
                  value="225.225.225.0"
                  cls="black_label auto_width disable_text"/>
            </Container>
          </div>

          <div className="cnt">
            <div className="title">{Intl.get('Advanced Options')}</div>
            <Container layout="vbox">
                <TextField label={Intl.get('Start IP Address')+"："}
                  labelTextAlign="text" labelAlign="left" textAlign="right"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"/>
                <TextField label={Intl.get('End IP Address')+"："}
                  labelTextAlign="text" labelAlign="left" textAlign="right"
                  value="192.168.1.1"
                  cls="black_label auto_width disable_text"/>
                <TextField disabled label={Intl.get('Gateway')+"："}
                  labelTextAlign="text" labelAlign="left" textAlign="right"
                  value="225.225.225.0"
                  cls="black_label auto_width disable_text"/>
            </Container>
          </div>

          <Container layout={{type:'hbox',pack:'center',align:'top'}} margin="10 10 10 10">
              <Button text={Intl.get('Apply')} ui={'confirm alt'} style={{marginRight:'10px'}}/>
              <Button text={Intl.get('Reset')} ui={'decline alt'} style={{marginLeft:'10px'}}/>
          </Container>
        </div>
      </div>
    );
  }

}

export default RoutineComp;
