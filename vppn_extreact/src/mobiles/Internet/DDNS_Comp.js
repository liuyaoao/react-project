
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,TitleBar,Button,Menu,MenuItem,FieldSet, TabPanel,FormPanel, Panel,TextField } from '@extjs/ext-react';

class DDNS_Comp extends Component{
  state = {
    bodyHeight:500,
    bodyWidth:'100%',
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

    return (
      <div className='' style={{height:(this.state.bodyHeight-45)+"px"}}>
        <Container layout="vbox" padding="10 10 10 10">
          <div>DDNS的内容区</div>

        </Container>
      </div>
    );
  }

}

export default DDNS_Comp;
