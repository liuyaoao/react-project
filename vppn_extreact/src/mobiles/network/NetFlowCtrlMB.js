
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button, TabPanel,FormPanel, Panel,Grid,Column,RendererCell } from '@extjs/ext-react';

class NetFlowCtrlMB extends Component{
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
            height={'100%'} margin='0 0 60 0'
            tabBar={{ docked: 'bottom' }}
        >
            <Container title={Intl.get('Routine Setting')} >
                <Container layout={{type:'hbox',pack:'start',align:'bottom'}}>
                  <Button text={Intl.get('Add New')} ui="confirm raised" style={{marginRight:'10px'}}/>
                  <Button text={Intl.get('Edit')} ui="confirm raised" style={{marginRight:'10px'}}/>
                  <Button text={Intl.get('Delete')} ui="decline raised"/>
                </Container>
                <Container height={'100%'} margin="10 0 10 0">
                  <Grid store={this.dataStore} shadow grouped style={{minHeight:'500px'}} scrollable={true}>
                      <Column text={Intl.get('Device List')} width="100" dataIndex="name"/>
                      <Column text={"IP "+Intl.get('Address')} width="120" dataIndex="price"/>
                      <Column text={Intl.get('Beamforming(0/6)')} width="100" dataIndex="priceChange"/>
                      <Column text={Intl.get('Disable')} width="100" dataIndex="priceChange"/>
                      <Column text={Intl.get('Custom Speed')} width="100" dataIndex="priceChange"/>
                      <Column text={Intl.get('High Priority')+'(0/3)'} width="100" dataIndex="priceChange"/>
                  </Grid>
                </Container>
            </Container>
            {/* 可设置右上角的标记文本：badgeText="4" */}
            <Container title={Intl.get('Advanced Setting')} >
                <div>Badges <em>(like the 4, below)</em> can be added by setting the <code>badgeText</code> prop.</div>
            </Container>

            <Container title={Intl.get('Monitor')} >
                <div>Badges <em>(like the 4, below)</em> can be added by setting the <code>badgeText</code> prop.</div>
            </Container>
        </TabPanel>
      </div>

    );
  }

}

export default NetFlowCtrlMB;
