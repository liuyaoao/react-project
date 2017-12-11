import React,{Component} from 'react';
import Intl from '../../intl/Intl';

import { TabPanel, Container, FormPanel,TextField,
  FieldSet, SelectField,Button,Menu,MenuItem,Grid,
  Column,ToggleField   } from '@extjs/ext-react';
Ext.require('Ext.field.InputMask');
Ext.require('Ext.Toast');

export default class FlowCtrlContent extends Component {
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
        <div className='flowCtrl_content' style={{height:'100%'}}>
          <TabPanel cls='flowCtrl_tabPanel'
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
              <Container title={Intl.get('Routine Setting')} cls="" scrollable={true}>
                <div style={{padding:'10px'}}>
                  <Container layout={{type:'hbox',pack:'start',align:'bottom',marginBottom:'10px'}}>
                    <Button text={Intl.get('Add New')} ui="confirm raised" style={{marginRight:'10px'}}/>
                    <Button text={Intl.get('Edit')} ui="confirm raised" style={{marginRight:'10px'}}/>
                    <Button text={Intl.get('Delete')} ui="decline raised"/>
                  </Container>
                  <Container height={'300px'} margin="10 0 10 0">
                    <Grid store={this.dataStore} shadow grouped style={{minHeight:'500px'}} scrollable={true}>
                        <Column text={Intl.get('Device List')} width="100" dataIndex="name"/>
                        <Column text={"IP "+Intl.get('Address')} width="120" dataIndex="price"/>
                        <Column text={Intl.get('Beamforming(0/6)')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('Disable')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('Custom Speed')} width="100" dataIndex="priceChange"/>
                        <Column text={Intl.get('High Priority')+'(0/3)'} width="100" dataIndex="priceChange"/>
                    </Grid>
                  </Container>
                </div>
              </Container>
              {/* 可设置右上角的标记文本：badgeText="4" */}
              <Container title={Intl.get('Advanced Setting')} scrollable={true}>
                  <div>Badges <em>(like the 4, below)</em> can be added by setting the <code>badgeText</code> prop.</div>
              </Container>

              <Container title={Intl.get('Monitor')} scrollable={true}>
                  <div>Badges <em>(like the 4, below)</em> can be added by setting the <code>badgeText</code> prop.</div>
              </Container>
            </TabPanel>
        </div>
    )
  }
}
