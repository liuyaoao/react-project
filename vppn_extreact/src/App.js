
import React,{Component} from 'react'
import {Provider} from 'react-redux';

import {Router,browserHistory} from 'react-router/es6';

import { renderWhenReady,Container } from '@extjs/reactor';
// import RootPc from './RootPc'; //pc端微软桌面风格页面。
import "./scss/screen.scss";

  import configureStore from './app/store/configureStore';
var store = configureStore();

// Enable responsiveConfig app-wide. You can remove this if you don't plan to build a responsive UI.
Ext.require('Ext.plugin.Responsive');


 class App extends Component {
   rootComp={
     path: '/',
    onEnter: this.preEnterMainRoot,
    getComponents: (location, callback) => {
         if(Ext.os.is.Phone){
           System.import('./RootMobile.js').then(this.importComponentSuccess(callback));
         }else{
           System.import('./RootPc.js').then(this.importComponentSuccess(callback));
         }
       }
   }
   importComponentSuccess=(callback)=>{
     return (comp) => callback(null, comp.default);
   }
   preEnterMainRoot = (nextState,replace, callback)=>{
     callback();
   }
   componentWillMount(){
   }
   componentDidMount(){

   }
    render() {

        return (
          <Provider store={store}>
            <Router
                history={browserHistory}
                routes={this.rootComp}
            />
          </Provider>
        )
    }
}
export default renderWhenReady(App);
