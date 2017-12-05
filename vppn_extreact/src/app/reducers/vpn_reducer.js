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

const remoteRouterList = function(state = [], action){
  switch (action.type) {
    case ACTIONS.SET_REMOTE_ROUTER_LIST:
      return action.remoteRouterList;
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
const paymentInfo = function(state = {}, action){
  switch (action.type) {
    case ACTIONS.SET_PAYMENT_INFO:
      return action.paymentInfo;
    default:
      return state;
  }
}

const vpnReducer = combineReducers({
  myVirtualIP,
  remoteRouterList,
  vPortBootNodesList,
  vPathList,
  vProxyList,
  paymentInfo,
})

export default vpnReducer;
