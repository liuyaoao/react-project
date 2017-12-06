import {combineReducers} from 'redux';
import * as ACTIONS from '../actions/vpn_action';

const myVirtualIP = function(state = '', action){
  switch (action.type) {
    case ACTIONS.SET_MY_VIRTUAL_IP:
      return action.myVirtualIP;
    default:
      return state;
  }
}
const running_status = (state='disable', action) => {
  switch (action.type) {
    case ACTIONS.SET_RUNNING_STATUS:
      return action.running_status;
    default:
      return state;
  }
}

const peersRouterList = function(state = [], action){
  switch (action.type) {
    case ACTIONS.SET_REMOTE_PEERS_ROUTER_LIST:
      return action.peersRouterList;
    default:
      return state;
  }
}
const vPortBootNodesList = function(state = [], action){
  switch (action.type) {
    case ACTIONS.SET_VPORT_BOOT_NODES_LIST:
      return action.bootNodesList;
    default:
      return state;
  }
}

const curBootNodeIP = (state = '', action) => {
  switch (action.type) {
    case ACTIONS.SET_CUR_BOOT_NODE_IP:
      return action.curBootNodeIP;
    default:
      return state;
  }
}

const vPathList = function(state = [], action){
  switch (action.type) {
    case ACTIONS.SET_VPORT_VPATH_LIST:
      return action.vPathList;
    default:
      return state;
  }
}
const vProxyList = function(state = [], action){
  switch (action.type) {
    case ACTIONS.SET_VPORT_VPROXY_LIST:
      return action.vProxyList;
    default:
      return state;
  }
}
const paymentInfo = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.SET_PAYMENT_INFO:
      return action.paymentInfo;
    default:
      return state;
  }
}

const managerServer = (state={'cloud_host':'','cloud_port':''}, action) => {
  switch (action.type) {
    case ACTIONS.SET_MANAGER_SERVER:
      return action.managerServer;
    default:
      return state;
  }
}
//诊断模块里的路由器列表。
const diagnosisRouteList = (state=[], action) => {
  switch (action.type) {
    case ACTIONS.SET_DIAGNOSIS_ROUTE_LIST:
      return action.diagnosisRouteList;
    default:
      return state;
  }
}

const vpnReducer = combineReducers({
  myVirtualIP,
  running_status,
  peersRouterList,
  curBootNodeIP,
  vPortBootNodesList,
  vPathList,
  vProxyList,
  paymentInfo,
  managerServer,
  diagnosisRouteList,
})

export default vpnReducer;
