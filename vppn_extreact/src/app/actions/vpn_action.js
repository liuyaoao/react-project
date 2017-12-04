
import {allRemoteRouterList,allBootNodesList,allMyVirtualIP} from '../mockDatas/vportDatas'
export const SET_MY_VIRTUAL_IP = 'SET_MY_VIRTUAL_IP';
export const SET_REMOTE_ROUTER_LIST = 'SET_REMOTE_ROUTER_LIST'; //设置vPort的Remote Router数据
export const SET_VPORT_BOOT_NODES_LIST = 'SET_VPORT_BOOT_NODES_LIST'; //设置启动节点
// export const SET_ERROR_MSG = 'SET_ERROR_MSG';
// export const SET_DIALOG_MSG = 'SET_DIALOG_MSG';


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
export function getVPortBootNodesList(vPortName){ //获取某个vPort的远程路由器的可选的启动节点列表。
  return dispatch => {
    setTimeout(()=>{
      dispatch(setVPortBootNodesList(allBootNodesList[vPortName]));
    },1000);
  }
}

//获取某个vPort的初始化数据
export function getVPortInitalDatasById(portNum) {
    return dispatch => {
      let vPortName = 'vPort'+portNum;
      dispatch(getMyVirtualIP(vPortName));
      dispatch(getVPortBootNodesList(vPortName));
      dispatch(getRemoteRouterList(vPortName));

    }
}
