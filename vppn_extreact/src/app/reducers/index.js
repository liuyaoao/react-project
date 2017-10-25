var {combineReducers} = require('redux');
var homeReducer = require('./home_reducer');

const rootReducer = combineReducers({
  homeReducer
});

module.exports = rootReducer;
