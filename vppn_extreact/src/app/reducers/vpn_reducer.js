import {combineReducers} from 'redux';
import * as ACTIONS from '../actions/home_action';

var windowSizeChange2 = function(state = {windowId:'', flag:false}, action){
  switch (action.type) {
    case ACTIONS.SET_WINDOW_SIZE_CHANGE:
      return action.windowSizeChange;
    default:
      return state;
  }
}

const vpnReducer = combineReducers({
    windowSizeChange2,
})

export default vpnReducer;
