
import WebClient from '../script/web_client'
import * as VpnUtils from '../script/vpn_utils'

import {allRemoteRouterList,
  allMyVirtualIP,
  allVPathList,
  allVProxyList} from '../mockDatas/vportDatas'
export const SET_MY_VIRTUAL_IP = 'SET_MY_VIRTUAL_IP';
export const SET_REMOTE_PEERS_ROUTER_LIST = 'SET_REMOTE_PEERS_ROUTER_LIST'; //设置vPort的Remote Router数据
export const SET_VPORT_BOOT_NODES_LIST = 'SET_VPORT_BOOT_NODES_LIST'; //设置启动节点
export const SET_VPORT_VPATH_LIST = 'SET_VPORT_VPATH_LIST'; //设置vPath列表
export const SET_VPORT_VPROXY_LIST = 'SET_VPORT_VPROXY_LIST';  //设置vProxy下拉列表
export const SET_PAYMENT_INFO = 'SET_PAYMENT_INFO';
export const SET_MANAGER_SERVER = 'SET_MANAGER_SERVER'; //setting 模块的manager server.
export const SET_DIAGNOSIS_ROUTE_LIST = 'SET_DIAGNOSIS_ROUTE_LIST';
export const SET_CUR_BOOT_NODE_IP = 'SET_CUR_BOOT_NODE_IP';
export const SET_RUNNING_STATUS = 'SET_RUNNING_STATUS';  //端口是否启动的状态
// export const SET_RUNNING_STATUS = 'SET_RUNNING_STATUS';
// export const SET_RUNNING_STATUS = 'SET_RUNNING_STATUS';


//当前我连接的虚拟IP地址。
export function setMyVirtualIP(myVirtualIP){
  return {
    type:SET_MY_VIRTUAL_IP,
    myVirtualIP
  }
}
export function setRunningStatus(running_status){//当前端口运行状态
  return {
    type:SET_RUNNING_STATUS,
    running_status
  }
}

//当前所选的vPort的对等路由器列表数据。
export function setPeersRouteList(peersRouterList){
  return {
      type: SET_REMOTE_PEERS_ROUTER_LIST,
      peersRouterList
  }
}
//当前所选tunnel端口的启动点ip, 即proxy host.
export function setCurBootNodeIP(curBootNodeIP){
  return {
      type: SET_CUR_BOOT_NODE_IP,
      curBootNodeIP
  }
}
//当前所选端口的可选启动节点项列表数据。
export function setVPortBootNodesList(bootNodesList){
  return {
      type: SET_VPORT_BOOT_NODES_LIST,
      bootNodesList
  }
}
export function setVPathList(vPathList){
  return {
    type:SET_VPORT_VPATH_LIST,
    vPathList,
  }
}
export function setVProxyList(vProxyList){
  return {
    type:SET_VPORT_VPROXY_LIST,
    vProxyList
  }
}
export function setPaymentInfo(paymentInfo){
  return {
    type:SET_PAYMENT_INFO,
    paymentInfo
  }
}
//setting模块的manager server， 包括host和port， Manager Server1和Manager Server2暂时都默认是这同一个。
export function setManagerServer(managerServer){
  return {
    type:SET_MANAGER_SERVER,
    managerServer
  }
}
//Diagnosis模块的route list
export function setDiagnosisRouteList(diagnosisRouteList){
  return {
    type:SET_DIAGNOSIS_ROUTE_LIST,
    diagnosisRouteList
  }
}





export function getVPortBootNodesList(){ //获取某个vPort的远程路由器的可选的启动节点列表。
  return dispatch => {
    WebClient.getPorxyBootsNode((allBootNodesList)=>{
      dispatch(setVPortBootNodesList(allBootNodesList));
    });
  }
}

export function getVLanStatusInfo(portNum){ //获取所有vPort的状态信息
  return dispatch => {
    dispatch(getVPortBootNodesList());
    WebClient.getVLanStatusInfo(portNum,(res)=>{
      console.log('getVLanStatusInfo---:',res);
      dispatch(setPeersRouteList( VpnUtils.parseRouteList(res.tunnel_status.peers)) );
      dispatch(setVProxyList( VpnUtils.parseVProxyDropdownList(res.tunnel_status.peers)) ); //获取某个vPort的vProxy下拉选项列表
      dispatch(setVPathList( VpnUtils.parseVPathList(res.tunnel_status.vpaths)) );
      dispatch(setCurBootNodeIP(res.tunnel_status.proxy_host));
      dispatch(setMyVirtualIP(res.tunnel_status.tunnel_vip || '')); //Current tunnel(端口) virtual IP,
      dispatch(setManagerServer(res.manager));
      dispatch(setDiagnosisRouteList(res.route_list));
      dispatch(setRunningStatus(res.tunnel_status.running_status));
      // dispatch(setPaymentInfo(res));
    });
  }
}

export function getPaymentInfo(){
  return dispatch => {
    WebClient.getPaymentInfo((res)=>{
      console.log('getPaymentInfo---:',res);
      dispatch(setPaymentInfo(res));
    });
  }
}
