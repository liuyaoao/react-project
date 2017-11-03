
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container } from '@extjs/ext-react';
import NetworkSidebar from './NetworkSidebar';
import StateContent from './StateContent';
import WirelessContent from './WirelessContent';
import InternetContent from './InternetContent';
import CommonDialog from '../../app/components/common/dialog';

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
    $(windowId + ' .sidebar3').css("height", height - headerHeight - 30);
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
      <div className="grid condensed net-win" id="networkWindow" style={{margin:"0 1px"}}>
        <div className="row cells4">
          <div className="cell side">
            <NetworkSidebar onMenuItemClick={this.onMenuItemClick}/>
          </div>
          <div className="cell colspan3 wi-right">
            {/*状态 tab的右边内容块*/}
            <div className="wi active" id="wi_right_state" style={{height:'100%',width:'100%'}}>
              <StateContent
                windowHeight={this.state.windowHeight}
                contentId={this.state.contentId}
              />
            </div>
            {/*无线 tab的右边内容块*/}
            <div className="wi" id="wi_right_wireless" style={{height:'100%',width:'100%'}}>
              <WirelessContent
                windowHeight={this.state.windowHeight}
                contentId={this.state.contentId}
              />
            </div>
            {/*互联网 tab的右边内容块*/}
            <div className="wi" id="wi_right_Internet" style={{height:'100%',width:'100%'}}>
              <InternetContent
                windowHeight={this.state.windowHeight}
                contentId={this.state.contentId}
              />
            </div>

            {/*本地网络 tab的右边内容块*/}
            <div className="wi" id="wi_right_localNetwork" style={{height:'100%',width:'100%'}}>
              <span>本地网络内容区...</span>
            </div>

            {/*家长控制 tab的右边内容块*/}
            <div className="wi" id="wi_right_parentalCtrl" style={{height:'100%',width:'100%'}}>
              <span>家长控制内容区...</span>
            </div>

            {/*流量控制 tab的右边内容块*/}
            <div className="wi" id="wi_right_flowCtrl" style={{height:'100%',width:'100%'}}>
              <span>流量控制内容区...</span>
            </div>

            {/*安全性 tab的右边内容块*/}
            <div className="wi" id="wi_right_security" style={{height:'100%',width:'100%'}}>
              <span>安全性内容区...</span>
            </div>

            {/*通知设置 tab的右边内容块*/}
            <div className="wi" id="wi_right_noticeSettings" style={{height:'100%',width:'100%'}}>
              <span>通知设置内容区...</span>
            </div>

            {/*管理 tab的右边内容块*/}
            <div className="wi" id="wi_right_management" style={{height:'100%',width:'100%'}}>
              <span>管理内容区...</span>
            </div>

          </div>
        </div>
        <CommonDialog id="networkDiaglog" dialogMsg={this.state.dialogMsg} />
      </div>
    );
  }

}

export default NetworkCenterWindow;
