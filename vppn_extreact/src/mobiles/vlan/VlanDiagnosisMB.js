
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button, TabPanel,Grid,Column, Panel } from '@extjs/ext-react';

class VlanDiagnosisMB extends Component{
  state = {
  }
  dataStore = new Ext.data.Store({
      data: [
        {index:1, Target:' Wireless',Mask:'342.54', Gateway:'mif-wifi-connect icon'},
        {index:2, Target:' Internet',Mask:'342.54', Gateway:'mif-earth icon'}
      ],
      sorters: 'Target'
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
      <div>
        <Container height="100%">
          <Grid
            title="Routing Table:"
            store={this.dataStore}
            shadow grouped
            height="100%"
            minHeight={(bodyHeight-45)+"px"}
            style={{height:'100%'}} >
              <Column text={Intl.get('Target')} width="120" dataIndex="Target"/>
              <Column text={Intl.get('Mask')} width="120" dataIndex="Mask"/>
              <Column text={Intl.get('Gateway')} width="120" dataIndex="Gateway"/>
          </Grid>
        </Container>
      </div>

    );
  }

}

export default VlanDiagnosisMB;
