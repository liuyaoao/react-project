
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SearchField, Label,FormPanel, Panel } from '@extjs/ext-react';

class FileStationPageMobile extends Component{
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
            padding="10 10"
            style={{backgroundColor: 'white'}}
            layout='vbox'
        >
            <SearchField ui="faded" placeholder="Search"/>
            <Container layout={{type:"vbox",pack:'center'}} height='100%' margin="20 10">
                <Panel layout="center" flex={'1'} padding="10">
                  <span className="x-fa fa-folder-o" style={{color:'gray',fontSize:'30px'}}></span>列表为空
                </Panel>
            </Container>
        </Container>
      </div>
    );
  }

}

export default FileStationPageMobile;
