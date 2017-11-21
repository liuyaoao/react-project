
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindconfirmCreators} = require('redux');
import { Container,FieldSet,TitleBar,Button, TabPanel,FormPanel, Panel,TextField,
        Menu,MenuItem,ContainerField } from '@extjs/ext-react';

class VlanSettingMB extends Component{
  state = {
    packsType:'1',
    syslogAddress:'',
    syslogLevel:'1',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount () {
  }
  onVPathPacksChanged = (item)=>{
    this.setState({ packsType:item.value });
  }
  onSyslogAddressChanged = (item)=>{
    this.setState({syslogAddress:item.value});
  }
  onSyslogLevelChanged = (item)=>{
    this.setState({syslogLevel:item.value});
  }

  render () {
    let {bodyHeight,packsType,syslogAddress,syslogLevel} = this.state;
    return (
      <div className='' style={{height:(bodyHeight-45)+"px"}}>
        <TabPanel cls='tabpanel_m tabpanel_bottom_m'
            height={'100%'}
            tabBar={{ docked: 'bottom' }} scrollable={true}
        >
            <Container title={Intl.get('Setting')} padding="10 10 60 10">
                <Container shadow padding="10 10 10 10">
                  <FieldSet title={Intl.get('Manage Server')+'1'}>
                      <TextField labelAlign="left" cls="disable_text" label={Intl.get('Address')+':'} value="192.168.9.67" textAlign="right"/>
                      <TextField labelAlign="left" cls="disable_text" label={Intl.get('Port')+':'} value="8001" textAlign="right"/>
                  </FieldSet>
                  <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
                      <Button text={Intl.get('test')} ui={'confirm raised'} style={{marginRight:'10px'}}></Button>
                      <Button text={Intl.get('save')} ui={'confirm alt'} style={{marginLeft:'10px'}}></Button>
                  </Container>
                </Container>

                <Container shadow padding="10 10 10 10" margin="10 0 0 0">
                  <FieldSet title={Intl.get('Manage Server')+'2'}>
                      <TextField labelAlign="left" cls="disable_text" label={Intl.get('Address')+':'} value="192.168.9.67" textAlign="right"/>
                      <TextField labelAlign="left" cls="disable_text" label={Intl.get('Port')+':'} value="8001" textAlign="right"/>
                  </FieldSet>
                  <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
                      <Button text={Intl.get('test')} ui={'confirm raised'} style={{marginRight:'10px'}}></Button>
                      <Button text={Intl.get('save')} ui={'confirm raised'} style={{marginLeft:'10px'}}></Button>
                  </Container>
                </Container>

                <Container shadow padding="10 10 10 10" margin="10 0 0 0">
                  <FieldSet title={Intl.get('Management Goal')}>
                      <ContainerField label={Intl.get('Address')+':'} cls="black_label auto_width disable_text" width="100%" labelAlign="left" textAlign="right">
                        <Button ui="menu" text="1" style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                           <Menu defaults={{ handler: this.onSyslogLevelChanged, group: 'buttonstyle' }}>
                               <MenuItem text="1" value="1" iconCls={syslogLevel === '1' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="2" value="2" iconCls={syslogLevel === '2' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="3" value="3" iconCls={syslogLevel === '3' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </ContainerField>
                  </FieldSet>
                  <Container layout={{type:'hbox',pack:'left',align:'bottom'}} margin="10 10 10 10">
                      <Button text={Intl.get('save')} ui={'confirm raised'}></Button>
                  </Container>
                </Container>

                <Container shadow padding="10 10 10 10" margin="10 0 0 0">
                  <FieldSet title={Intl.get('System log')}>
                      <ContainerField label={Intl.get('Address')+':'} cls="black_label auto_width disable_text" width="100%" labelAlign="left" textAlign="right" >
                        <Button ui="menu" text="220.168.30.12" style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                           <Menu defaults={{ handler: this.onSyslogAddressChanged, group: 'buttonstyle' }}>
                               <MenuItem text="220.168.30.12" value="1" iconCls={syslogAddress === '1' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="220.168.30.1" value="2" iconCls={syslogAddress === '2' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </ContainerField>
                      <ContainerField label={Intl.get('Level')+':'} cls="black_label auto_width disable_text" width="100%" labelAlign="left" textAlign="right">
                        <Button ui="menu" text="1" style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                           <Menu defaults={{ handler: this.onSyslogLevelChanged, group: 'buttonstyle' }}>
                               <MenuItem text="1" value="1" iconCls={syslogLevel === '1' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="2" value="2" iconCls={syslogLevel === '2' && 'x-font-icon md-icon-check'}/>
                               <MenuItem text="3" value="3" iconCls={syslogLevel === '3' && 'x-font-icon md-icon-check'}/>
                           </Menu>
                        </Button>
                      </ContainerField>
                  </FieldSet>
                  <Container layout={{type:'hbox',pack:'left',align:'bottom'}} margin="10 10 10 10">
                      <Button text={Intl.get('Enable')} ui={'confirm raised'}></Button>
                  </Container>
                </Container>

            </Container>
            {/* 可设置右上角的标记文本：badgeText="4" */}
            <Container title={Intl.get("vPath packs")} padding="10 10 60 10">
                <FieldSet title={Intl.get('vPathPacks_title')}
                  layout={{type:'vbox',pack:'center',align: 'stretch'}}
                  defaults={{labelAlign: "placeholder"}}>
                  <ContainerField  cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left" textAlign='right'>
                    <Button ui="menu" text="China2World" style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                       <Menu defaults={{ handler: this.onVPathPacksChanged, group: 'buttonstyle' }}>
                           <MenuItem text="China2World" value="1" iconCls={packsType === '1' && 'x-font-icon md-icon-check'}/>
                           <MenuItem text="World2China" value="2" iconCls={packsType === '2' && 'x-font-icon md-icon-check'}/>
                       </Menu>
                    </Button>
                  </ContainerField>
                  <Container style={{marginTop:'20px'}}>
                    <textarea style={{width:'100%',minHeight:'200px',border:'1px solid #a0cdd6'}} />
                    <Button text={Intl.get('save')} ui={'confirm raised'} style={{'textAlign':'center',marginTop:'10px'}}></Button>
                  </Container>
                </FieldSet>
            </Container>
            <Container title={Intl.get('payment')} padding="10 10 60 10">
                <div className="confirm" style={{margin:'10px'}}>{Intl.get("Expiration date")}：2020-11-09</div>
                <div style={{margin:'10px'}}>{Intl.get("Please click to pay")}：<span> PayPal</span></div>
            </Container>
        </TabPanel>
      </div>

    );
  }

}

export default VlanSettingMB;
