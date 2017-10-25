var {combineReducers} = require('redux');
var ACTIONS = require('../actions/home_action');
var Store = require('../script/store');

var initUserLogin = Store.get('userLogin') || false;
var windowSizeChange = function(state = {windowId:'', flag:false}, action){
  switch (action.type) {
    case ACTIONS.SET_WINDOW_SIZE_CHANGE:
      return action.windowSizeChange;
    default:
      return state;
  }
}

var desktopType = function(state = 'router', action){
  switch (action.type) {
    case ACTIONS.SET_DESKTOP_TYPE:
      return action.desktopType;
    default:
      return state;
  }
}

var userLogin = function(state = true, action){
  switch (action.type) {
    case ACTIONS.SET_USER_LOGIN:
      return action.userLogin;
    default:
      return state;
  }
}

var errorMsg = function(state = '', action){
  switch (action.type) {
    case ACTIONS.SET_ERROR_MSG:
      return action.errorMsg;
    default:
      return state;
  }
}

var dialogMsg = function(state = {}, action){
  switch (action.type) {
    case ACTIONS.SET_DIALOG_MSG:
      return action.dialogMsg;
    default:
      return state;
  }
}

var cySize = function(state = '', action){
  switch (action.type) {
    case ACTIONS.SET_CYSIZE:
      return action.cySize;
    default:
      return state;
  }
}

var vpntopologyData = function(state = [], action){
  switch (action.type) {
    case ACTIONS.SET_VPNTOPOLOGYDATA:
      return action.vpntopologyData;
    default:
      return state;
  }
}

var vpntopologyStatus = function(state = [], action){
  switch (action.type) {
    case ACTIONS.SET_VPNTOPOLOGYSTATUS:
      return action.vpntopologyStatus;
    default:
      return state;
  }
}

var managerServerIP = function(state = '', action){
  switch (action.type) {
    case ACTIONS.SET_MANAGER_SERVER_IP:
      return action.managerServerIP;
    default:
      return state;
  }
}

var managerServerPort = function(state = '', action){
  switch (action.type) {
    case ACTIONS.SET_MANAGER_SERVER_PORT:
      return action.managerServerPort;
    default:
      return state;
  }
}

var proxyServerList = function(state = [], action){
  switch (action.type) {
    case ACTIONS.SET_PROXY_SERVER_LIST:
      return action.proxyServerList;
    default:
      return state;
  }
}

var managerServerSessionId = function(state = '', action){
  switch (action.type) {
    case ACTIONS.SET_MANAGER_SERVER_SESSIONID:
      return action.managerServerSessionId;
    default:
      return state;
  }
}

var myPhoneIP = function(state = '', action){
  switch (action.type) {
    case ACTIONS.SET_MY_PHONE_IP:
      return action.myPhoneIP;
    default:
      return state;
  }
}

var windowSize = function(state = '', action){
  switch (action.type) {
    case ACTIONS.SET_WINDOW_SIZE:
      return action.windowSize;
    default:
      return state;
  }
}

const homeReducer = combineReducers({
    windowSizeChange,
    desktopType,
    userLogin,
    errorMsg,
    dialogMsg,
    cySize,
    vpntopologyData,
    vpntopologyStatus,
    managerServerIP,
    managerServerPort,
    proxyServerList,
    managerServerSessionId,
    myPhoneIP,
    windowSize
})

module.exports = homeReducer;
