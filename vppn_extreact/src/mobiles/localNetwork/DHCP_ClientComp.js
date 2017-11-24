
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,
  TextField,Grid,Column } from '@extjs/ext-react';

class DHCP_ClientComp extends Component{
  state = {
    bodyHeight:500,
    bodyWidth:'100%',
    DHCPServerOn:"1",
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
    let {DHCPServerOn} = this.state;
    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <Container layout={{type:'hbox',pack:'left',aglin:'bottom'}}>
            <Button text={Intl.get('Refresh')} ui="confirm raised" style={{marginRight:'10px'}}/>
            <Button text={Intl.get('Add to address reservation')} ui="decline raised" />
          </Container>
          <Container>
            <Button ui="menu" text="IPv4"
              style={{width:'100%'}}>
               <Menu defaults={{ handler: this.onDHCPServerChange, group: 'buttonstyle' }}>
                   <MenuItem text={Intl.get('IPv4')} value="1" iconCls={DHCPServerOn === '1' && 'x-font-icon md-icon-check'}/>
                   <MenuItem text={Intl.get('IPv6')} value="0" iconCls={DHCPServerOn === '0' && 'x-font-icon md-icon-check'}/>
               </Menu>
            </Button>
          </Container>
          <Container width="100%" margin="10 0 10 0">
            <Grid shadow grouped
              store={this.dataStore}
              style={{minHeight:'600px'}}
              scrollable={true}>
                <Column text={Intl.get('MAC/DUID')} width="120" dataIndex="price"/>
                <Column text={Intl.get('IP')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Host')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Expiration date')} width="100" dataIndex="priceChange"/>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }

}

export default DHCP_ClientComp;
