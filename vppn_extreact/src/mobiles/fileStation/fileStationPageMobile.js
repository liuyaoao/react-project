
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Sheet,TitleBar,Button,SearchField, Label,FormPanel, Panel } from '@extjs/ext-react';

class FileStationPageMobile extends Component{
  state = {
      bodyHeight:500,
      bodyWidth:'100%',
      titlebarRightText:''
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
        <TitleBar
            cls="titlebar-mobile"
            title="ReadySHARE"
            height="45px"
            zIndex="108"
            platformConfig={{
                phone: {titleAlign: 'center'}
            }}
            style={{position:'fixed',top:'0'}}
        >
          <Button align="left" ui="default" iconCls="x-fa fa-bars" onTap={this.props.toggleSidebar}/>
          {this.state.titlebarRightText?
            <Button align="right" ui="default" text={this.state.titlebarRightText}/>:null
          }
        </TitleBar>
        <Container
            layout='vbox'
            padding="10 10"
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
