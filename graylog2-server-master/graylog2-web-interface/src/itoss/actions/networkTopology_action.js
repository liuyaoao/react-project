/**
* 网络拓朴 相关的 action 方法
*/

var History = require('react-router').History;
// var oDataTopology = require('../server/odataTopology');
// var Store = require('../server/store');


export const SET_NETWORKTOP_MESSAGEFLOWLIST = 'SET_NETWORKTOP_MESSAGEFLOWLIST'
export const SET_NETWORKTOP_HISTORY_MESSAGEFLOWLIST = 'SET_NETWORKTOP_HISTORY_MESSAGEFLOWLIST'

export const SET_STREAMID = 'SET_STREAMID'

export function set_NetworkTopMessageFlowData(networkTopMessageFlowData) {
  return {
      type: SET_NETWORKTOP_MESSAGEFLOWLIST,
      networkTopMessageFlowData
  }
}

export function set_NetworkTopHistoryMessageFlowData(networkTopHistoryMessageFlowData) {
  return {
      type: SET_NETWORKTOP_HISTORY_MESSAGEFLOWLIST,
      networkTopHistoryMessageFlowData
  }
}

export function set_streamId(streamId) {
  return {
      type: SET_STREAMID,
      streamId
  }
}

export function getNetworkTopHistoryMessageFlowData(filter) {
  return dispatch =>{
    // oDataTopology.getTpjbDictionaryData(data => {
    //   dispatch(set_NetworkTopHistoryMessageFlowData(data.results))
    // });
  }
}
