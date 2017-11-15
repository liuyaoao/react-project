
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,FieldSet,TitleBar,Button, TabPanel,FormPanel, Panel,TextField } from '@extjs/ext-react';

class VlanSettingMB extends Component{
  state = {
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
    let {bodyHeight} = this.state;
    return (
      <div className='' style={{height:(bodyHeight-45)+"px"}}>
        <TabPanel cls='tabpanel_m tabpanel_bottom_m'
            height={'100%'}
            tabBar={{ docked: 'bottom' }} scrollable={true}
        >
            <Container title={Intl.get('Setting')} padding="10 10 60 10">
                <FieldSet title={Intl.get('Manage Server')+'1'}>
                    <TextField labelAlign="left" ui="disabled-ui" label={Intl.get('Address')+':'} value="" disabled/>
                    <TextField labelAlign="left" ui="disabled-ui" label={Intl.get('Port')+':'} value="8001" disabled/>
                </FieldSet>
                <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
                    <Button text={Intl.get('test')} ui={'confirm raised'} style={{marginRight:'10px'}}></Button>
                    <Button text={Intl.get('save')} ui={'action alt'} style={{marginLeft:'10px'}}></Button>
                </Container>

                <FieldSet title={Intl.get('Manage Server')+'2'}>
                    <TextField labelAlign="left" ui="disabled-ui" label={Intl.get('Address')+':'} value="" disabled/>
                    <TextField labelAlign="left" ui="disabled-ui" label={Intl.get('Port')+':'} value="8001" disabled/>
                </FieldSet>
                <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
                    <Button text={Intl.get('test')} ui={'confirm raised'} style={{marginRight:'10px'}}></Button>
                    <Button text={Intl.get('save')} ui={'action alt'} style={{marginLeft:'10px'}}></Button>
                </Container>

                <FieldSet title={Intl.get('Manage Goal')}>
                    <TextField labelAlign="left" ui="disabled-ui" label={Intl.get('Address')+':'} value="" disabled/>
                </FieldSet>
                <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
                    <Button text={Intl.get('save')} ui={'action alt'}></Button>
                </Container>

                <FieldSet title={Intl.get('System log')}>
                    <TextField labelAlign="left" ui="disabled-ui" label={Intl.get('Address')+':'} value="" disabled/>
                    <TextField labelAlign="left" ui="disabled-ui" label={Intl.get('Level')+':'} value="" disabled/>
                </FieldSet>
                <Container layout={{type:'hbox',pack:'center',align:'bottom'}} margin="10 10 10 10">
                    <Button text={Intl.get('Enable')} ui={'action alt'}></Button>
                </Container>
            </Container>
            {/* 可设置右上角的标记文本：badgeText="4" */}
            <Container title={Intl.get("vPath packs")} padding="10 10 60 10">

            </Container>
            <Container title="payment" padding="10 10 10 10">
                <div>Badges <em>(like the 4, below)</em> can be added by setting the <code>badgeText</code> prop.</div>
            </Container>
        </TabPanel>
      </div>

    );
  }

}

export default VlanSettingMB;
