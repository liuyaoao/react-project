
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SelectField,ContainerField, Menu,MenuItem,
  TabPanel,FormPanel, Panel,CheckBoxField,Grid,CheckColumn,Column } from '@extjs/ext-react';

class ParentPlanMB extends Component{
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
    let {} = this.state;
    let {contentId} = this.props;
    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <div style={{padding:'10px'}}>
          <div style={{marginBottom:'10px'}}>{Intl.get('Protect your child from aggressive content and potentially harmful sites through ‘parental control’.This allows you to restrict Internet access to each connection device.')}</div>
          <Container layout={{type:'hbox',pack:'space-between',aglin:'bottom'}}>
            <Button text={Intl.get('Add')} ui="confirm alt raised" />
            <Button text={Intl.get('Delete')} ui="decline alt raised" />
            <Button text={Intl.get('Setting Plan')} ui="raised" />
            <CheckBoxField boxLabel={Intl.get('Allow')} cls="black_label"/>
          </Container>
          <Container width="100%" margin="10 0 10 0">
            <Grid shadow grouped
              store={this.dataStore}
              style={{minHeight:'600px'}}
              selectable={{}}
              scrollable={true}>
                <Column text={Intl.get('Device List')} width="120" dataIndex="price"/>
                <Column text={Intl.get('Allow surf the Internet time')} width="140" dataIndex="priceChange"/>
                <Column text={Intl.get('Web filter')} width="100" dataIndex="priceChange"/>
            </Grid>
          </Container>

        </div>
      </div>
    );
  }

}

export default ParentPlanMB;
