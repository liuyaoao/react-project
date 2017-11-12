
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button, TabPanel,FormPanel, Panel } from '@extjs/ext-react';

class VlanDiagnosisMB extends Component{
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
        诊断内容区。。。。
      </div>

    );
  }

}

export default VlanDiagnosisMB;
