
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SegmentedButton, Label,FormPanel, Panel } from '@extjs/ext-react';

class NetworkPageMobile extends Component{
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
    let {displayed} = this.props;
    return (
      <div className="page_content" style={{}}>
        <Container
            layout='vbox'
            padding="10 10"
        >
            <div>network 的内容区</div>
        </Container>
      </div>
    );
  }

}

export default NetworkPageMobile;
