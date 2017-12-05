
import WebClient from '../script/web_client';

import {allRemoteRouterList,
  allMyVirtualIP,
  allVPathList,
  allVProxyList} from '../mockDatas/vportDatas'
export const SET_MY_VIRTUAL_IP = 'SET_MY_VIRTUAL_IP';
export const SET_REMOTE_ROUTER_LIST = 'SET_REMOTE_ROUTER_LIST'; //设置vPort的Remote Router数据
export const SET_VPORT_BOOT_NODES_LIST = 'SET_VPORT_BOOT_NODES_LIST'; //设置启动节点
export const SET_VPORT_VPATH_LIST = 'SET_VPORT_VPATH_LIST'; //设置vPath列表
export const SET_VPORT_VPROXY_LIST = 'SET_VPORT_VPROXY_LIST';  //设置vProxy下拉列表
export const SET_PAYMENT_INFO = 'SET_PAYMENT_INFO';
// export const SET_PAYMENT_INFO = 'SET_PAYMENT_INFO';
// export const SET_PAYMENT_INFO = 'SET_PAYMENT_INFO';


//当前我连接的虚拟IP地址。
export function setMyVirtualIP(myVirtualIP){
  return {
    type:SET_MY_VIRTUAL_IP,
    myVirtualIP
  }
}

//当前所选端口的remote router 列表数据。
export function setRemoteRouterList(remoteRouterList){
  return {
      type: SET_REMOTE_ROUTER_LIST,
      remoteRouterList
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



export function getMyVirtualIP(vPortName){ //获取某个vPort的路由器列表数据。
  return dispatch => {
    setTimeout(()=>{
      dispatch(setMyVirtualIP(allMyVirtualIP[vPortName]));
    },1000);
  }
}
export function getRemoteRouterList(vPortName){ //获取某个vPort的路由器列表数据。
  return dispatch => {
    setTimeout(()=>{
      dispatch(setRemoteRouterList(allRemoteRouterList[vPortName]));
    },1000);
  }
}
export function getVPortBootNodesList(){ //获取某个vPort的远程路由器的可选的启动节点列表。
  return dispatch => {
    WebClient.getPorxyBootsNode((allBootNodesList)=>{
      dispatch(setVPortBootNodesList(allBootNodesList));
    });
  }
}

export function getVProxyList(vPortName){  //获取某个vPort的vProxy代理列表
  return dispatch => {
    setTimeout(()=>{
      dispatch(setVProxyList(allVProxyList[vPortName]));
    },1000);
  }
}

export function getVPathList(vPortName){  //获取某个vPort的vPath列表
  return dispatch => {
    setTimeout(()=>{
      dispatch(setVPathList(allVPathList[vPortName]));
    },1000);
  }
}

//获取某个vPort的初始化数据
export function getVPortInitalDatasById(portNum) {
    return dispatch => {
      let vPortName = 'vPort'+portNum;
      dispatch(getMyVirtualIP(vPortName));
      dispatch(getVPortBootNodesList());
      dispatch(getRemoteRouterList(vPortName));
      dispatch(getVPathList(vPortName));
      dispatch(getVProxyList(vPortName));

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
