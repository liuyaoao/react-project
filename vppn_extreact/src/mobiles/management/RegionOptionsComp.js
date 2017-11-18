
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel,
   Panel,ContainerField,TextField,Label } from '@extjs/ext-react';

class RegionOptionsComp extends Component{
  state = {
    bodyHeight:500,
    bodyWidth:'100%',
    timeZone:'(GMT+08:00)Beijing',
    serverAddr:'www.dragon.com',
  }
  componentDidMount(){
    this.setState({
      bodyHeight:document.documentElement.clientHeight,
      bodyWidth:document.documentElement.clientWidth
    });
  }
  componentWillUnmount () {
  }

  onTimeZoneChange = (item)=>{
    this.setState({timeZone:item.value});
  }
  onServerAddrChange = (item)=>{
    this.setState({serverAddr:item.value});
  }

  render () {
    let {timeZone,serverAddr} = this.state;
    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <div className="cnt">
            <div className="title">{Intl.get('Present Time')}</div>
            <FieldSet title="Fri Nov 18:21:35 2017" >
              <ContainerField label={Intl.get('Time Zone')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                <Button ui="menu raised" text={timeZone} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onTimeZoneChange, group: 'buttonstyle' }}>
                       <MenuItem text="225.225.225.0" value="225.225.225.0" iconCls={timeZone === '225.225.225.0' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text="225.225.225.0" value="225.225.225.3" iconCls={timeZone === '225.225.225.3' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
              <ContainerField label={Intl.get('Server Address')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                <Button ui="menu raised" text={serverAddr} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onServerAddrChange, group: 'buttonstyle' }}>
                       <MenuItem text="225.225.225.0" value="225.225.225.0" iconCls={serverAddr === '225.225.225.0' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text="225.225.225.0" value="225.225.225.3" iconCls={serverAddr === '225.225.225.3' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
              <div style={{width:'80%',textAlign:'center',margin:'10px auto'}}>
                <Button ui="confirm raised" text={Intl.get('Immediate updates')}/>
              </div>
            </FieldSet>
          </div>
          {/* 国家*/}
          <div className="cnt">
            <div className="title">{Intl.get('Country')}</div>
            <div >{Intl.get('choose_country_desc')}</div>
            <div style={{marginTop:'10px'}}><Label html={Intl.get('choose_country_hint')}/></div>
            <FieldSet>
              <ContainerField label={Intl.get('Country')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                <Button ui="menu raised" text={Intl.get('China')} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onServerAddrChange, group: 'buttonstyle' }}>
                       <MenuItem text={Intl.get('China')} value="225.225.225.0" iconCls={serverAddr === '225.225.225.0' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text={Intl.get('Others')} value="225.225.225.3" iconCls={serverAddr === '225.225.225.3' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
            </FieldSet>
          </div>
          {/* 界面显示语言*/}
          <div className="cnt" style={{padding:'10px'}}>
            <div className="title">{Intl.get('Interface display language')}</div>
            <div >{Intl.get('choose_language_desc')}</div>
            <FieldSet>
              <ContainerField label={Intl.get('Interface display language')+':'} cls="black_label auto_width disable_text" width="100%" layout={'hbox'} labelAlign="left" labelTextAlign="left">
                <Button ui="menu raised" text={Intl.get('Chinese')} style={{width:'100%','float':'left'}} textAlign="right" menuAlign="tr-br">
                   <Menu defaults={{ handler: this.onServerAddrChange, group: 'buttonstyle' }}>
                       <MenuItem text={Intl.get('Chinese')} value="225.225.225.0" iconCls={serverAddr === '225.225.225.0' && 'x-font-icon md-icon-check'}/>
                       <MenuItem text={Intl.get('English')} value="225.225.225.3" iconCls={serverAddr === '225.225.225.3' && 'x-font-icon md-icon-check'}/>
                   </Menu>
                </Button>
              </ContainerField>
            </FieldSet>
          </div>
          <Container layout={{type:'hbox',pack:'center',aglin:'bottom'}} margin="10 10 10 10">
            <Button text={Intl.get('Apply')} ui="confirm alt" style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Reset')} ui="decline alt" style={{marginLeft:'10px'}}/>
          </Container>
        </div>
      </div>
    );
  }

}

export default RegionOptionsComp;
