
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import Utils from '../script/utils';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as HomeActions from '../actions/home_action';

import VpnSidebar from '../components/vpn/vpnSidebar';
import VpnMultiChannel from '../components/vpn/vpnMultiChannel';
import VpnOverview from '../components/vpn/vpnOverview';
import VpnTopology from '../components/vpn/vpnTopology';
import VpnProxyServer from '../components/vpn/vpnProxyServer';

import CommonDialog from '../components/common/dialog';

var setRightHeight = function(id){
  // console.log(id);
  var windowId = '#window-' + id;
  var height = $(windowId).height();
  var headerHeight = 38;  //49
  var hg1 = height - headerHeight;
  var hg2 = hg1 - 30;  // - 51 top tab height , - 60 bottom height
  $(windowId + ' .sidebar3').css("height", hg2);
  $(windowId + ' .wi-right').css("height", hg1);
  $(windowId + ' .wi-right-1').css("height", hg2);
  $(windowId + ' .wi-right-1 .frame').css("height", hg2 - 51);
  $(windowId + ' .wi-right-1 .frame .wi-content').css("height", hg2 - 51 - 60); // - 60
}

class VpnConfig extends Component{
  state = {

  }
  componentDidMount(){
    setRightHeight(this.props.id);
    document.addEventListener('mousemove', this.handleMouseMove);
    $(".ws-select").select2();
  }
  componentWillUnmount () {
    document.removeEventListener('mousemove', this.handleMouseMove);
  }
  handleMouseMove = ()=>{
    var cl = $("#window-" + this.props.id);
    if (cl.hasClass('active')) {
      setRightHeight(this.props.id);
    }
  }
  getVPNStatus = (key)=>{
    this.refs["VpnMultiChannel_"+key].getVPNStatus();
  }
  getVPNConfig = (key)=>{
    this.refs["VpnMultiChannel_"+key].getVPNConfig();
  }
  // getVPNServerList: function(key) {
  //   this.refs["VpnMultiChannel_"+key].getVPNServerList();
  // },
  getVPNStatus_overview = (key)=>{
    this.refs.vpnOverview.getVPNStatus(key);
  }
  getVPNConfig_overview = (key)=>{
    this.refs.vpnOverview.getVPNConfig(key);
  }
  // getVPNServerList_overview: function() {
  //   this.refs.vpnOverview.getVPNServerList();
  // },
  getVPNConfig_vpntopolopy = (key)=>{
    this.refs.vpnTopology.getVPNConfig_vpntopolopy(key);
  }
  getVPNStatus_vpntopolopy = (key)=>{
    this.refs.vpnTopology.getVPNStatus_vpntopolopy(key);
  }
  // getVPNServerList_proxyServer: function() {
  //   this.refs.vpnProxyServer.getVPNServerList();
  // }
  getVPNManagerServer = ()=>{
    this.refs.vpnProxyServer.getVPNManagerServer();
  }
  render () {
    const { dialogMsg, cySize, managerServerIP, managerServerPort, proxyServerList, windowSizeChange, vpntopologyData, vpntopologyStatus, windowSize } = this.props;
    return (
      <div className="grid condensed no-margin net-win" id="vpnWindow" style={{margin:"0 1px"}}>
        <div className="row cells4">
          <div className="cell side">
            <VpnSidebar getVPNStatus={this.getVPNStatus} getVPNConfig={this.getVPNConfig}
                  getVPNStatus_overview={this.getVPNStatus_overview} getVPNConfig_overview={this.getVPNConfig_overview}
                  getVPNStatus_vpntopolopy={this.getVPNStatus_vpntopolopy} getVPNConfig_vpntopolopy={this.getVPNConfig_vpntopolopy}
                  getVPNManagerServer={this.getVPNManagerServer}/>
          </div>
          <div className="cell colspan3 wi-right">
            <div className="wi active" id="wi_right_6">
              <VpnOverview ref="vpnOverview" getVPNStatus={this.getVPNStatus} getVPNConfig={this.getVPNConfig} setDialogMsg={this.props.actions.setDialogMsg}
                managerServerIP={managerServerIP} managerServerPort={managerServerPort} proxyServerList={proxyServerList}/>
            </div>
            <div className="wi" id="wi_right_1">
              <VpnMultiChannel id={1} ref="VpnMultiChannel_1" setDialogMsg={this.props.actions.setDialogMsg} managerServerIP={managerServerIP} managerServerPort={managerServerPort} proxyServerList={proxyServerList}/>
            </div>
            <div className="wi" id="wi_right_2">
              <VpnMultiChannel id={2} ref="VpnMultiChannel_2" setDialogMsg={this.props.actions.setDialogMsg} managerServerIP={managerServerIP} managerServerPort={managerServerPort} proxyServerList={proxyServerList}/>
            </div>
            <div className="wi" id="wi_right_3">
              <VpnMultiChannel id={3} ref="VpnMultiChannel_3" setDialogMsg={this.props.actions.setDialogMsg} managerServerIP={managerServerIP} managerServerPort={managerServerPort} proxyServerList={proxyServerList}/>
            </div>
            <div className="wi" id="wi_right_4">
              <VpnMultiChannel id={4} ref="VpnMultiChannel_4" setDialogMsg={this.props.actions.setDialogMsg} managerServerIP={managerServerIP} managerServerPort={managerServerPort} proxyServerList={proxyServerList}/>
            </div>
            <div className="wi" id="wi_right_5">
              <VpnMultiChannel id={5} ref="VpnMultiChannel_5" setDialogMsg={this.props.actions.setDialogMsg} managerServerIP={managerServerIP} managerServerPort={managerServerPort} proxyServerList={proxyServerList}/>
            </div>
            <div className="wi" id="wi_right_7">
                <VpnTopology ref="vpnTopology" manager={this.props.manager} setDialogMsg={this.props.actions.setDialogMsg} cySize={cySize} setVpnTopologyData={this.props.actions.setVpnTopologyData} setVpnTopologyStatus={this.props.actions.setVpnTopologyStatus}
                setWindowSizeChange={this.props.actions.setWindowSizeChange}
                vpntopologyData={vpntopologyData} vpntopologyStatus={vpntopologyStatus} windowSizeChange={windowSizeChange} windowSize={windowSize}/>
            </div>
            <div className="wi" id="wi_right_8">
                <VpnProxyServer ref="vpnProxyServer" setDialogMsg={this.props.actions.setDialogMsg} setManagerServerIP={this.props.actions.setManagerServerIP} setManagerServerPort={this.props.actions.setManagerServerPort}
                  setManagerServerSessionId={this.props.actions.setManagerServerSessionId} setProxyServerList={this.props.actions.setProxyServerList} managerServerIP={managerServerIP} managerServerPort={managerServerPort}
                  proxyServerList={proxyServerList}/>
            </div>
          </div>
        </div>
        <CommonDialog id="vpnDiaglog" dialogMsg={dialogMsg} />
      </div>
    );
  }

}


const mapStateToProps = (state)=>{
  const { dialogMsg, cySize, managerServerIP, managerServerPort, proxyServerList, windowSizeChange, vpntopologyData, vpntopologyStatus, windowSize } = state.homeReducer;
  return {
    dialogMsg,
    cySize,
    managerServerIP,
    managerServerPort,
    proxyServerList,
    windowSizeChange,
    vpntopologyData,
    vpntopologyStatus,
    windowSize
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    actions: bindActionCreators(HomeActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VpnConfig);
// module.exports = VpnConfig;
