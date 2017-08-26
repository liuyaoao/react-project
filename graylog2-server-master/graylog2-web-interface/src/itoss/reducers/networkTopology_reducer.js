/**
* 网络拓朴 相关的 reducer 方法
*/

import { combineReducers } from 'redux'
import {
  SET_NETWORKTOP_MESSAGEFLOWLIST,SET_NETWORKTOP_HISTORY_MESSAGEFLOWLIST,
  SET_STREAMID
} from '../actions/networkTopology_action'

//实时消息流
//function networkTopMessageFlowData(state = [{"infoContent":"aaaa"},{"infoContent":"bbbb"},{"infoContent":"cccc"},{"infoContent":"ddd"},{"infoContent":"ddd"},{"infoContent":"bbbb"},{"infoContent":"cccc"},{"infoContent":"ddd"},{"infoContent":"ddd"},{"infoContent":"aaaa"},{"infoContent":"bbbb"},{"infoContent":"cccc"},{"infoContent":"ddd"},{"infoContent":"ddd"},{"infoContent":"bbbb"},{"infoContent":"cccc"},{"infoContent":"ddd"},{"infoContent":"ddd"},{"infoContent":"aaaa"},{"infoContent":"bbbb"},{"infoContent":"cccc"},{"infoContent":"ddd"},{"infoContent":"ddd"},{"infoContent":"bbbb"},{"infoContent":"cccc"},{"infoContent":"ddd"},{"infoContent":"ddd"}], action) {
function networkTopMessageFlowData(state = [], action) {
    switch (action.type) {
        case SET_NETWORKTOP_MESSAGEFLOWLIST:
            return action.networkTopMessageFlowData
        default:
            return state
    }
};
//历史消息流
function networkTopHistoryMessageFlowData(state = [], action) {
    switch (action.type) {
        case SET_NETWORKTOP_HISTORY_MESSAGEFLOWLIST:
            return action.networkTopHistoryMessageFlowData
        default:
            return state
    }
};

function streamId(state = "", action) {
    switch (action.type) {
        case SET_STREAMID:
            return action.streamId
        default:
            return state
    }
};

const networkTopologyReducer = combineReducers({
  networkTopMessageFlowData,
  networkTopHistoryMessageFlowData,
  streamId
})

export default networkTopologyReducer
