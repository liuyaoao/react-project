
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,
  TextField,CheckBoxField,ContainerField,RadioField } from '@extjs/ext-react';

class IPv6Comp extends Component{
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
          <Container layout="vbox" >
              <Container flex={1}>
                <div style={{'float':'left'}}>
                  <CheckBoxField boxLabel={Intl.get('Enable ')+'IPv6'} cls="black_label"/>
                </div>
              </Container>
              <ContainerField label={Intl.get('Prefix')+"："}
                cls="black_label auto_width disable_text"
                width="100%"
                layout={'hbox'}
                labelAlign="left" labelTextAlign="left">
                <Button ui="menu" text={Intl.get('123.456.213')}
                  style={{width:'100%','float':'left'}}
                  textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onDHCPServerChange, group: 'buttonstyle' }}>
                       <MenuItem text={Intl.get('123.456.213')} value="1" iconCls={DHCPServerOn === '1' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text={Intl.get('123.456.213')} value="0" iconCls={DHCPServerOn === '0' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
              <TextField label={Intl.get('Main')+" DNS："}
                labelTextAlign="text" labelAlign="left"
                value="192.168.1.1"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <TextField label={Intl.get('Sub')+" DNS："}
                labelTextAlign="text" labelAlign="left"
                value="192.168.1.1"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <FormPanel layout={{type:'vbox',pack:'center',align:'left'}} padding="0">
                <RadioField {...radioProps} boxLabel={Intl.get('Stateless mode')} value="checked1" checked/>
                <RadioField {...radioProps} boxLabel={Intl.get('Stateless DHCPv6 mode')} value="checked2"/>
                <RadioField {...radioProps} boxLabel={Intl.get('State mode')} value="checked3"/>
              </FormPanel>
              <TextField label={Intl.get('Start IP Address')+"："}
                labelTextAlign="text" labelAlign="left"
                value="225.225.225.0"
                cls="black_label auto_width disable_text"
                textAlign="right"/>
              <TextField label={Intl.get('End IP Address')+"："}
                labelTextAlign="text" labelAlign="left"
                value=""
                cls="black_label auto_width disable_text"
                textAlign="right"/>

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

export default IPv6Comp;
