
import React,{Component} from 'react';
import ReactDOM from 'react-dom';

// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container,Button } from '@extjs/ext-react';
import NetworkSidebar from './NetworkSidebar';
import ModuleIconView from './ModuleIconView';

import StateContent from './StateContent';
import WirelessContent from './WirelessContent';
import InternetContent from './InternetContent';
import LocalNetworkContent from './LocalNetworkContent';
import ParentalCtrlContent from './ParentalCtrlContent';
import FlowCtrlContent from './FlowCtrlContent';
import SecurityContent from './SecurityContent';
import NoticeSettingsContent from './NoticeSettingsContent';
import ManagementContent from './ManagementContent';

import Intl from '../../intl/Intl';

// import CommonDialog from '../../app/components/common/dialog';

class NetworkCenterWindow extends Component{
  state = {
    windowHeight:570,
    headerHeight:38,
    contentId: 'ModuleIconView', //首先展示所有的模块图标视图
    modulesData : {
      root: {
          children: [
              { id: 'state', text: Intl.get('state'), iconCls: 'mif-meter icon', leaf: true, iconColor:'#3db10f' },
              { id: 'wireless', text: Intl.get('wireless'), iconCls: 'mif-wifi-connect icon', leaf: true ,iconColor:'#0f74b1'},
              { id: 'Internet', text: Intl.get('Internet'), iconCls: 'mif-earth icon', leaf: true, iconColor:'#6f48e2' },
              { id: 'localNetwork', text: Intl.get('localNetwork'), iconCls: 'mif-home icon', leaf: true, iconColor:'#e29048' },
              { id: 'parentalCtrl', text: Intl.get('parentalCtrl'), iconCls: 'mif-users icon', leaf: true, iconColor:'#b12b2b' },
              { id: 'flowCtrl', text: Intl.get('flowCtrl'), iconCls: 'mif-equalizer-v icon', leaf: true,iconColor:'#66b323'  },
              { id: 'security', text: Intl.get('security'), iconCls: 'mif-security icon', leaf: true,iconColor:'#efc908' },
              { id: 'noticeSettings', text: Intl.get('noticeSettings'), iconCls: 'mif-mail-read icon', leaf: true,iconColor:'#19b150' },
              { id: 'management', text: Intl.get('management'), iconCls: 'mif-tools icon', leaf: true,iconColor:'#1576b1' },
          ]
      }
    },
  }
  componentDidMount(){
    this.setRightHeight(this.props.id);
  }
  componentWillUnmount () {
  }
  setRightHeight = (id)=>{
    var windowId = '#window-' + id;
    this.setState({ windowHeight:$(windowId).height()});
  }
  onSelectedModule = (contentId)=>{
    this.setState({contentId:contentId});
  }
  onShowModuleIconView = ()=>{  //展示图标视图
    this.setState({contentId:'ModuleIconView'});
  }
  onMenuItemClick = (contentId)=>{
    this.setState({contentId});
  }
  render () {
    let {modulesData,contentId} = this.state;
    return (
      <div className="grid condensed win-content net-win" id="networkWindow">
      {contentId=="ModuleIconView" ?
        <div className='row cells4'>
          <ModuleIconView
            modulesData={modulesData}
            onSelectedModule={this.onSelectedModule}
          />
        </div>: null
      }
      {contentId!="ModuleIconView" ?
        <div className="row cells4">
          <div className="cell side" style={{height:(this.state.windowHeight-38)+'px'}}>
            <NetworkSidebar
              contentId={contentId}
              modulesData={modulesData}
              onShowModuleIconView={this.onShowModuleIconView}
              onMenuItemClick={this.onMenuItemClick}
            />
          </div>
          <div className="cell colspan3 wi-right" style={{overflowY:'auto',height:(this.state.windowHeight-38)+'px'}}>
            <div className="wi active" id={"wi_right_content"}
              style={{height:'100%',width:'100%',overflowX: 'hidden'}}>
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
        </div>:null
      }

      </div>
    );
  }
}

export default NetworkCenterWindow;
