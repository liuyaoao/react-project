
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';
// var {connect} = require('react-redux');
// var {bindActionCreators} = require('redux');
import { Container } from '@extjs/ext-react';
import VlanSidebar from './vlanSidebar';
import VportContent from './vportContent';
import DiagnosisContent from './diagnosisContent';
import SettingContent from './settingContent';
import VlanModuleIconView from './VlanModuleIconView';
// import CommonDialog from '../app/components/common/dialog';

class VlanWindow extends Component{
  state = {
    windowHeight:570,
    contentId: 'ModuleIconView',
    myVirtualIp:'10.100.16.89',
    vProxyIpArr:['10.100.16.84','10.100.16.9','10.100.16.68'],
  }
  componentDidMount(){
    this.setRightHeight(this.props.id);
    document.addEventListener('mousemove', this.handleMouseMove);
  }
  componentWillUnmount () {
    document.removeEventListener('mousemove', this.handleMouseMove);
    // document.removeEventListener('mouseup', this.handleMouseUp);
  }
  onShowModuleIconView = ()=>{  //展示功能模块的图标视图
    this.setState({contentId:'ModuleIconView'});
  }
  setRightHeight = (id)=>{
    // console.log(id);
    var windowId = '#window-' + id;
    var height = $(windowId).height();
    var headerHeight = 38;  //49
    $(windowId + ' .cell.side').css("height", height - headerHeight);
    $(windowId + ' .wi-right').css("height", height - headerHeight);
    this.setState({ windowHeight:height});
  }
  handleMouseMove = ()=>{
    this.setRightHeight(this.props.id);
  }
  onMenuItemClick = (contentId)=>{
    this.setState({contentId});
  }

  onSelectedModule = (contentId)=>{
    if(contentId.indexOf('setting')!=-1){
    }
    this.setState({contentId:contentId});
  }

  render () {
    let {contentId} = this.state;
    return (
      <div className="grid condensed win-content" id="cloudVpnWindow" >
        {contentId=="ModuleIconView" ?
          <div className='row cells4'>
            <VlanModuleIconView
              onSelectedModule={this.onSelectedModule}
            />
          </div>: null
        }
        {contentId!="ModuleIconView" ?
          <div className="row cells4">
            <div className="cell side">
              <VlanSidebar
                contentId={contentId}
                onShowModuleIconView={this.onShowModuleIconView}
                onMenuItemClick={this.onMenuItemClick}
              />
            </div>
            <div className="cell colspan3 wi-right">
              <div className="wi active" id="wi_right_content" style={{height:'100%',width:'100%',overflow: 'hidden'}}>
                {/*所有的Vport tab的右边内容块*/}
                {(contentId.indexOf('vport')!=-1)?
                  <VportContent
                    windowHeight={this.state.windowHeight}
                    myVirtualIp={this.state.myVirtualIp}
                    vProxyIpArr={this.state.vProxyIpArr}
                    contentId={this.state.contentId}
                  />:null
                }

                {/*diagnosis tab的右边内容块*/}
                {(contentId.indexOf('diagnosis')!=-1)?
                  <DiagnosisContent
                    windowHeight={this.state.windowHeight}
                    myVirtualIp={this.state.myVirtualIp}
                    contentId={this.state.contentId}
                  />:null
                }

                {/*setting tab的右边内容块*/}
                {(contentId.indexOf('setting')!=-1)?
                  <SettingContent
                    windowHeight={this.state.windowHeight}
                    myVirtualIp={this.state.myVirtualIp}
                    contentId={this.state.contentId}
                  />:null
                }
              </div>

            </div>
          </div>:null
        }

      </div>
    );
  }

}

export default VlanWindow;
