
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,
  TextField,ContainerField,CheckBoxField } from '@extjs/ext-react';

class IPTV_And_VoIP_Comp extends Component{
  state = {
    bodyHeight:500,
    bodyWidth:'100%',
    maskNumber:"1",
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
    let {maskNumber} = this.state;
    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <Container layout="vbox">
            <Container flex={1}>
              <div style={{'float':'left'}}>
                <CheckBoxField boxLabel={'Enable '+Intl.get('IPTV/VoIP')} cls="black_label"/>
              </div>
            </Container>
            <ContainerField label={Intl.get('Mode')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
              <Button ui="menu raised" text={'IPTV/VoIP '+Intl.get('Configuration')} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                 <Menu defaults={{ handler: this.onMaskNumberChange, group: 'buttonstyle' }}>
                     <MenuItem text={'IPTV/VoIP '+Intl.get('Configuration')} value="1" iconCls={maskNumber === '1' && 'x-font-icon md-icon-check'}/>
                     <MenuItem text="12334556" value="2" iconCls={maskNumber === '2' && 'x-font-icon md-icon-check'}/>
                 </Menu>
              </Button>
            </ContainerField>
            <ContainerField label={'ISP '+Intl.get('Configuration')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
              <Button ui="menu raised" text={"M1-Fiber"} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                 <Menu defaults={{ handler: this.onMaskNumberChange, group: 'buttonstyle' }}>
                     <MenuItem text="M1-Fiber" value="1" iconCls={maskNumber === '1' && 'x-font-icon md-icon-check'}/>
                     <MenuItem text="M2-Fiber" value="2" iconCls={maskNumber === '2' && 'x-font-icon md-icon-check'}/>
                 </Menu>
              </Button>
            </ContainerField>
          </Container>
        </div>
      </div>
    );
  }

}

export default IPTV_And_VoIP_Comp;
