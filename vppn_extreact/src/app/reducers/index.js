import {combineReducers} from 'redux';
import homeReducer from './home_reducer';
import vpnReducer from './vpn_reducer';

const rootReducer = combineReducers({
  homeReducer,
  vpnReducer
});

export default rootReducer;
