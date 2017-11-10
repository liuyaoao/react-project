
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SegmentedButton, Label,FormPanel, Panel } from '@extjs/ext-react';

class VlanPageMobile extends Component{
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
      <div className="" style={{width:'100%',height:'100%'}}>
        <Container
            width='100%'
            height='100%'
            layout='vbox'
        >
            <Button text="Settings" iconCls="x-fa fa-gear" onTap={this.props.toggleMenu}/>
            <Button text="New Item" iconCls="x-fa fa-pencil" onTap={this.props.toggleMenu} />
            <Button text="Star" iconCls="x-fa fa-star" onTap={this.props.toggleMenu}/>
        </Container>
      </div>
    );
  }

}

export default VlanPageMobile;
