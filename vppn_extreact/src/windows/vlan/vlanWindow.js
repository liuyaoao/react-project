
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Intl from '../../intl/Intl';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as VpnActions from '../../app/actions/vpn_action';

import { Container } from '@extjs/ext-react';
import VlanSidebar from './vlanSidebar';
import VportContent from './vportContent';
import DiagnosisContent from './diagnosisContent';
import SettingContent from './settingContent';
import VlanModuleIconView from './VlanModuleIconView';
// import CommonDialog from '../app/components/common/dialog';

let vlanWindowInterval = '';
class VlanWindow extends Component{
  state = {
    windowHeight:570,
    headerHeight:38,
    contentId: 'ModuleIconView',
  }
  componentDidMount(){
    this.props.vpnActions.getVLanStatusInfo('0'); //获取所有端口信息
    this.setRightHeight(this.props.id);
    // $(window).resize(this.handleMouseMove);
  }
  componentWillReceiveProps(nextProps){
    // console.log('views vlanWindow will receive props.......');
    // let sizeChange = nextProps.windowSizeChange;
    // if(sizeChange.flag && sizeChange.windowId==this.props.id && !vlanWindowInterval){
    //   vlanWindowInterval = setInterval(()=>{
    //     this.setRightHeight(this.props.id);
    //   },500);
    // }
    // if(!sizeChange.flag){
    //   clearInterval(vlanWindowInterval);
    //   vlanWindowInterval = null;
    // }
  }
  componentWillUnmount () {
    // $(window).off('resize',this.handleMouseMove);
  }
  onShowModuleIconView = ()=>{  //展示功能模块的图标视图
    this.setState({contentId:'ModuleIconView'});
  }
  setRightHeight = (id)=>{
    var windowId = '#window-' + id;
    var windowHeight = $(windowId).height();
    // console.log('setRightHeight----:',id,windowHeight);
    this.setState({ windowHeight:windowHeight});
  }
  onMenuItemClick = (contentId)=>{
    this.setState({contentId});
    if(contentId.indexOf('vport') != -1){
      this.props.vpnActions.getVLanStatusInfo(contentId.split('_')[0]);
    }
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
            <div className="cell side" style={{height:(this.state.windowHeight-38)+'px'}}>
              <VlanSidebar
                contentId={contentId}
                onShowModuleIconView={this.onShowModuleIconView}
                onMenuItemClick={this.onMenuItemClick}
              />
            </div>
            <div className="cell colspan3 wi-right" style={{height:(this.state.windowHeight-38)+'px'}}>
              <div className="wi active" id="wi_right_content" style={{height:'100%',width:'100%',overflow: 'hidden'}}>
                {/*所有的Vport tab的右边内容块*/}
                {(contentId.indexOf('vport')!=-1)?
                  <VportContent
                    myVirtualIP={this.props.myVirtualIP}
                    running_status={this.props.running_status}
                    peersRouterList={this.props.peersRouterList}
                    vPortBootNodesList={this.props.vPortBootNodesList}
                    curBootNodeIP={this.props.curBootNodeIP}
                    vPathList={this.props.vPathList}
                    vProxyList={this.props.vProxyList}
                    vpnActions={this.props.vpnActions}
                    contentId={this.state.contentId} />:null
                }

                {/*diagnosis tab的右边内容块*/}
                {(contentId.indexOf('diagnosis')!=-1)?
                  <DiagnosisContent
                    windowHeight={this.state.windowHeight}
                    myVirtualIP={this.props.myVirtualIP}
                    diagnosisRouteList={this.props.diagnosisRouteList}
                    contentId={this.state.contentId}/>:null
                }

                {/*setting tab的右边内容块*/}
                {(contentId.indexOf('setting')!=-1)?
                  <SettingContent
                    windowHeight={this.state.windowHeight}
                    myVirtualIP={this.props.myVirtualIP}
                    contentId={this.state.contentId}
                    managerServer={this.props.managerServer}
                    paymentInfo={this.props.paymentInfo}
                    vpnActions={this.props.vpnActions}
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

const mapStateToProps = (state) => {
  let { myVirtualIP,running_status,peersRouterList,curBootNodeIP,vPortBootNodesList,
      vPathList,vProxyList,paymentInfo,managerServer,diagnosisRouteList } = state.vpnReducer;
  // let {windowSizeChange} = state.homeReducer;
  return {
    myVirtualIP,
    running_status,
    peersRouterList,
    vPortBootNodesList,
    curBootNodeIP,
    vPathList,
    vProxyList,
    paymentInfo,
    managerServer,
    diagnosisRouteList,
    // windowSizeChange,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    vpnActions:bindActionCreators(VpnActions,dispatch)
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VlanWindow)
