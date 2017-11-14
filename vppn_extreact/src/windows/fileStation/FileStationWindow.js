
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';

// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Button } from '@extjs/ext-react';
import HeaderBarFS from './HeaderBarFS';
import ToolBarFS from './ToolBarFS';
// import StateContent from './StateContent';
// import WirelessContent from './WirelessContent';
// import InternetContent from './InternetContent';

class NetworkCenterWindow extends Component{
  state = {
    dialogMsg:'',
    windowHeight:570,
    contentId: '1_vport',
    myVirtualIp:'10.100.16.89',
    vProxyIpArr:['10.100.16.84','10.100.16.9','10.100.16.68'],
  }
  componentDidMount(){
    this.setRightHeight(this.props.id);
    document.addEventListener('mousemove', this.handleMouseMove);
    $(".ws-select").select2();
  }
  componentWillUnmount () {
    document.removeEventListener('mousemove', this.handleMouseMove);
    // document.removeEventListener('mouseup', this.handleMouseUp);
  }
  setRightHeight = (id)=>{
    // console.log(id);
    var windowId = '#window-' + id;
    var height = $(windowId).height();
    var headerHeight = 38;  //49
    $(windowId + ' .row.cells4').css("height", height - headerHeight);
    $(windowId + ' .wi-right').css("height", height - headerHeight);
    this.setState({ windowHeight:height});
  }
  handleMouseMove = ()=>{
    var cl = $("#window-" + this.props.id);
    if (cl.hasClass('active')) {
      this.setRightHeight(this.props.id);
    }
  }
  onMenuItemClick = (contentId)=>{
    this.setState({contentId});
  }
  render () {
    return (
      <div className="grid condensed win-content" id="networkWindow">
        <div className="row cells4">
          <HeaderBarFS />
          <ToolBarFS />
        </div>
      </div>
    );
  }

}

export default NetworkCenterWindow;
