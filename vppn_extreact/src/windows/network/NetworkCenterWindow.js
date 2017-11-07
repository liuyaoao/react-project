
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Button } from '@extjs/ext-react';
import NetworkSidebar from './NetworkSidebar';

import StateContent from './StateContent';
import WirelessContent from './WirelessContent';
import InternetContent from './InternetContent';
import LocalNetworkContent from './LocalNetworkContent';
import ParentalCtrlContent from './ParentalCtrlContent';
import FlowCtrlContent from './FlowCtrlContent';
import SecurityContent from './SecurityContent';
import NoticeSettingsContent from './NoticeSettingsContent';
import ManagementContent from './ManagementContent';

// import CommonDialog from '../../app/components/common/dialog';

class NetworkCenterWindow extends Component{
  state = {
    windowHeight:570,
    contentId: 'allIcon', //state
    myVirtualIp:'10.100.16.89',
    vProxyIpArr:['10.100.16.84','10.100.16.9','10.100.16.68'],
  }
  componentDidMount(){
    this.setRightHeight(this.props.id);
    // document.addEventListener('mousemove', this.handleMouseMove);
  }
  componentWillUnmount () {
    // document.removeEventListener('mousemove', this.handleMouseMove);
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
    this.setRightHeight(this.props.id);
    // if (cl.hasClass('active')) {
    // }
  }
  onMenuItemClick = (contentId)=>{
    this.setState({contentId});
  }
  render () {
    let {contentId} = this.state;
    return (
      <div className="grid condensed net-win" id="networkWindow" style={{margin:"0 1px"}}>
      {contentId=="allIcon" ?
        <div className='row cells4'>
          <Button text={"列表模式"} ui={'decline alt'} onTap={()=>{ this.setState({contentId:'state'}); }}></Button>
        </div>:
        <div className="row cells4">
          <div className="cell side">
            <NetworkSidebar onMenuItemClick={this.onMenuItemClick}/>
          </div>
          <div className="cell colspan3 wi-right">
            <div className="wi active" id={"wi_right_content"}
              style={{height:'100%',width:'100%',overflowY: 'scroll'}}>
              {/*状态 tab的右边内容块*/}
              {contentId=="state" ?
                <StateContent
                  windowHeight={this.state.windowHeight}
                  contentId={this.state.contentId}
                /> : null
              }

              {/*无线 tab的右边内容块*/}
              {contentId=="wireless" ?
                <WirelessContent
                  windowHeight={this.state.windowHeight}
                  contentId={this.state.contentId}
                /> : null
              }

              {/*互联网 tab的右边内容块*/}
              {contentId=="Internet" ?
                <InternetContent
                  windowHeight={this.state.windowHeight}
                  contentId={this.state.contentId}
                /> : null
              }

              {/*本地网络 tab的右边内容块*/}
              {contentId=="localNetwork" ?
                <LocalNetworkContent
                  windowHeight={this.state.windowHeight}
                  contentId={this.state.contentId}
                /> : null
              }

              {/*家长控制 tab的右边内容块*/}
              {contentId=="parentalCtrl" ?
                <ParentalCtrlContent
                  windowHeight={this.state.windowHeight}
                  contentId={this.state.contentId}
                /> : null
              }

              {/*流量控制 tab的右边内容块*/}
              {contentId=="flowCtrl" ?
                <FlowCtrlContent
                  windowHeight={this.state.windowHeight}
                  contentId={this.state.contentId}
                /> : null
              }

              {/*安全性 tab的右边内容块*/}
              {contentId=="security" ?
                <SecurityContent
                  windowHeight={this.state.windowHeight}
                  contentId={this.state.contentId}
                /> : null
              }

              {/*通知设置 tab的右边内容块*/}
              {contentId=="noticeSettings" ?
                <NoticeSettingsContent
                  windowHeight={this.state.windowHeight}
                  contentId={this.state.contentId}
                /> : null
              }
              {/*管理 tab的右边内容块*/}
              {contentId=="management" ?
                <ManagementContent
                  windowHeight={this.state.windowHeight}
                  contentId={this.state.contentId}
                /> : null
              }

            </div>

          </div>
        </div>
      }



      </div>
    );
  }

}

export default NetworkCenterWindow;
