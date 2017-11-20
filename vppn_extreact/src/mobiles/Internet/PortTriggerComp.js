
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,TextField,
  CheckBoxField,Grid,Column,CheckColumn,RendererCell } from '@extjs/ext-react';

  Ext.require('Ext.dataview.selection.Model');
Ext.require('selmodel.dataview');

class PortTriggerComp extends Component{
  state = {
    bodyHeight:500,
    bodyWidth:'100%',
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

    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <Container layout={{type:'hbox',pack:'space-between',aglin:'bottom'}}>
            <Button text={Intl.get('Add')} ui="confirm raised" />
            <Button text={Intl.get('Edit')} ui="confirm raised" />
            <Button text={Intl.get('Delete')} ui="decline raised" />
            <Button text={Intl.get('Save')} ui="decline raised" />
          </Container>
          <Container width="100%" margin="10 0 10 0">
            <Grid shadow grouped
              store={this.dataStore}
              style={{minHeight:'600px'}}
              selectable={{}}
              scrollable={true}>
                <CheckColumn text={Intl.get('Enabled')} width="100" dataIndex="name" groupable={false} sortable={false}/>
                <Column text={Intl.get('Full Name')} width="120" dataIndex="price"/>
                <Column text={Intl.get('Trigger Port')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Inbound Port')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Source IP')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('MAC')} width="100" dataIndex="priceChange"/>
                <Column text={Intl.get('Communication Protocol')} width="100" dataIndex="priceChange"/>
            </Grid>
          </Container>

        </div>
      </div>
    );
  }

}

export default PortTriggerComp;
